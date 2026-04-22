// KB증권 M-able 서비스 사실 — /api/generate-ideas · /api/storyboard
// 프롬프트에 공통 삽입되는 "서비스 진입 경로 · 기능 · 소구 순간" 상세.
// 숏폼 씬에 특정 서비스가 등장할 때 모호한 "앱에서" 표현 대신 정확한
// 화면 경로가 쓰이도록 유도하는 용도.

export const MABLE_SERVICE_FACTS = `# KB증권 M-able 서비스 사실 (SERVICE FACTS)

## 마이브리프 (MY 브리프) · id: mybrief
진입: M-able > 홈 > 내투자자 화면에 MY 브리프 카드
기능: 내 보유·관심·최근 종목 기반 콘텐츠 최대 4개 자동 큐레이션
포함: 오늘의 콕 / PRIME CLUB / 스탑브리핑 (내 종목 관련 것만)
소구 순간: "이미 내가 산 종목의 소식을 놓치고 싶지 않을 때"
무료/유료: 무료
금지 표현: "AI가 추천", "종목 추천" (추천이 아니라 큐레이션)

## AI 시황요약 · id: ai-briefing
진입 1: M-able > 홈 > 국내/해외 탭 상단 (시장요약)
진입 2: 종목 현재가 > 우측 하단 플로팅 버튼 (종목요약)
시장요약 8개 카테고리: 시장이슈 / 경제지표 및 전망 / 특정종목 및 섹터동향 / 주요 인사발언 / 주요 일정 및 이벤트 / 채권 및 금리 / 기업 실적 / 환율 및 원자재
종목요약 범위: 실적·재무·전략·공시/신제품 뉴스 AI 요약 (근거뉴스 포함)
소구 순간: "복잡한 뉴스·모르는 개념을 3분에 이해하고 싶을 때"
무료/유료: 무료
금지 표현: "AI 추천" (요약이지 추천 아님)

## 오늘의 콕 · id: today-kok
기능: 1분 브리핑 콘텐츠 (국내주식 / 해외주식 / 투자전략 카테고리)
형식: 짧은 카드 형식, 매일 1개씩 업데이트
소구 순간: "출근길·점심시간 하루 1분만 투자 공부하고 싶을 때"
무료/유료: 무료
금지 표현: "깊이 있는 분석" (그건 PRIME CLUB)

## PRIME CLUB · id: prime-club
기능: KB증권 공식 전문가 유료 콘텐츠
하위 서비스: 탐방노트·추천주·관심주·해외주식·ETF / 오늘의 투자전략(모닝전략·HOT이슈·마감전략·주간이슈)
소구 순간: "큰 돈 걸린 결정, 블로그 말고 공식 전문가 의견 듣고 싶을 때"
무료/유료: 유료 구독 (프리미엄 가치)
강조 키워드: "KB증권 공식 전문가", "탐방", "추천주"
금지 표현: "무료로" (유료 서비스)

## 공모주 모아보기 · id: ipo-tracker (2026.2월 신규)
진입: M-able > 메뉴 > 공모주/청약 > 공모주 모아보기
기능: 공모주 캘린더(단계별 일정) · 당사/타사 경쟁률 · 종목정보 · 실적정보 · IR자료 · 청약일 카운트다운
소구 순간: "공모주 청약 타이밍 놓치고 싶지 않을 때"
무료/유료: 무료
강조 키워드: "D-day", "경쟁률 278:1", "상장일", "공모가"
`;

// 서비스 id → 한글 공식 명칭 (SERVICE FACTS에서 쓰는 이름과 일치)
export const SERVICE_LABEL: Record<string, string> = {
  mybrief: '마이브리프',
  'ai-briefing': 'AI 시황요약',
  'today-kok': '오늘의 콕',
  'prime-club': 'PRIME CLUB',
  'ipo-tracker': '공모주 모아보기'
};

