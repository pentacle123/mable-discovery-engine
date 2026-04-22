import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import opportunitiesData from '@/data/opportunities.json';
import servicesData from '@/data/services.json';
import accountsData from '@/data/accounts.json';
import type { Account, Opportunity, Service } from '@/types';

const opportunities = opportunitiesData.opportunities as Opportunity[];
const services = servicesData.services as Service[];
const accounts = accountsData.accounts as Account[];

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { opportunity_id } = (await req.json()) as { opportunity_id?: string };
    if (!opportunity_id) {
      return NextResponse.json({ error: 'opportunity_id required' }, { status: 400 });
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

    const linkedServices = opportunity.services
      .map((ref) => {
        const sv = services.find((s) => s.id === ref.id);
        if (!sv) return null;
        return `- ${sv.name} (${ref.role}): USP "${sv.usp}", 톤 "${sv.content_tone}", 심의 ${sv.review_risk}`;
      })
      .filter(Boolean)
      .join('\n');

    const primaryAccount = opportunity.account_kpi.primary
      ? accounts.find((a) => a.id === opportunity.account_kpi.primary)
      : null;

    const anthropic = new Anthropic({ apiKey });
    const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

    // 1단계: 3개 아이디어 "요약"만 생성 (스토리보드 제외) — 15-20초 목표
    const prompt = `너는 KB증권 마블(M-able) 숏폼 콘텐츠 카피라이터다. 주어진 소비자 기회에 대해 **서로 다른 각도의 숏폼 아이디어 정확히 3개**를 JSON 요약으로 반환해. 스토리보드·팩트시트는 이 단계에서 포함하지 말 것 (사용자가 클릭하는 시점에 별도 생성).

[기회 컨텍스트]
- ID/제목: ${opportunity.id} — ${opportunity.title}
- 서브타이틀: ${opportunity.subtitle}
- Why Now: ${opportunity.analysis.why_now}
- WHO: ${opportunity.analysis.who_tags.join(', ')} (${opportunity.analysis.who_evidence})
- WHEN: ${opportunity.analysis.when_tags.join(', ')} (${opportunity.analysis.when_evidence})
- PAIN: ${opportunity.analysis.pain_tags.join(', ')} (${opportunity.analysis.pain_evidence})
- USP FIT: ${opportunity.analysis.usp_fit_tags.join(', ')} (${opportunity.analysis.usp_fit_evidence})
- HOOK 방향: ${opportunity.analysis.hook_tags.join(', ')}
- 연간 검색량: ${opportunity.analysis.metrics.annual_volume ?? '미집계'} / 경쟁 ${opportunity.analysis.metrics.competition}
- 주요 관련 키워드: ${(opportunity.analysis.related_keywords || [])
      .map((k) => `${k.keyword}(${k.volume})`)
      .slice(0, 5)
      .join(', ')}
- 심의: ${opportunity.analysis.review_level} — ${opportunity.analysis.review_notes}
- 기존 후킹 초안: "${opportunity.hook_hypothesis}"

[시드]
타겟: ${opportunity.ai_ideas_seed.target} / 톤: ${opportunity.ai_ideas_seed.tone} / 포맷: ${opportunity.ai_ideas_seed.format_hint}

[연결된 마블 서비스]
${linkedServices || '(없음)'}

[연결된 계좌 KPI]
${primaryAccount ? `- ${primaryAccount.name} (${primaryAccount.name_full}) · 전략 ${primaryAccount.strategy}` : '(직접 연결 없음)'}

[3개 아이디어 분배 규칙 — 반드시 이 순서]
- #1: contentType "A" (후기체험형) · productionBy "creator" · 크리에이터 실제 경험·후기
- #2: contentType "B" (정보비교형) 또는 "C" (가격특가형) · productionBy "brand" · 브랜드 자체 비교/특가
- #3: contentType "F" (USP실증형) · productionBy "brand" · 마블 USP 직접 시연

contentTypeLabel 매핑: A→"후기체험형", B→"정보비교형", C→"가격특가형", D→"AI일정형", E→"데이터랭킹형", F→"USP실증형"

[sceneFlow 규칙 — 매우 중요]
배열 길이 정확히 4개. 각 씬은:
- **1줄 완결 문장, 15~25자 이내**
- 반드시 구체적 사실 포함 (앱명/금액/행동/장소/수치)
- 연출·카메라·자막·오버레이·BGM·표정 등 영상 제작 지시어 **절대 금지**
- 좋은 예: "스마트폰에 퇴직금 4,972만원 입금"
- 좋은 예: "국세청 계산기로 세금 321만원 확인"
- 좋은 예: "KB M-able IRP 계좌 개설 화면"
- 나쁜 예: "Scene 1. 크리에이터가 스마트폰을 보여주며 긴박감 있는 표정으로 자막 오버레이..."

[공통 규칙]
1. hook3s: 첫 3초 시선 멈춤 한 줄 (≤25자)
2. title: 내부 기획자용 한 줄 제목
3. conversionScore: 70~98 정수. #1 가장 높음, 순서대로 낮아짐 (예: 95, 90, 85)
4. stage: "Dream"|"Plan"|"Book"|"Share" 중 하나
5. targetKeyword + targetKeywordVol(숫자만)
6. creatorStrategy: 크리에이터와 어떻게 협업할지 한 줄
7. creatorSearchQueries: 이 아이디어 제작 가능한 크리에이터를 찾기 위한 YouTube 검색어 3개.
   - contentType A면 "[페르소나] 브이로그", "[주제] 후기", "[상황] 솔직 후기" 류
   - contentType B/C면 "[주제] 설명", "[주제] 비교", "[주제] 꿀팁" 류
   - contentType F면 "[앱명] 리뷰", "[기능] 써봤다", "[브랜드] 솔직 후기" 류
   - 뉴스 채널(KNN NEWS, MBC NEWS 등 방송사)은 매칭되지 않도록 **개인 크리에이터 지향 키워드**로 설계
8. dataProof: 데이터 근거 한 줄 (검색량·출처·수치)
9. uspConnection: 마블 서비스·계좌 KPI와 직결되는 USP 한 줄
10. 수익 보장·종목 추천·단정 금지. 심의 high 기회는 판단 배제·설명·요약 톤만.

[출력 형식]
아래 JSON만 반환. 설명·마크다운·코드펜스 금지.
{
  "ideas": [
    {
      "rank": 1,
      "title": "...",
      "contentType": "A",
      "contentTypeLabel": "후기체험형",
      "productionBy": "creator",
      "stage": "Plan",
      "conversionScore": 95,
      "hook3s": "...",
      "sceneFlow": ["...", "...", "...", "..."],
      "uspConnection": "...",
      "target": "...",
      "targetKeyword": "...",
      "targetKeywordVol": 172320,
      "creatorStrategy": "...",
      "creatorSearchQueries": ["...", "...", "..."],
      "dataProof": "...",
      "reviewWarnings": ["..."]
    }
  ]
}`;

    const response = await anthropic.messages.create({
      model,
      max_tokens: 3500,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n');

    const parsed = extractJson(text);
    if (!parsed || !Array.isArray(parsed.ideas)) {
      return NextResponse.json(
        { error: 'Claude 응답을 JSON으로 파싱할 수 없습니다.', raw: text.slice(0, 600) },
        { status: 502 }
      );
    }

    return NextResponse.json({ ideas: parsed.ideas, model });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function extractJson(text: string): { ideas?: unknown } | null {
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
