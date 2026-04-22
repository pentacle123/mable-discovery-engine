# M-able Discovery Engine

KB증권 마블 × Pentacle **AI 브랜드포먼스 엔진** — 소비자의 49가지 투자 순간에서
마블 서비스로 도착하는 숏폼 전략 플랫폼 (Next.js 14 App Router).

## 뷰 구조

| # | 뷰 | 내용 |
|---|---|---|
| 1 | **기회 발견** (메인) | 🚨 2026 NOW Top 5 + Services ↔ Moments 토글 + 4대 카테고리 |
| 2 | **USP × 기회 맵** | 5 × 4 히트맵 + 계좌 KPI 카드 |
| 3 | **콘텐츠 전략** | 49개 Canvas 브라우저 (필터·검색) |

각 Opportunity 클릭 시 3단 드릴다운 모달 오픈:
**📊 기회 분석 → 🤖 AI 아이디어 (Claude API) → 🎬 스토리보드 (Claude API)**

## 실행

```bash
cp .env.example .env.local
# .env.local 에 ANTHROPIC_API_KEY 입력

npm install
npm run dev
# → http://localhost:3000
```

빌드·배포:

```bash
npm run build
npm run start
# Vercel 배포 시 환경변수 ANTHROPIC_API_KEY 필수
```

## 환경 변수

| 변수 | 용도 | 기본값 |
|---|---|---|
| `ANTHROPIC_API_KEY` | Claude API 호출 | — (필수) |
| `ANTHROPIC_MODEL` | 사용 모델 | `claude-sonnet-4-6` (속도/비용 균형 · Opus 4.7로 전환 가능) |

## 디렉토리

```
/data                    원본 JSON (참조용 — 수정 시 src/data 동기화 필요)
/src
  /app
    layout.tsx           Pretendard CDN
    page.tsx             Entry
    /api
      /generate-ideas    POST → Claude로 숏폼 아이디어 3개 생성
      /storyboard        POST → Claude로 세로 숏폼 스토리보드 생성
  /components            클라이언트 컴포넌트 (inline styles)
  /data                  런타임 import 용 JSON 복사본
  /lib/brand.ts          디자인 토큰
  /types/index.ts        TypeScript 타입
```

## 디자인 시스템

- 베이스 `#F5F7FA` · 네이비 `#1D1D1B` · KB 옐로우 `#FFD700`
- 4대 축: 🅐 `#1E40AF` · 🅑 `#F59E0B` · 🅒 `#10B981` · 🅓 `#DC2626`
- 폰트: Pretendard CDN · 컨테이너 max-width 1200 / padding 24
- Tailwind 미사용 — 전부 inline styles + CSS-in-JS

## 데이터 구조

`data/README.md` 참조. 주요 파일:

- `metadata.json` · `services.json` (5) · `categories.json` (4) · `accounts.json` (5)
- `now-top5.json` · `opportunities.json` (49)

## 참조 UI

Trip.com AI Brandformance Engine —
https://tripcom-brandformance-engine.vercel.app/