// 6개 기회에 대해 "이 기회 = 이 서비스" 명시적 잠금.
// opportunities.json 미수정 · 프롬프트 레벨에서만 강제.
export const OPPORTUNITY_SERVICE_LOCK: Record<string, string> = {
  'O-A01': 'mybrief',
  'O-A06': 'ai-briefing',
  'O-A09': 'ai-briefing',
  'O-B04': 'prime-club',
  'O-B08': 'prime-club',
  'O-B14': 'ai-briefing'
};

export const SCENE_COMPOSITION_RULES = `[sceneFlow 구성 규칙 — 4개 씬 구조]
- 씬 1: 타겟의 문제·고민·상황 설정 (수치 없어도 OK)
- 씬 2: 문제를 구체화하는 숫자/팩트 (검색량·가격·손실액 등)
- 씬 3: **마블의 해당 서비스가 이 상황에서 도움 되는 장면**
        → **반드시 구체적 진입 경로 포함**
        ex) "M-able 홈 해외 탭 상단 AI 시황요약 시장이슈 카테고리"
        ex) "종목 현재가 > 우측 하단 플로팅 버튼 (종목요약)"
        ex) "홈 내투자자 화면 MY 브리프 카드 · 내 보유 종목 소식"
        ex) "M-able > 메뉴 > 공모주/청약 > 공모주 모아보기 D-day 캘린더"
- 씬 4: 서비스를 통해 해결된 결과 + CTA (예: "앱스토어 M-able 검색")

규칙:
- 실제 화면 명칭 사용 필수. "앱에서" 같은 모호한 표현 금지.
- 씬 3에 등장하는 서비스는 **아이디어가 선택한 primary 서비스 단 1개**. 2개 이상 혼용 금지.
- "AI가 추천" · "AI 추천" 표현 금지 (마이브리프=큐레이션, AI 시황요약=요약·해설, PRIME CLUB=전문가 의견).
- PRIME CLUB 관련 씬에 "무료로" 금지 (유료 구독).
- 각 씬은 1줄 15~25자, 구체적 사실 포함, 연출 지시어 금지.
`;

export const SINGLE_SERVICE_RULE = `[단일 서비스 선택 규칙 — 가장 강한 1개만]
opportunity.services 배열에 여러 서비스가 있어도, 아이디어마다 **가장 직접적으로 매칭되는 서비스 1개만** 선택해서 sceneFlow의 씬 3에 등장시킬 것.

하나의 아이디어 = 하나의 서비스 = 하나의 메시지.
크로스셀·2개 서비스 동선 설계 금지.

선택 기준 (서비스 id 기준):
- 타겟이 이미 보유한 종목이 있다 / 개인화 알림이 핵심 → mybrief
- 뉴스·개념 이해·3분 요약이 핵심 니즈 → ai-briefing
- 1분 짧은 학습·입문·꿀팁이 핵심 → today-kok
- 전문가 신뢰성·탐방·추천주가 핵심 → prime-club
- 공모주 청약 일정·경쟁률이 핵심 → ipo-tracker

3개 아이디어 모두 같은 서비스를 선택해도 OK (타겟·Hook·씬 각도만 다르면 됨).
`;

/**
 * Build the opportunity-specific lock directive for the prompt.
 * If the opportunity ID is in OPPORTUNITY_SERVICE_LOCK, all 3 ideas
 * must use that service. Otherwise returns an empty string.
 */
export function serviceLockDirective(opportunityId: string): string {
  const locked = OPPORTUNITY_SERVICE_LOCK[opportunityId];
  if (!locked) return '';
  const label = SERVICE_LABEL[locked] || locked;
  return `\n[서비스 잠금 — 이 기회 전용 규칙]\n이 기회(${opportunityId})는 3개 아이디어 모두 **${label} (id: ${locked})** 서비스만 등장시킬 것. 다른 서비스로 대체 금지. opportunity.services 배열에 다른 서비스가 있어도 무시.\n`;
}
