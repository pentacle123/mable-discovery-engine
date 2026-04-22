import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import ProgressBar from '@/components/ProgressBar';
import MonthlyVolumeChart from '@/components/MonthlyVolumeChart';
import EightBlockGrid from '@/components/EightBlockGrid';
import RelatedKeywordsBubbles from '@/components/RelatedKeywordsBubbles';
import {
  brand,
  card,
  categoryColors,
  container,
  displayModeBadge,
  formatNumber,
  formatTrend,
  priorityColors,
  radius
} from '@/lib/brand';
import { getAccount, getCategory, getOpportunity, getService, OPPORTUNITY_IDS } from '@/lib/data';

export function generateStaticParams() {
  return OPPORTUNITY_IDS.map((id) => ({ id }));
}

export default function OpportunityAnalysisPage({ params }: { params: { id: string } }) {
  const o = getOpportunity(params.id);
  if (!o) notFound();

  const cat = categoryColors[o.category_id];
  const category = getCategory(o.category_id);
  const primaryAccount = getAccount(o.account_kpi.primary);
  const mode = displayModeBadge[o.display_mode];

  return (
    <>
      <AppHeader />
      <ProgressBar active="analysis" opportunityId={o.id} />

      {/* Hero-style header */}
      <section style={{ ...container, paddingTop: 20 }}>
        <div
          style={{
            background: brand.heroBg,
            borderRadius: radius.lg,
            padding: 22,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}
        >
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <MetaTag>{o.id}</MetaTag>
            <MetaTag>
              {category?.name} · {o.subgroup}
            </MetaTag>
            <ModeBadge bg={mode.bg} fg={mode.fg}>
              {mode.label}
            </ModeBadge>
            {o.now_rank && <ModeBadge bg="#FCEBEB" fg="#791F1F">NOW #{o.now_rank}</ModeBadge>}
            <ModeBadge bg="#F1F5F9" fg={priorityColors[o.priority]}>
              {o.priority.toUpperCase()}
            </ModeBadge>
          </div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: brand.primaryDeep,
              letterSpacing: -0.3,
              lineHeight: 1.35
            }}
          >
            {o.title}
          </h1>
          <p style={{ fontSize: 13, color: brand.textBody, lineHeight: 1.5, maxWidth: 820 }}>
            {o.subtitle}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            <Link
              href={`/opportunity/${o.id}/ideas`}
              style={{
                padding: '9px 16px',
                background: brand.primary,
                color: '#fff',
                fontWeight: 600,
                fontSize: 12,
                borderRadius: radius.md,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              🤖 AI 아이디어 생성 →
            </Link>
            <Link
              href="/"
              style={{
                padding: '9px 14px',
                background: brand.surface,
                color: brand.textBody,
                fontWeight: 500,
                fontSize: 12,
                borderRadius: radius.md,
                border: `0.5px solid ${brand.border}`,
                textDecoration: 'none'
              }}
            >
              ← 기회 발견
            </Link>
          </div>
        </div>
      </section>

      <main style={{ ...container, paddingTop: 24, paddingBottom: 60 }}>
        {/* Why Now */}
        <div
          style={{
            ...card,
            padding: 16,
            marginBottom: 16
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: 0.4,
              color: brand.textMeta,
              fontWeight: 600,
              marginBottom: 4,
              textTransform: 'uppercase'
            }}
          >
            Why Now
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: brand.textTitle }}>{o.analysis.why_now}</p>
        </div>

        {/* Metrics row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 8,
            marginBottom: 20
          }}
        >
          <Metric label="연간 검색량" value={formatNumber(o.analysis.metrics.annual_volume)} />
          <Metric
            label="트렌드"
            value={
              o.analysis.metrics.trend_percent !== null
                ? formatTrend(o.analysis.metrics.trend_percent)
                : o.analysis.metrics.trend_label
            }
            hint={o.analysis.metrics.trend_percent !== null ? o.analysis.metrics.trend_label : undefined}
            tone="red"
          />
          <Metric label="경쟁 강도" value={o.analysis.metrics.competition} />
          <Metric label="심의 리스크" value={o.analysis.review_level.toUpperCase()} />
          <Metric label="성별 / 연령" value={o.analysis.demography.gender} hint={o.analysis.demography.age} />
        </div>

        {/* Chart */}
        <div style={{ marginBottom: 20 }}>
          <MonthlyVolumeChart volumes={o.analysis.monthly_volume} color={cat.base} />
        </div>

        {/* 6-block grid */}
        <SectionHeader>기회 분석 블록</SectionHeader>
        <div style={{ marginBottom: 24 }}>
          <EightBlockGrid analysis={o.analysis} accentColor={cat.base} />
        </div>

        {/* PathFinder + Cluster */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 8,
            marginBottom: 16
          }}
        >
          <div style={{ ...card, padding: 16 }}>
            <TinyLabel>Pathfinder</TinyLabel>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: brand.textTitle }}>
              {o.analysis.pathfinder_narrative}
            </p>
            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: `0.5px solid ${brand.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flexWrap: 'wrap'
              }}
            >
              {o.analysis.cluster_path.map((step, i) => (
                <span key={step + i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      fontSize: 11,
                      padding: '3px 9px',
                      background: brand.heroBg,
                      color: brand.primary,
                      borderRadius: 4,
                      fontWeight: 500
                    }}
                  >
                    {step}
                  </span>
                  {i < o.analysis.cluster_path.length - 1 && (
                    <span style={{ color: brand.textMeta, fontSize: 11 }}>→</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div style={{ ...card, padding: 16 }}>
            <TinyLabel>Cluster Insight</TinyLabel>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: brand.textTitle, fontWeight: 500 }}>
              {o.analysis.cluster_insight}
            </p>
            <div
              style={{
                marginTop: 10,
                fontSize: 11,
                color: brand.textMeta,
                lineHeight: 1.5
              }}
            >
              {o.analysis.demography.gender} · {o.analysis.demography.age}
            </div>
          </div>
        </div>

        {/* Related keywords */}
        <div style={{ marginBottom: 16 }}>
          <RelatedKeywordsBubbles keywords={o.analysis.related_keywords} color={cat.base} />
        </div>

        {/* Services + KPI */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 8,
            marginBottom: 16
          }}
        >
          <div style={{ ...card, padding: 16 }}>
            <TinyLabel>연결된 마블 서비스</TinyLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {o.services.map((ref) => {
                const sv = getService(ref.id);
                if (!sv) return null;
                return (
                  <div
                    key={ref.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      gap: 10,
                      padding: '10px 12px',
                      background: brand.bg,
                      borderRadius: radius.md,
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ fontSize: 14 }}>{sv.icon}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: brand.textTitle }}>
                        {sv.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: brand.textMeta,
                          lineHeight: 1.4,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {ref.reason}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        padding: '2px 7px',
                        background: ref.role === 'primary' ? brand.primary : brand.surface,
                        color: ref.role === 'primary' ? '#fff' : brand.textBody,
                        border: ref.role === 'primary' ? 'none' : `0.5px solid ${brand.border}`,
                        borderRadius: 4,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.3
                      }}
                    >
                      {ref.role}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ ...card, padding: 16 }}>
            <TinyLabel>계좌 KPI</TinyLabel>
            {primaryAccount ? (
              <div
                style={{
                  padding: 12,
                  background: brand.bg,
                  borderRadius: radius.md
                }}
              >
                <div style={{ fontSize: 10, color: brand.textMeta, fontWeight: 600, letterSpacing: 0.3 }}>
                  PRIMARY
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: brand.primary,
                    margin: '4px 0'
                  }}
                >
                  {primaryAccount.icon} {primaryAccount.name}
                </div>
                <div style={{ fontSize: 12, color: brand.textBody, lineHeight: 1.55 }}>
                  {o.account_kpi.note}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: brand.textMeta }}>{o.account_kpi.note}</div>
            )}
            {o.account_kpi.secondary.length > 0 && (
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 10 }}>
                <span style={{ fontSize: 11, color: brand.textMeta, alignSelf: 'center' }}>
                  Secondary:
                </span>
                {o.account_kpi.secondary.map((id) => (
                  <span
                    key={id}
                    style={{
                      fontSize: 11,
                      padding: '2px 8px',
                      background: brand.bg,
                      border: `0.5px solid ${brand.border}`,
                      borderRadius: 4,
                      color: brand.textBody
                    }}
                  >
                    {id}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Review notes */}
        {o.analysis.review_notes && (
          <div
            style={{
              padding: 12,
              borderRadius: radius.md,
              background: '#FFFBEB',
              border: '0.5px solid #FDE68A',
              fontSize: 12,
              lineHeight: 1.55,
              color: '#78350F',
              marginBottom: 16
            }}
          >
            ⚖️ <strong style={{ fontWeight: 600 }}>심의 가이드 —</strong> {o.analysis.review_notes}
          </div>
        )}

        {/* Hook hypothesis */}
        <div
          style={{
            background: brand.heroBg,
            borderRadius: radius.lg,
            padding: 20,
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}
        >
          <TinyLabel colorOverride={brand.primary}>후킹 카피 초안</TinyLabel>
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              lineHeight: 1.45,
              color: brand.primaryDeep,
              letterSpacing: -0.2
            }}
          >
            “{o.hook_hypothesis}”
          </div>
          <Link
            href={`/opportunity/${o.id}/ideas`}
            style={{
              alignSelf: 'flex-start',
              marginTop: 4,
              padding: '9px 16px',
              background: brand.primary,
              color: '#fff',
              fontWeight: 600,
              fontSize: 12,
              borderRadius: radius.md,
              textDecoration: 'none'
            }}
          >
            🤖 AI로 아이디어 3개 생성 →
          </Link>
        </div>
      </main>
    </>
  );
}

function MetaTag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 11,
        padding: '2px 7px',
        background: brand.surface,
        color: brand.textBody,
        borderRadius: 4,
        fontWeight: 500,
        border: `0.5px solid ${brand.border}`
      }}
    >
      {children}
    </span>
  );
}

function ModeBadge({
  children,
  bg,
  fg
}: {
  children: React.ReactNode;
  bg: string;
  fg: string;
}) {
  return (
    <span
      style={{
        fontSize: 10,
        padding: '2px 7px',
        background: bg,
        color: fg,
        borderRadius: 4,
        fontWeight: 600,
        letterSpacing: 0.2
      }}
    >
      {children}
    </span>
  );
}

function Metric({
  label,
  value,
  hint,
  tone
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: 'red';
}) {
  return (
    <div
      style={{
        padding: 12,
        background: brand.surface,
        border: `0.5px solid ${brand.border}`,
        borderRadius: radius.md
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: brand.textMeta,
          letterSpacing: 0.3,
          fontWeight: 500,
          textTransform: 'uppercase'
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 500,
          marginTop: 4,
          color: tone === 'red' ? brand.trendRed : brand.textTitle,
          fontVariantNumeric: 'tabular-nums'
        }}
      >
        {value}
      </div>
      {hint && (
        <div style={{ fontSize: 10, color: brand.textMeta, marginTop: 2 }}>{hint}</div>
      )}
    </div>
  );
}

function TinyLabel({
  children,
  colorOverride
}: {
  children: React.ReactNode;
  colorOverride?: string;
}) {
  return (
    <div
      style={{
        fontSize: 10,
        color: colorOverride || brand.textMeta,
        letterSpacing: 0.4,
        fontWeight: 600,
        textTransform: 'uppercase',
        marginBottom: 8
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 500, color: brand.textTitle }}>{children}</div>
      <div style={{ flex: 1, height: 0, borderTop: `0.5px solid ${brand.border}` }} />
    </div>
  );
}
