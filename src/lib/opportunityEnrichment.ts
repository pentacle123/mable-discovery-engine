// Client-side enrichment layer for opportunity cards.
// JSON data (/data/opportunities.json) is NOT modified — this file
// adds the copy/visual fields the UI needs (persona, emoji, narrative, etc.).

export type Tone =
  | '시의성폭발'
  | '위기대응'
  | '생애전환'
  | '일상진입'
  | '정보갈증'
  | '자산설계';

export interface ToneMeta {
  key: Tone;
  label: string;
  icon: string;
  bg: string;
  fg: string;
  chipBg: string;
}

export const TONE_META: Record<Tone, ToneMeta> = {
  '시의성폭발': {
    key: '시의성폭발',
    label: '🔥 시의성',
    icon: '🔥',
    bg: '#FCEBEB',
    fg: '#791F1F',
    chipBg: '#FCEBEB'
  },
  '위기대응': {
    key: '위기대응',
    label: '⚡ 위기',
    icon: '⚡',
    bg: '#FAEEDA',
    fg: '#854F0B',
    chipBg: '#FAEEDA'
  },
  '생애전환': {
    key: '생애전환',
    label: '🎯 전환',
    icon: '🎯',
    bg: '#EEEDFE',
    fg: '#3C3489',
    chipBg: '#EEEDFE'
  },
  '일상진입': {
    key: '일상진입',
    label: '🌱 진입',
    icon: '🌱',
    bg: '#EAF3DE',
    fg: '#3B6D11',
    chipBg: '#EAF3DE'
  },
  '정보갈증': {
    key: '정보갈증',
    label: '💡 정보',
    icon: '💡',
    bg: '#E6F1FB',
    fg: '#0C447C',
    chipBg: '#E6F1FB'
  },
  '자산설계': {
    key: '자산설계',
    label: '💰 자산',
    icon: '💰',
    bg: '#FAEEDA',
    fg: '#BA7517',
    chipBg: '#FAEEDA'
  }
};

export interface Enrichment {
  emoji: string;
  tone: Tone;
  persona: string;
  hookLabel: string;
  hookCopy: string;
  narrative: string;
  contentType: string;
  consumerQuote: string;
}

