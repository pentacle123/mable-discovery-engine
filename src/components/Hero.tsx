import { brand, container, formatNumber, radius } from '@/lib/brand';
import { metadata } from '@/lib/data';

export default function Hero() {
  const stats = metadata.stats;
  return (
    <section style={{ ...container, paddingTop: 20, paddingBottom: 4 }}>
      <div
        style={{
          background: brand.heroBg,
          borderRadius: radius.lg,
          padding: 22,
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: 0.4,
            color: brand.primary,
            fontWeight: 700,
            textTransform: 'uppercase'
          }}
        >
          M-able Discovery Engine
        </div>
        <p
          style={{
            fontSize: 19,
            fontWeight: 500,
            color: brand.primaryDeep,
            lineHeight: 1.4,
            letterSpacing: -0.2,
            maxWidth: 820
          }}
        >
          {metadata.platform.tagline}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <StatBadge label={`${stats.total_opportunities}개 기회`} />
          <StatBadge label={`${stats.total_services}개 서비스`} />
          <StatBadge label={`연 ${formatNumber(stats.annual_search_volume)}+ 검색`} />
        </div>
      </div>
    </section>
  );
}

function StatBadge({ label }: { label: string }) {
  return (
    <div
      style={{
        padding: '5px 10px',
        background: brand.surface,
        color: brand.primary,
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        border: `0.5px solid rgba(12, 68, 124, 0.12)`
      }}
    >
      {label}
    </div>
  );
}
