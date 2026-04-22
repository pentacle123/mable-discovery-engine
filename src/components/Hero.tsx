import { brand, container, formatNumber } from '@/lib/brand';
import { metadata } from '@/lib/data';

export default function Hero() {
  const stats = metadata.stats;
  return (
    <section style={{ ...container, paddingTop: 20, paddingBottom: 4 }}>
      <div
        style={{
          background: `linear-gradient(135deg, ${brand.kbNavy} 0%, #2C2C2A 50%, ${brand.kbYellow} 200%)`,
          borderRadius: 20,
          padding: 36,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            right: -120,
            top: -120,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${brand.kbYellow}33 0%, transparent 70%)`,
            pointerEvents: 'none'
          }}
        />
        <div style={{ position: 'relative' }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 3,
              color: 'rgba(255, 215, 0, 0.9)',
              fontWeight: 600,
              textTransform: 'uppercase',
              marginBottom: 14
            }}
          >
            KB증권 × PENTACLE
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: -0.4,
              lineHeight: 1.25,
              marginBottom: 8
            }}
          >
            AI Brandformance Engine
          </h1>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.85)',
              maxWidth: 720,
              marginBottom: 20
            }}
          >
            {metadata.platform.tagline}
            <br />
            4개 카테고리에서 출발한 {stats.total_opportunities}개 기회를 분석하고, AI 숏폼 아이디어를 생성합니다.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <StatBadge label="전체 기회" value={`${stats.total_opportunities}개`} />
            <StatBadge label="연간 검색량" value={`${formatNumber(stats.annual_search_volume)}+회`} />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: 'rgba(255, 215, 0, 0.15)',
        border: '0.5px solid rgba(255, 215, 0, 0.25)',
        borderRadius: 10,
        padding: '10px 16px',
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 8
      }}
    >
      <span style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.7)' }}>{label}</span>
      <span
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: brand.kbYellow,
          fontVariantNumeric: 'tabular-nums'
        }}
      >
        {value}
      </span>
    </div>
  );
}
