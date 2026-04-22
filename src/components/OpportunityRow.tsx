import Link from 'next/link';
import type { Opportunity } from '@/types';
import {
  brand,
  displayModeBadge,
  formatNumber,
  formatTrend,
  pad2,
  radius,
  toSoft
} from '@/lib/brand';
import { enrichmentFor } from '@/lib/opportunityEnrichment';

interface Props {
  opportunity: Opportunity;
  index?: number;
  sectionColor: string;
  compact?: boolean;
}

export default function OpportunityRow({
  opportunity: o,
  index,
  sectionColor,
  compact = false
}: Props) {
  return compact ? (
    <CompactRow opportunity={o} index={index} sectionColor={sectionColor} />
  ) : (
    <FullRow opportunity={o} index={index} sectionColor={sectionColor} />
  );
}

// ───────────────────────────── Full (primary / NOW / moment) ─────────────────────────────

function FullRow({
  opportunity: o,
  index,
  sectionColor
}: {
  opportunity: Opportunity;
  index?: number;
  sectionColor: string;
}) {
  const e = enrichmentFor(o.id);
  const mode = displayModeBadge[o.display_mode];
  const trend = o.analysis.metrics.trend_percent;
  const annual = o.analysis.metrics.annual_volume;
  const trendLabel =
    trend !== null && trend !== undefined ? formatTrend(trend) : o.analysis.metrics.trend_label;
  const showTrendRed = trend !== null && trend !== undefined;

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
        borderLeft: `3px solid ${sectionColor}`,
        borderRadius: radius.lg,
        padding: '16px 20px',
        textDecoration: 'none',
        color: brand.textTitle
      }}
    >
      {/* LEFT · emoji box + number */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 10,
            background: toSoft(sectionColor),
            color: sectionColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24
          }}
        >
          {e.emoji}
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
            {pad2(index)}
          </div>
        )}
      </div>

      {/* MIDDLE · persona title / hook / narrative / tag row */}
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
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
        <div
          style={{
            fontSize: 12,
            color: brand.textBody,
            lineHeight: 1.6
          }}
        >
          {e.narrative}
        </div>
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
              borderRadius: 4
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
              border: `0.5px solid ${brand.border}`
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

      {/* RIGHT · numeric column */}
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
            {trendLabel || o.analysis.metrics.trend_label}
          </div>
        )}
        <div
          style={{
            marginTop: 'auto',
            color: sectionColor,
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

// ───────────────────────────── Compact (secondary 2-col) ─────────────────────────────

function CompactRow({
  opportunity: o,
  sectionColor
}: {
  opportunity: Opportunity;
  index?: number;
  sectionColor: string;
}) {
  const e = enrichmentFor(o.id);
  const annual = o.analysis.metrics.annual_volume;

  return (
    <Link
      href={`/opportunity/${o.id}`}
      className="mde-opp-card"
      style={{
        display: 'grid',
        gridTemplateColumns: '52px 1fr auto',
        gap: 12,
        alignItems: 'center',
        background: brand.surface,
        border: `0.5px solid ${brand.border}`,
        borderLeft: `3px solid ${sectionColor}`,
        borderRadius: radius.lg,
        padding: '12px 16px',
        textDecoration: 'none',
        color: brand.textTitle,
        minHeight: 64
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: toSoft(sectionColor),
          color: sectionColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20
        }}
      >
        {e.emoji}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: brand.textTitle,
            lineHeight: 1.35,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {o.title}
        </div>
        <div
          style={{
            fontSize: 11,
            color: brand.textBody,
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginTop: 2
          }}
        >
          {o.subtitle}
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: sectionColor,
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap'
        }}
      >
        연 {formatNumber(annual)}
      </div>
    </Link>
  );
}