// 49 opportunities × curated copy.
// Narrative lines prefer lived-in numbers from JSON (연간·월평균·증가율).
export const ENRICHMENT: Record<string, Enrichment> = {
  // ───────────── 🅐 직접 투자자 ─────────────
  'O-A01': {
    emoji: '📈',
    tone: '정보갈증',
    persona: '테슬라·엔비디아로 일희일비하는 3040',
    hookLabel: 'Daily-hook',
    hookCopy: '오늘의 테크주 체크 3가지',
    narrative:
      '연 3,850만, 월 3,234만 피크(2026.1). 남 70%+, 30-44세 주력 + 50대 서학개미 유입. 변동성 장세에 일일 모니터링 루틴 고착.',
    contentType: '알림',
    consumerQuote: '😵 테슬라 또 빠졌는데 왜 빠진거야...'
  },
  'O-A02': {
    emoji: '💹',
    tone: '자산설계',
    persona: '은퇴 앞두고 월배당 현금흐름 찾는 4050',
    hookLabel: 'Income-hook',
    hookCopy: '배당률만 보면 놓치는 3가지',
    narrative:
      '연 40만, 꾸준한 증가세. 남 61% · 30-44세 + 50대 42%. 금리 인하 기대 + 은퇴 세대 유입 = 월배당 ETF 관심 폭증.',
    contentType: '해설',
    consumerQuote: '🤔 월배당 ETF 고르는 기준이 뭐야...'
  },
  'O-A03': {
    emoji: '💵',
    tone: '정보갈증',
    persona: '환율 한 번에 수익률 흔들리는 서학개미',
    hookLabel: 'FX-hook',
    hookCopy: '달러 1,400원 넘은 날의 1가지',
    narrative:
      '연 49만 + 미국주식 추천 연 26만. 남 65%, 50대 34% · 40대 29%. 환율 변동성 지속 + RIA 계좌(O-ACC11) 연계 선택지 부상.',
    contentType: '해설',
    consumerQuote: '😰 환율 오르는데 지금 사도 되나...'
  },
  'O-A04': {
    emoji: '🚨',
    tone: '시의성폭발',
    persona: '반대매매 통보받은 긴급 투자자',
    hookLabel: 'Panic-hook',
    hookCopy: '당일 3가지부터 체크',
    narrative:
      '연 17만 / +2,951% 🔥🔥 폭발. 2026.3 급락 여파 실시간. 남 63% · 40-50대. 패닉 매도 전 프로세스 설명 콘텐츠 수요 극대.',
    contentType: '긴급',
    consumerQuote: '😨 반대매매 떴어요 지금 어떡하죠...'
  },
  'O-A05': {
    emoji: '😰',
    tone: '위기대응',
    persona: '존버·물타기·손절 사이에서 흔들리는 투자자',
    hookLabel: 'Psych-hook',
    hookCopy: '물타기 전 평균단가 계산법',
    narrative:
      '연 15.3만, 의외로 여성 58-61%. 평균단가·손절·존버 동시 검색. 심리 불안을 "계산·기준"으로 전환하는 콘텐츠 여지.',
    contentType: '가이드',
    consumerQuote: '😩 지금 팔아야 해 물타야 해...'
  },
  'O-A06': {
    emoji: '📉',
    tone: '위기대응',
    persona: '공포탐욕지수 보며 타이밍 찾는 학습자',
    hookLabel: 'Timing-hook',
    hookCopy: 'VIX 30 넘으면 사야 한다?',
    narrative:
      '연 30만 / +54%. VIX·공포탐욕지수 실시간 체크. 기계적 매수 전략 학습자 세그먼트. 10년 데이터 기반 해설 수요.',
    contentType: '해설',
    consumerQuote: '🙄 VIX 높을 때 사라는데 진짜야...'
  },
  'O-A07': {
    emoji: '📊',
    tone: '정보갈증',
    persona: 'ETF가 뭔지 검색하는 초심자',
    hookLabel: 'Rookie-hook',
    hookCopy: '주식이랑 뭐가 다른지 3가지',
    narrative:
      '연 36만. "ETF가 뭐야 · 주식이랑 차이 · 사는법" 입문 클러스터. today-kok + ai-briefing 연동 입문 가이드 최적.',
    contentType: '입문',
    consumerQuote: '🤔 ETF가 주식이랑 뭐가 다른거야...'
  },
  'O-A08': {
    emoji: '🧠',
    tone: '자산설계',
    persona: '분산투자 논쟁 파고드는 심화 학습자',
    hookLabel: 'Depth-hook',
    hookCopy: '찰리 멍거가 한 말의 정확한 의미',
    narrative:
      '연 18만. "분산투자 하지마라" 논쟁 · 찰리 멍거 인용 증가. ISA 연계 가능. 전문가 해석 콘텐츠 수요 명확.',
    contentType: '전문가',
    consumerQuote: '🤨 집중투자 vs 분산투자 진짜 뭐가 맞아...'
  },
  'O-A09': {
    emoji: '⚙️',
    tone: '자산설계',
    persona: '테마 ETF 구성 종목 확인하는 투자자',
    hookLabel: 'Theme-hook',
    hookCopy: '반도체 ETF 6종 숨은 차이',
    narrative:
      '연 50만. 반도체·원전·방산·AI 테마 ETF 비교 검색. KODEX·TIGER 구성 종목 차이가 핵심 고민. mybrief 알림 연계.',
    contentType: '해설',
    consumerQuote: '😵 KODEX랑 TIGER 같은 거 아니야...'
  },
  'O-A10': {
    emoji: '📑',
    tone: '자산설계',
    persona: '양도세·배당세로 갑자기 당황한 투자자',
    hookLabel: 'Tax-hook',
    hookCopy: '2026 바뀐 세법 5분 정리',
    narrative:
      '연 24만. 2026 세법 개정 + 양도세·배당세 통합 궁금증. today-kok 꿀팁형 + prime-club 전문가 해석 조합 최적.',
    contentType: '가이드',
    consumerQuote: '😓 배당 받았는데 세금 이렇게 많이...'
  },
  'O-A11': {
    emoji: '🏝️',
    tone: '자산설계',
    persona: '10억 목표 세운 경제적 자유 지망자',
    hookLabel: 'Freedom-hook',
    hookCopy: '파이어 10억, 2026년 환산 계산',
    narrative:
      '연 43만 / +27%. 10억·20억·배당 파이어 목표 확산. 4%룰·배당 현금흐름·현실 목표액 재산정 수요. mybrief+ai-briefing 조합.',
    contentType: '전문가',
    consumerQuote: '🤔 10억 있으면 진짜 은퇴 가능해...'
  },
  // ───────────── 🅑 생애 전환점 ─────────────
  'O-B01': {
    emoji: '👔',
    tone: '시의성폭발',
    persona: '퇴직금 받는 날을 앞둔 직장인',
    hookLabel: 'Retirement-hook',
    hookCopy: 'IRP 이체 vs 일시수령 세금 차이',
    narrative:
      '연 125만 / +120% 🔥. 30대 이직 37% + 50대 정년 = 이중 수요. "퇴직소득세 계산" 연 12만. prime-club 전문가 해설 핵심.',
    contentType: '전문가',
    consumerQuote: '😰 퇴직금 일시로 받으면 세금 얼마나...'
  },
  'O-B02': {
    emoji: '📅',
    tone: '생애전환',
    persona: '노후 걱정 시작한 30·40대 선제 설계자',
    hookLabel: 'Early-hook',
    hookCopy: '30대 시작이 40대에 얼마나 쉬운가',
    narrative:
      '연 24만. "30대 노후준비 · 40대 노후준비" 동반 검색. 시간 레버리지 강조. prime-club + ai-briefing 장기 시뮬 콘텐츠.',
    contentType: '전문가',
    consumerQuote: '🤔 30대에 얼마 모아야 늦지 않은거야...'
  },
  'O-B03': {
    emoji: '👨‍👩‍👧',
    tone: '생애전환',
    persona: '결혼 앞두고 부모 통장 현실 알게 된 3040',
    hookLabel: 'Family-hook',
    hookCopy: '결혼 전에 할 준비 3가지',
    narrative:
      '연 12만. 결혼 세대의 부모 노후 걱정 검색. today-kok 입문 + prime-club 상담 결합. 세대간 자산 이전 이슈 연결.',
    contentType: '가이드',
    consumerQuote: '😔 부모님 통장 생각보다 적은데...'
  },
  'O-B04': {
    emoji: '🏠',
    tone: '생애전환',
    persona: '내 집 현금화 고민하는 은퇴 앞둔 세대',
    hookLabel: 'Home-hook',
    hookCopy: '주택연금 아무도 안 알려준 3가지',
    narrative:
      '연 61만 / +18%. 주택연금·사망시점·상속·매도 후 투자 비교. prime-club 전문가 상담 + today-kok 제도 정리 조합.',
    contentType: '전문가',
    consumerQuote: '🤨 주택연금 들면 진짜 자식한테 못 남기나...'
  },
  'O-B05': {
    emoji: '⏳',
    tone: '생애전환',
    persona: '퇴직 10년 앞두고 자산 부족 느끼는 50대',
    hookLabel: 'Lastlap-hook',
    hookCopy: '최후 10년 현실적 3가지',
    narrative:
      '연 12만. 50대 후반 노후 준비 마지막 구간. 리스크·수익 균형 재설계 수요. prime-club 맞춤 + mybrief 모니터링.',
    contentType: '전문가',
    consumerQuote: '😟 지금부터 모아도 늦은건가요...'
  },
  'O-B06': {
    emoji: '🧾',
    tone: '자산설계',
    persona: '연말정산 세액공제 최적화 직장인',
    hookLabel: 'Tax-hook',
    hookCopy: 'IRP vs 연금저축 하나 고를 질문',
    narrative:
      '연 131만. 매년 11-2월 세액공제 피크. "연금저축+IRP 합쳐서" 동반 검색. today-kok 꿀팁 + ai-briefing 해설 최적.',
    contentType: '가이드',
    consumerQuote: '🤷 IRP랑 연금저축 뭐가 더 유리한거야...'
  },
  'O-B07': {
    emoji: '🗂️',
    tone: '자산설계',
    persona: 'ISA로 5년 절세 효과 챙기는 직장인',
    hookLabel: 'Tax-hook',
    hookCopy: '5년 뒤 실제 절세 금액 계산',
    narrative:
      '연 60만. ISA 비과세 한도 소진 전략 검색. 2016 출시 10년 만기 + 2026 제도 변경 더블 트리거. today-kok 계산 콘텐츠.',
    contentType: '가이드',
    consumerQuote: '🤔 ISA 만들어두기만 했는데 뭘 넣어야...'
  },
  'O-B08': {
    emoji: '💸',
    tone: '자산설계',
    persona: '월 200 배당 목표 세운 은퇴 설계자',
    hookLabel: 'Income-hook',
    hookCopy: '세후 월 200 만들 자산 규모',
    narrative:
      '연 34만. "배당만으로 월 200" 라이프스타일 목표. 세후 계산 + 포트폴리오 설계 수요. prime-club + mybrief 배당 알림.',
    contentType: '전문가',
    consumerQuote: '💭 배당으로 월 200 만들려면 얼마나...'
  },
  'O-B09': {
    emoji: '👶',
    tone: '생애전환',
    persona: '자녀 명의 증여 고민하는 부모',
    hookLabel: 'Gift-hook',
    hookCopy: '증여세 안 내는 선 3가지',
    narrative:
      '연 4.8만 / +31%. 자녀 명의 주식·증여세 면제 한도 검색. today-kok 제도 정리 + prime-club 자산 설계 조합.',
    contentType: '가이드',
    consumerQuote: '🤔 아이 통장에 얼마까지 넣어도 세금 안내...'
  },
  'O-B10': {
    emoji: '🍼',
    tone: '생애전환',
    persona: '백일선물로 첫 금융 고민하는 엄마',
    hookLabel: 'Baby-hook',
    hookCopy: '아기 주식 계좌 추천 3가지',
    narrative:
      '연 36만. 2026 출산 세대 블루오션. "아기 통장 · 백일선물 · 주식계좌" 동반 검색. mybrief 알림 + ipo-tracker 공모주 결합.',
    contentType: '가이드',
    consumerQuote: '🥺 아이한테 첫 선물로 뭐가 좋을까...'
  },
  'O-B11': {
    emoji: '💍',
    tone: '생애전환',
    persona: '결혼 3년 앞두고 맞벌이 통장 짜는 커플',
    hookLabel: 'Couple-hook',
    hookCopy: '예적금 vs 투자 실제 차이',
    narrative:
      '연 146만. 결혼·내집마련 대형 지출 준비 최대 볼륨. 장기 적립식 vs 단기 예적금 선택 고민. today-kok + ipo-tracker 조합.',
    contentType: '가이드',
    consumerQuote: '🤔 3년 모을건데 예적금만 하면 되나...'
  },
  'O-B12': {
    emoji: '📈',
    tone: '시의성폭발',
    persona: '코스피 5000에 "지금 들어가도 돼?" 묻는 신규 투자자',
    hookLabel: 'Confusion-hook',
    hookCopy: '2008·2020 데이터로 본 답',
    narrative:
      '연 60만. 2026 국장 활황 + 신규 혼란자 대량 생성. "이게 좋은거야?" 전연령·남녀 균형 신세그먼트. ai-briefing 해설 핵심.',
    contentType: '해설',
    consumerQuote: '😰 코스피 5000인데 지금 사면 늦은거야...'
  },
  'O-B13': {
    emoji: '🎟️',
    tone: '자산설계',
    persona: '이번 주 공모주 배정 계산하는 투자자',
    hookLabel: 'IPO-hook',
    hookCopy: '균등배정 몇 주씩 받을까',
    narrative:
      '연 38만. 신규 상장·청약·수요예측 동반 검색. ipo-tracker 일정 정리 + mybrief 배정 알림 최적 연결.',
    contentType: '정리',
    consumerQuote: '🤔 균등배정 몇 주나 받을 수 있는거야...'
  },
  'O-B14': {
    emoji: '📰',
    tone: '정보갈증',
    persona: '금리·환율 뉴스에 월배당 바뀔까 걱정하는 투자자',
    hookLabel: 'Macro-hook',
    hookCopy: '금리 인하 시작 시 월배당 영향',
    narrative:
      '연 250만. 거시 이벤트 민감자 최대 풀. 금리·환율·채권 변화가 포트폴리오에 미칠 영향 실시간 해설 수요. ai-briefing 핵심.',
    contentType: '해설',
    consumerQuote: '🤔 금리 내리면 내 월배당은 어떻게...'
  },
  // ───────────── 🅒 라이프스타일 진입 ─────────────
  'O-C01': {
    emoji: '🚗',
    tone: '일상진입',
    persona: '테슬라 FSD 체감하며 밸류체인 검색하는 오너',
    hookLabel: 'Lifestyle-hook',
    hookCopy: '테슬라 말고 살 밸류체인 4개',
    narrative:
      '연 24만. 실사용자의 피터 린치식 진입. FSD 한국 도입 뉴스가 트리거. mybrief 관심주 등록 + ai-briefing 섹터 해설.',
    contentType: '해설',
    consumerQuote: '🤔 테슬라 타다보니 어떤 주식 사야...'
  },
  'O-C02': {
    emoji: '🤖',
    tone: '일상진입',
    persona: 'Claude·ChatGPT 매일 쓰는 AI 도구 파워유저',
    hookLabel: 'AI-hook',
    hookCopy: '앤트로픽 주식 사는 유일한 방법',
    narrative:
      '연 24만. AI 도구 일상 사용자가 MS·구글·엔비디아 주식으로 번짐. 앤트로픽 비상장 이슈가 차별화 포인트. ai-briefing + prime-club.',
    contentType: '해설',
    consumerQuote: '🤔 Claude 쓰는데 앤트로픽 주식 못 사...'
  },
  'O-C03': {
    emoji: '📱',
    tone: '일상진입',
    persona: '애플 생태계 속에서 부품주 찾는 유저',
    hookLabel: 'Ecosystem-hook',
    hookCopy: '폴더블 출시 시 움직일 부품주 3곳',
    narrative:
      '연 18만. 애플 신제품 루머(폴더블·비전프로) → 국내 부품주 관심 전이. mybrief 관심주 설정 + ai-briefing 밸류체인 해설.',
    contentType: '해설',
    consumerQuote: '🤔 애플 관련주 뭘 사야 할지...'
  },
  'O-C04': {
    emoji: '🎤',
    tone: '일상진입',
    persona: '최애 아이돌 기획사 주식 고민하는 K-팝 팬',
    hookLabel: 'Fan-hook',
    hookCopy: '팬심 말고 체크할 3가지',
    narrative:
      '연 24만. K-팝·K-콘텐츠 팬의 기획사 주식화. "단순 팬심"을 투자 기준으로 전환하는 해설 수요. today-kok + mybrief 조합.',
    contentType: '해설',
    consumerQuote: '🤔 내 최애 기획사 주식 지금 사도 돼...'
  },
  'O-C05': {
    emoji: '🛍️',
    tone: '일상진입',
    persona: '올리브영·아모레 쓰다 주식 생각난 소비자',
    hookLabel: 'Brand-hook',
    hookCopy: '라이프 브랜드 상장 여부 체크',
    narrative:
      '연 12만. 브랜드 소비자의 주식 전환. 올리브영 비상장 이슈 + 상장 브랜드 선별이 핵심. mybrief + today-kok 조합.',
    contentType: '해설',
    consumerQuote: '🤔 올리브영 주식 사고 싶은데 없어...'
  },
  'O-C06': {
    emoji: '💊',
    tone: '일상진입',
    persona: '위고비·GLP-1 열풍으로 헬스주 찾는 소비자',
    hookLabel: 'Health-hook',
    hookCopy: '열풍 시작 시 놓친 3개 주식',
    narrative:
      '연 18만. 위고비·GLP-1 메가 트렌드. 비만치료제 밸류체인 해설 수요. ai-briefing 섹터 + today-kok 입문 가이드 최적.',
    contentType: '해설',
    consumerQuote: '🤔 위고비 관련주 지금도 늦지 않은거야...'
  },
  'O-C07': {
    emoji: '🎮',
    tone: '일상진입',
    persona: '재밌던 그 게임 회사 주가 이상한 게이머',
    hookLabel: 'Game-hook',
    hookCopy: '재미 ≠ 주가인 이유',
    narrative:
      '연 9.6만. 게임 유저의 주가 괴리 의문. 매출 구조 해설 수요. mybrief 관심주 등록 + ai-briefing 기업 분석.',
    contentType: '해설',
    consumerQuote: '🙄 내가 재밌게 하던 게임인데 왜 주가는...'
  },
  'O-C08': {
    emoji: '🛰️',
    tone: '일상진입',
    persona: 'AI·전력·방산 메가트렌드 관찰자',
    hookLabel: 'Macro-hook',
    hookCopy: '전력 부족 시 오를 3개 섹터',
    narrative:
      '연 36만. AI 데이터센터·SMR·방산·우주 테마 관측. 거시 → 종목 연결 해설 수요 증가. ai-briefing + prime-club 조합.',
    contentType: '전문가',
    consumerQuote: '🤔 AI 시대에 전력이 부족해진다던데...'
  },
  'O-C09': {
    emoji: '📚',
    tone: '정보갈증',
    persona: '월부·라이프체인징 돈공부 커뮤니티 입문자',
    hookLabel: 'Learn-hook',
    hookCopy: '5일 완성 강의가 가르친 것',
    narrative:
      '연 60만. 학습 커뮤니티 생태계 형성. 단기 강의 후기가 트리거. today-kok 입문 + prime-club 심화 2단 구성.',
    contentType: '입문',
    consumerQuote: '🤔 돈 공부 어디서부터 시작해야 해...'
  },
  'O-C10': {
    emoji: '🎓',
    tone: '정보갈증',
    persona: '토스 쓰다가 졸업 준비하는 주린이 1년차',
    hookLabel: 'Upgrade-hook',
    hookCopy: '다음 단계 증권사의 진짜 차이',
    narrative:
      '연 13.7만 / +49%. 토스증권 졸업 내러티브 형성. 기능·비용·도구 차이 해설. today-kok 가이드 + mybrief 데모.',
    contentType: '입문',
    consumerQuote: '🤔 토스 쓰다가 다음엔 어디로 가야...'
  },
  'O-C11': {
    emoji: '🧭',
    tone: '정보갈증',
    persona: '계좌별 맞춤 종목 추천 갈망하는 투자자',
    hookLabel: 'Recco-hook',
    hookCopy: 'ISA · 연금저축 · IRP 맞춤 3종',
    narrative:
      '연 48만. 계좌별 특성 고려한 종목 추천 수요. 세액공제·비과세 효율 기반 큐레이션. prime-club + ai-briefing 핵심.',
    contentType: '전문가',
    consumerQuote: '🤔 ISA에 뭐 넣어야 가장 유리한거야...'
  },
  // ───────────── 🅓 계좌 개설 ─────────────
  'O-ACC01': {
    emoji: '🗺️',
    tone: '정보갈증',
    persona: '5개 영문 계좌 이름 혼란스러운 투자자',
    hookLabel: 'Map-hook',
    hookCopy: '연봉·해외주식 유무로 딱 정해진다',
    narrative:
      '연 24만. ISA·연금저축·IRP·RIA·IRA 통합 가이드 수요. 선택 기준 명확화 = KB 공격 포인트. today-kok + ai-briefing 최적.',
    contentType: '가이드',
    consumerQuote: '🤷 5개 계좌 뭐가 뭔지 모르겠어...'
  },
  'O-ACC02': {
    emoji: '🔄',
    tone: '자산설계',
    persona: 'ISA 만기 다가온 10년 보유자',
    hookLabel: 'Maturity-hook',
    hookCopy: '다음 5년 세금 한 번 더 아끼는 법',
    narrative:
      '연 11.5만. 2016 출시 10년 만기 트리거. 재가입·갈아타기 전략 수요. today-kok 제도 + prime-club 설계 조합.',
    contentType: '가이드',
    consumerQuote: '🤔 ISA 만기됐는데 어떻게 굴려...'
  },
  'O-ACC03': {
    emoji: '📦',
    tone: '자산설계',
    persona: '연금저축 통장 비어있는 4050 직장인',
    hookLabel: 'Pick-hook',
    hookCopy: '직장인이 많이 고른 ETF 3개',
    narrative:
      '연 7.4만 / +24%. 연금저축 직접 운용 수요 상승. ETF 추천 영역이 KB 차별화 여지. ai-briefing + mybrief 조합.',
    contentType: '가이드',
    consumerQuote: '🤔 연금저축에 뭘 넣어야 가장 좋아...'
  },
  'O-ACC04': {
    emoji: '💳',
    tone: '자산설계',
    persona: 'IRP 증권사 수수료 0.1% 따지는 직장인',
    hookLabel: 'Fee-hook',
    hookCopy: '30년 뒤 실제 금액 차이 계산',
    narrative:
      '연 4만. IRP 증권사 비교 수요. KB증권 IRP 이미 노출 중 → 방어 전략. 수수료·전환율 차별화. prime-club 전문 해설.',
    contentType: '해설',
    consumerQuote: '🤔 IRP 증권사 바꾸면 얼마나 차이나...'
  },
  'O-ACC05': {
    emoji: '🧮',
    tone: '자산설계',
    persona: '세액공제 최적 배분 찾는 연봉 상위 직장인',
    hookLabel: 'Tax-hook',
    hookCopy: '연봉 8천만원 최적 배분',
    narrative:
      '연 46만. 연말정산 최적화 피크. 연금저축+IRP 합산 한도 활용법 + 연봉 구간별 배분 수요. today-kok + prime-club.',
    contentType: '가이드',
    consumerQuote: '🤔 연말정산 뭘 얼마 넣어야 최대 받아...'
  },
  'O-ACC06': {
    emoji: '📑',
    tone: '자산설계',
    persona: 'ISA에 뭘 담을지 모르는 비과세 수혜자',
    hookLabel: 'Fill-hook',
    hookCopy: '비과세 극대화 3종 조합',
    narrative:
      '연 1.2만 (작지만 display_mode=moment 경계 세그). ISA 비과세 효율 종목 큐레이션 니즈. prime-club + ai-briefing.',
    contentType: '가이드',
    consumerQuote: '🤔 ISA 만든지 오래됐는데 뭘 넣지...'
  },
  'O-ACC07': {
    emoji: '🆕',
    tone: '시의성폭발',
    persona: '2026 ISA 제도 바뀌는 거 궁금한 직장인',
    hookLabel: 'Season-hook',
    hookCopy: '한도 늘어나면 당신은 얼마까지',
    narrative:
      '초기 검색 미미하지만 2026.1 제도 변경 트리거 직전. 한도·상품·혜택 변경 선점 콘텐츠 핵심. ai-briefing + today-kok.',
    contentType: '가이드',
    consumerQuote: '🤔 ISA 한도 오른다던데 얼마까지...'
  },
  'O-ACC08': {
    emoji: '🏦',
    tone: '자산설계',
    persona: '퇴직금 1억 받자마자 IRP 선택 고민',
    hookLabel: 'Rollover-hook',
    hookCopy: 'IRP 이체 vs 일시수령 세금',
    narrative:
      '퇴직금 트리거 실행 단계 수요. 이체/일시 선택에 따른 세금·복리 차이 계산 콘텐츠. prime-club + today-kok 조합.',
    contentType: '전문가',
    consumerQuote: '😰 퇴직금 IRP에 넣는 게 진짜 유리해...'
  },
  'O-ACC09': {
    emoji: '🤷',
    tone: '시의성폭발',
    persona: 'IRA·IRP·ISA 이름도 헷갈리는 40대↑',
    hookLabel: 'Confusion-hook',
    hookCopy: '3분 만에 정리',
    narrative:
      '연 5.3만 / +123% 🔥. 2025.10부터 폭발. 이름 혼동 자체가 차별화 기회. today-kok 쉬운 설명 + ai-briefing 해설 조합.',
    contentType: '가이드',
    consumerQuote: '🤷 IRA 랑 IRP 랑 ISA 뭐가 다른거야...'
  },
  'O-ACC10': {
    emoji: '🌐',
    tone: '자산설계',
    persona: '미국 Roth IRA 궁금한 서학개미',
    hookLabel: 'Global-hook',
    hookCopy: '우리가 쓸 수 있나 체크',
    narrative:
      '연 19만. 미국 세제 혜택 + Roth IRA 적용 가능성 검색. 블루오션. prime-club 고급 설계 + ai-briefing 해외 해설.',
    contentType: '전문가',
    consumerQuote: '🤔 미국 IRA 한국인도 만들 수 있어...'
  },
  'O-ACC11': {
    emoji: '🚨',
    tone: '시의성폭발',
    persona: '서학개미 양도세가 두려운 투자자',
    hookLabel: 'Tax-hook',
    hookCopy: '양도세 면제 계좌가 있다',
    narrative:
      '연 25.5만 / +168% 🔥🔥🔥. 2025.12 신설 · 키움 선점 · KB 부재. 2026 게임체인저. 남 66% · 40-50대 60%. ai-briefing + today-kok.',
    contentType: '긴급',
    consumerQuote: '🤨 RIA 뭐야? 키움만 하는 것 같아...'
  },
  'O-ACC12': {
    emoji: '💱',
    tone: '시의성폭발',
    persona: '미국주식 1억 보유 서학개미 RIA 이전 고민',
    hookLabel: 'Action-hook',
    hookCopy: '이전하면 연간 세금 얼마 아끼나',
    narrative:
      '연 3만 (실행 단계 키워드). RIA 이전 구체 가이드 + 실제 절감액 계산 콘텐츠. prime-club + mybrief 조합 최적.',
    contentType: '전문가',
    consumerQuote: '🤔 내 미국주식 RIA로 옮기면 얼마나...'
  },
  'O-ACC13': {
    emoji: '🏁',
    tone: '시의성폭발',
    persona: 'RIA 증권사 비교하는 서학개미',
    hookLabel: 'Compare-hook',
    hookCopy: '수수료 말고 더 중요한 3가지',
    narrative:
      '연 6만 (키움 선점 추격전). 수수료·편의·UX·지원 종목 차이 해설 수요. prime-club + ai-briefing으로 KB 차별화 포인트 제시.',
    contentType: '해설',
    consumerQuote: '🤔 RIA 어디서 만드는 게 제일 좋아...'
  }
};

export function enrichmentFor(id: string): Enrichment {
  return (
    ENRICHMENT[id] ?? {
      emoji: '📊',
      tone: '정보갈증',
      persona: id,
      hookLabel: 'Hook',
      hookCopy: '—',
      narrative: '—',
      contentType: '해설',
      consumerQuote: '—'
    }
  );
}

export function monthlyAverage(volumes: number[] | undefined): number | null {
  if (!volumes || volumes.length === 0) return null;
  return Math.round(volumes.reduce((a, b) => a + b, 0) / volumes.length);
}
