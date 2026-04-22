import Link from 'next/link';
import type { Opportunity } from '@/types';
import { brand, displayModeBadge, formatNumber, formatTrend, radius } from '@/lib/brand';
import { enrichmentFor, monthlyAverage, TONE_META } from '@/lib/opportunityEnrichment';

interface Props {
  opportunity: Opportunity;
  index?: number;
  toneOverride?: keyof typeof TONE_META;
}

export default function OpportunityRow({ opportunity: o, index, toneOverride }: Props) {
  const e = enrichmentFor(o.id);
  const tone = TONE_META[toneOverride ?? e.tone];
  const mode = displayModeBadge[o.display_mode];
  const avg = monthlyAverage(o.analysis.monthly_volume);
  const trend = o.analysis.metrics.trend_percent;
  const annual = o.analysis.metrics.annual_volume;

  return (
    <Link
      href={`/opportunity/${o.id}`}
      className="mde-opp-card"
      style={{
        display: 'grid',
        gridTemplateColumns: '84px 1fr 140px',
        gap: 16,
        alignItems: 'flex-start',
        background: brand.surface,
        border: `0.5px solid ${brand.border}`,
        borderRadius: radius.lg,
        padding: 16,
        textDecoration: 'none',
        color: brand.textTitle
      }}
    >
      {/* LEFT · 52×52 emoji + tone chip */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: radius.md,
            background: tone.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26
          }}
        >
          {e.emoji}
        </div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: tone.fg,
            background: tone.chipBg,
            padding: '2px 7px',
            borderRadius: 999,
            letterSpacing: 0.2,
            whiteSpace: 'nowrap'
          }}
        >
          {tone.label}
        </div>
        {index !== undefined && (
          <div
            style={{
              fontSize: 10,
              color: brand.textMeta,
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 500
            }}
          >
            {index.toString().padStart(2, '0')}
          </div>
        )}
      </div>

      {/* MIDDLE · persona title / hook / narrative / tag row */}
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Persona title */}
        <div
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: brand.textTitle,
            lineHeight: 1.35,
            letterSpacing: -0.15,
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {e.persona}
        </div>
        {/* Hook label + copy (orange) */}
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: '#BA7517',
            lineHeight: 1.4,
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap'
          }}
        >
          <span style={{ fontWeight: 700 }}>{e.hookLabel}</span>
          <span style={{ color: '#9A5E12' }}>{e.hookCopy}</span>
        </div>
        {/* Narrative with inline data */}
        <div
          style={{
            fontSize: 12,
            color: brand.textBody,
            lineHeight: 1.6
          }}
        >
          {e.narrative}
        </div>
        {/* Tag row */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            alignItems: 'center',
            marginTop: 2
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '2px 7px',
              background: mode.bg,
              color: mode.fg,
              borderRadius: 4,
              letterSpacing: 0.2
            }}
          >
            {mode.label}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '2px 7px',
              background: brand.bg,
              color: brand.textBody,
              borderRadius: 4,
              border: `0.5px solid ${brand.border}`,
              letterSpacing: 0.2
            }}
          >
            {e.contentType}
          </span>
          <span
            style={{
              fontSize: 11,
              color: brand.textMeta,
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              minWidth: 0
            }}
            title={e.consumerQuote}
          >
            {e.consumerQuote}
          </span>
        </div>
      </div>

      {/* RIGHT · 3-line numeric column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 4,
          minWidth: 130,
          paddingTop: 2
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: brand.trendRed,
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          연 {formatNumber(annual)}회
        </div>
        {avg !== null && (
          <div style={{ fontSize: 10, color: brand.textMeta, fontVariantNumeric: 'tabular-nums' }}>
            월 평균 {avg.toLocaleString('ko-KR')}회
          </div>
        )}
        {trend !== null && trend !== undefined ? (
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: '#BA7517',
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {formatTrend(trend)} 🔥
          </div>
        ) : (
          <div style={{ fontSize: 10, color: brand.textMeta, lineHeight: 1.4, textAlign: 'right' }}>
            {o.analysis.metrics.trend_label}
          </div>
        )}
        <div
          style={{
            marginTop: 'auto',
            color: brand.primary,
            fontSize: 14,
            fontWeight: 500
          }}
        >
          →
        </div>
      </div>
    </Link>
  );
}
