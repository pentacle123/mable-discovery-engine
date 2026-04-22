# M-able Discovery Engine — Data Structure v2.0

KB증권 마블 × Pentacle AI 브랜드포먼스 엔진 플랫폼 데이터.
Claude Code에서 이 JSON들을 읽고 Next.js 14 플랫폼을 빌드할 때 사용.

**🆕 v2.0 업데이트**:
- 49개 기회에 `display_mode` 태그 추가 (service/moment 분리)
- 트립닷컴 스키마 호환 확장 필드 16개 추가 (모두 하드코딩 완료)
- 총 49개 × 16개 필드 = **784개 데이터 포인트 완비**

---

## 📂 파일 구조

```
/data/
  ├─ metadata.json         플랫폼 전역 메타데이터
  ├─ services.json         마블 5개 서비스
  ├─ categories.json       4대 카테고리 (🅐🅑🅒🅓)
  ├─ accounts.json         5개 계좌 KPI
  ├─ now-top5.json         2026 NOW 시의성 Top 5
  ├─ opportunities.json    49개 기회 전체 통합본 ⭐ (210KB)
  ├─ opportunities-A.json  (카테고리별 분리 파일)
  ├─ opportunities-B.json
  ├─ opportunities-C.json
  └─ opportunities-D.json
```

> **권장**: 앱에서는 `opportunities.json` 하나만 import.

---

## 🎯 플랫폼 설계 확정본

### 플랫폼 이름 / 카피
- **M-able Discovery Engine** — KB증권 × Pentacle
- Tagline: "소비자의 관심사에서 마블과 KB증권을 발견하게 하는 AI 브랜드포먼스 엔진"
- Subcopy: "투자가 궁금한 49가지 순간에서 출발해, 마블 서비스로 도착하는 숏폼 전략 플랫폼"

### 4단계 워크플로우 (트립닷컴 구조 이식)
```
Step 1. 기회 발견 (메인 리스트)
   ↓
Step 2. 기회 분석 (8블록 상세 페이지)
   ↓
Step 3. AI 아이디어 (카드 + 점수)
   ↓
Step 4. 스토리보드 (YouTube/Instagram 병렬 + 팩트시트 + 크리에이터)
```
→ 상단 고정 프로그레스 바로 진행 단계 시각화
→ **팝업 X, 페이지 이동 O** (Next.js 라우터)

### 메인 페이지 레이아웃
```
[HERO]
  ↓
[SECTION 1: 🚨 2026 NOW Top 5]
  - 가로 전폭 카드 5개 세로 나열
  ↓
[SECTION 2: 🔵 Services — 마블 5대 자산의 기회]
  - display_mode="service" 37개
  - 5개 서비스 카드 (마이브리프·AI투자·오늘콕·프라임클럽·공모주)
  ↓
[SECTION 3: 🟢 Moments — 소비자 상황의 기회]
  - display_mode="moment" 12개
  - 3축 분류 (위기·심리 5 / 라이프진입 6 / 경계 1)
```

### 카드 디자인
- **정사각형 그리드 X → 가로 전폭 카드 세로 나열 O**

### 디자인 시스템
- Base: `#F5F7FA`
- Brand: KB 옐로우 `#FFD700` + 네이비 `#1D1D1B`
- 4대 축: 🅐 `#1E40AF` · 🅑 `#F59E0B` · 🅒 `#10B981` · 🅓 `#DC2626`
- 폰트: Pretendard CDN
- 컨테이너: max-width 1200px

### 기술 스택
- Next.js 14 App Router + TypeScript
- inline styles (트립닷컴과 동일)
- Anthropic Claude API (AI 아이디어 생성)
- Recharts (월별 볼륨 차트)
- Vercel 배포
- GitHub: `pentacle123/mable-discovery-engine` (신규)

---

## 📋 JSON 스키마 — opportunities.json (v2.0)

```typescript
interface Opportunity {
  id: string;
  category_id: "A" | "B" | "C" | "D";
  subgroup: string;
  title: string;
  subtitle: string;
  status: "confirmed" | "tentative";
  priority: "critical" | "high" | "medium" | "low";
  now_rank: number | null;
  display_mode: "service" | "moment";  // 🆕 v2.0

  analysis: {
    // 기존 필드
    interests: string[];
    cluster_path: string[];
    metrics: { annual_volume, trend_percent, trend_label, competition };
    demography: { gender, age };
    why_now: string;
    review_level: "low" | "medium" | "high";
    review_notes: string;

    // 🆕 v2.0 트립닷컴 8블록 호환 확장 필드
    monthly_volume: number[];       // 14개월 검색량 (차트용)
    who_tags: string[];             // WHO 태그
    who_evidence: string;
    when_tags: string[];            // WHEN 태그
    when_evidence: string;
    journey_tags: string[];         // JOURNEY 태그
    journey_evidence: string;
    pain_tags: string[];            // PAIN 태그
    pain_evidence: string;
    usp_fit_tags: string[];         // USP FIT 태그
    usp_fit_evidence: string;
    hook_tags: string[];            // HOOK 태그
    hook_evidence: string;
    pathfinder_narrative: string;   // PathFinder 한 줄 해설
    cluster_insight: string;        // Cluster 한 줄 요약
    related_keywords: Array<{ keyword: string; volume: number }>;
  };

  services: Array<{ id, role, reason }>;
  account_kpi: { primary, secondary, note };
  hook_hypothesis: string;
  ai_ideas_seed: { target, tone, format_hint };
  storyboard: null;  // Claude API가 런타임 생성
}
```

