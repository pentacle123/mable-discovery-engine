import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import opportunitiesData from '@/data/opportunities.json';
import type { AIIdea, Opportunity } from '@/types';
import {
  MABLE_SERVICE_FACTS,
  SCENE_COMPOSITION_RULES,
  serviceLockDirective
} from '@/lib/serviceFacts';

const opportunities = opportunitiesData.opportunities as Opportunity[];

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// On-demand storyboard generator — called when the user clicks
// "스토리보드 보기 →" on a specific idea card. Produces a single
// idea's storyboard (youtubeShorts + instagramReels + factSheet).
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { opportunity_id?: string; idea?: AIIdea };
    const { opportunity_id, idea } = body;

    if (!opportunity_id || !idea) {
      return NextResponse.json({ error: 'opportunity_id + idea required' }, { status: 400 });
    }

    const opportunity = opportunities.find((o) => o.id === opportunity_id);
    if (!opportunity) {
      return NextResponse.json({ error: 'opportunity not found' }, { status: 404 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY 가 .env.local 에 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });
    const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

    const prompt = `너는 KB증권 마블 숏폼 스토리보드 감독·미디어 플래너다. 주어진 **단일 아이디어**에 대해 YouTube Shorts + Instagram Reels 병렬 스토리보드 + 팩트시트를 JSON으로 반환해.

[기회]
- ${opportunity.id} — ${opportunity.title} / ${opportunity.subtitle}
- 타겟: ${opportunity.ai_ideas_seed.target}
- 톤: ${opportunity.ai_ideas_seed.tone}
- 심의: ${opportunity.analysis.review_level} · ${opportunity.analysis.review_notes}

[아이디어]
- #${idea.rank} · ${idea.contentType} ${idea.contentTypeLabel} · ${idea.productionBy}
- 제목: ${idea.title}
- Hook: "${idea.hook3s}"
- Scene flow (키워드): ${(idea.sceneFlow || []).map((s, i) => `${i + 1}) ${s}`).join(' / ')}
- Target keyword: ${idea.targetKeyword} (${idea.targetKeywordVol}/연)
- USP 연결 (= 선택된 단일 마블 서비스): ${idea.uspConnection}
- 크리에이터 전략: ${idea.creatorStrategy}
- 데이터 근거: ${idea.dataProof}

${MABLE_SERVICE_FACTS}
${serviceLockDirective(opportunity.id)}
${SCENE_COMPOSITION_RULES}

[scenes 보충 규칙]
youtubeShorts.scenes · instagramReels.scenes 각각 정확히 4개 · 각 씬 1줄 15-25자.
- "Scene N. N." 같은 중복 번호 표기 금지 (번호는 UI가 붙임)
- 연출·자막·오버레이·BGM·표정·"~느낌" 같은 영상 지시어 절대 금지
- **씬 3은 아이디어가 선택한 단일 마블 서비스의 구체 진입 경로**.
- 좋은 예: "홈 해외 탭 AI 시황요약 시장이슈 카테고리"
- 좋은 예: "종목 현재가 우측 플로팅 종목요약 3분 해설"
- 좋은 예: "홈 내투자자 MY 브리프 카드 · 내 보유 종목"
- 좋은 예: "메뉴 공모주/청약 공모주 모아보기 D-day"
- 나쁜 예: "앱에서 AI 추천으로..." (모호·금지 표현)

플랫폼 차별화:
- YouTube Shorts: 정보 밀도 · 수치 강조 · 명확한 CTA
- Instagram Reels: 감정 훅 · 비주얼 중심 · 짧은 전환

[팩트시트 규칙 — 신규 4블록 구조]
factSheet 객체는 반드시 아래 4개 필드:

1. serviceAssets (배열) — 숏폼에 등장해야 할 앱·서비스·사이트
   각 항목: { name, access, path, tip }
   - name: "KB증권 M-able"
   - access: "앱스토어 'M-able' 검색 / iOS·Android"
   - path: "홈 > AI투자브리핑 > IRP 계좌"
   - tip: "화면 녹화 시 개인정보 블러 처리"

2. keyMetrics (배열) — 숏폼에 인용할 검증된 수치
   각 항목: { metric, value, source, caveat }
   - metric: "퇴직소득세 예시 계산"
   - value: "약 300만~350만원 (근속 5년 5,000만원 기준)"
   - source: "국세청 홈택스 2026년 기준"
   - caveat: "개인 상황에 따라 상이"

3. legalChecks (배열, 3-5개 문자열) — 법적/심의 체크포인트
   - 필수 자막 문구 ("개인 상황에 따라 다를 수 있음" 등)
   - 언급 금지 ("세금 면제", "수익 보장" 등)
   - 대체 가능 표현 ("과세이연"/"세액공제 한도 내" 등)

4. timing (문자열) — 최적 제작·공개 타이밍. 시즌성·골든타임 포함.

5. mableConnection (객체 · **반드시 아래 4필드 객체로 반환**, 문자열로 반환 금지):
   - service_name: 선택된 단일 서비스 한글명 (마이브리프 / AI 시황요약 / 오늘의 콕 / PRIME CLUB / 공모주 모아보기)
   - entry_path: 위 SERVICE FACTS의 진입 경로 그대로 (예: "M-able 홈 해외 탭 상단 AI 시황요약")
   - specific_content: 8개 카테고리 중 어디 / 어떤 화면 조각인지 (예: "시장이슈 카테고리 중 'RIA 계좌 도입' 요약")
   - why_here: 타겟에게 이 경로가 왜 최적인지 한 줄 (예: "서학개미에게 RIA 개념을 3분 안에 설명하는 가장 빠른 경로")

[출력]
아래 JSON만. 설명·마크다운·코드펜스 금지.
{
  "storyboard": {
    "youtubeShorts": {
      "title": "...",
      "hook": "...",
      "scenes": ["...", "...", "...", "..."],
      "proof": "...",
      "cta": "...",
      "hashtags": ["...", "...", "...", "..."],
      "uploadTime": "...",
      "targetCluster": "..."
    },
    "instagramReels": {
      "title": "...",
      "hook": "...",
      "scenes": ["...", "...", "...", "..."],
      "proof": "...",
      "cta": "...",
      "hashtags": ["...", "...", "...", "..."],
      "uploadTime": "...",
      "targetCluster": "..."
    },
    "factSheet": {
      "serviceAssets": [{"name":"...","access":"...","path":"...","tip":"..."}],
      "keyMetrics": [{"metric":"...","value":"...","source":"...","caveat":"..."}],
      "legalChecks": ["...", "...", "..."],
      "timing": "...",
      "mableConnection": {
        "service_name": "...",
        "entry_path": "...",
        "specific_content": "...",
        "why_here": "..."
      }
    }
  }
}`;

    const response = await anthropic.messages.create({
      model,
      max_tokens: 4500,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n');

    const parsed = extractJson(text);
    if (!parsed || !parsed.storyboard) {
      return NextResponse.json(
        { error: 'Claude 응답을 JSON으로 파싱할 수 없습니다.', raw: text.slice(0, 600) },
        { status: 502 }
      );
    }

    return NextResponse.json({ storyboard: parsed.storyboard, model });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function extractJson(text: string): { storyboard?: unknown } | null {
  let t = text.trim();
  if (t.startsWith('```')) {
    t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '');
  }
  try {
    return JSON.parse(t);
  } catch {
    /* fall through */
  }
  const first = t.indexOf('{');
  const last = t.lastIndexOf('}');
  if (first >= 0 && last > first) {
    try {
      return JSON.parse(t.slice(first, last + 1));
    } catch {
      /* fall through */
    }
  }
  return null;
}
