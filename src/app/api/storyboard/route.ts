import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import opportunitiesData from '@/data/opportunities.json';
import type { AIIdea, Opportunity } from '@/types';

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
- USP 연결: ${idea.uspConnection}
- 크리에이터 전략: ${idea.creatorStrategy}
- 데이터 근거: ${idea.dataProof}

[scenes 규칙 — 매우 중요]
youtubeShorts.scenes · instagramReels.scenes 각각 정확히 4개.
- **각 씬 1줄, 15-25자**
- 구체적 앱·서비스·수치·행동 포함
- "Scene N. N." 같은 중복 번호 표기 금지 (번호는 UI가 붙임)
- 연출·자막·오버레이·BGM·표정·"~느낌" 같은 영상 지시어 절대 금지
- 좋은 예: "스마트폰에 퇴직금 4,972만원 입금 알림"
- 좋은 예: "국세청 홈택스에서 세금 321만원 확인"
- 좋은 예: "KB M-able IRP 계좌 개설 화면"
- 좋은 예: "연금 시뮬레이션 + 다운로드 CTA"
- 나쁜 예: "Scene 1. 1. 크리에이터가 스마트폰을 보며 긴박감..."

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
      "timing": "..."
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