---

## 📊 데이터 검증

```
✅ 전체 기회: 49개 (A:11 + B:14 + C:11 + D:13)
✅ display_mode 분포: service 37개 / moment 12개
✅ 확장 필드 16개 × 49개 = 784 데이터 포인트 완성
✅ ID 중복 없음
✅ NOW Top 5:
   #1 O-ACC11 RIA (+168%)
   #2 O-A04 반대매매 (+2,951%)
   #3 O-B01 퇴직금 (+120%)
   #4 O-ACC09 IRA 혼동 (+123%)
   #5 O-B12 국장 활황
```

---

## 🚀 Claude Code 빌드 프롬프트

```
이 /data 폴더 JSON 기반으로 M-able Discovery Engine 빌드해줘.

레퍼런스: Trip.com AI Brandformance Engine
(https://tripcom-brandformance-engine.vercel.app/)

[핵심 UI]
1. 카드: 가로 전폭 세로 나열 (정사각형 X)
2. 팝업 X, 페이지 이동 O
3. 4단계 프로그레스 바 상단 고정:
   [기회 발견]→[기회 분석]→[AI 아이디어]→[스토리보드]

[페이지 구조]

/ (메인)
├─ Hero (KB 네이비→골드 그라디언트)
├─ Section 1: 🚨 2026 NOW Top 5 (now-top5.json)
├─ Section 2: 🔵 Services (display_mode="service" 37개)
│   → 5개 서비스 카드
└─ Section 3: 🟢 Moments (display_mode="moment" 12개)
    → 3축 분류

/opportunity/[id] (기회 분석)
├─ Header (제목 + 배지 + "AI 숏폼 아이디어 생성" 버튼)
├─ 월별 검색 트렌드 (monthly_volume → Recharts)
├─ 8블록 그리드 2열:
│   WHO / WHEN / JOURNEY / PAIN / USP_FIT / HOOK
│   각 블록: tags + DATA EVIDENCE 박스
├─ PathFinder (pathfinder_narrative)
├─ Cluster (cluster_insight)
├─ 관련 검색어 TOP (related_keywords 버블)
└─ 하단 CTA → /opportunity/[id]/ideas

/opportunity/[id]/ideas (AI 아이디어)
├─ 4개 탭 (AI 자동추천 / A.시의성 / B.정보제공 / C.크로스)
├─ 아이디어 카드 5개 세로 나열:
│   번호 + 태그 + 제목 + 타겟 + HOOK(주황) + 씬1~4 + USP + 크리에이터 + 점수
├─ Claude API 실시간 생성 (ai_ideas_seed 참조)
└─ 각 카드 → /opportunity/[id]/ideas/[idx]/storyboard

/opportunity/[id]/ideas/[idx]/storyboard (스토리보드)
├─ 3개 탭 (숏폼 / 6초 범퍼 / DA 배너)
├─ YouTube Shorts | Instagram Reels 병렬:
│   HOOK(0-3s) / SCENE FLOW / PROOF / CTA
├─ 썸네일 추천 4개
├─ 콘텐츠 팩트시트 (장소 + 비용 + 타이밍)
├─ 광고 노출 추천
└─ 크리에이터 매칭 리스트

[디자인]
- 베이스 #F5F7FA / 옐로우 #FFD700 / 네이비 #1D1D1B
- 4대 축 색: 🅐 #1E40AF / 🅑 #F59E0B / 🅒 #10B981 / 🅓 #DC2626
- Pretendard CDN, max-width 1200px

[기술]
- Next.js 14 App Router + TypeScript
- inline styles
- Recharts
- .env.local: ANTHROPIC_API_KEY
- /api/claude/route.ts: AI 아이디어 생성 프록시
```

---

## 🔗 ID 참조

- `opportunity.category_id` → `categories.json`
- `opportunity.services[].id` → `services.json`
- `opportunity.account_kpi.primary` → `accounts.json`
- `now-top5.json.entries[].opportunity_id` → `opportunities.json`
