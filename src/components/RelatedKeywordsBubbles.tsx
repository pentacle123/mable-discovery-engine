import type { RelatedKeyword } from '@/types';
import { brand, formatNumber, radius } from '@/lib/brand';

interface Props {
  keywords: RelatedKeyword[];
  color: string;
}

export default function RelatedKeywordsBubbles({ keywords, color }: Props) {
  if (!keywords || keywords.length === 0) return null;
  const max = Math.max(...keywords.map((k) => k.volume));

  return (
    <div
      style={{
        background: brand.surface,
        border: `1px solid ${brand.border}`,
        borderRadius: radius.lg,
        padding: 18
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12 }}>🔎 관련 검색어 TOP</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        {keywords.map((k) => {
          const scale = 0.55 + 0.45 * (k.volume / max);
          return (
            <div
              key={k.keyword}
              style={{
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: 6,
                padding: `${8 * scale}px ${14 * scale}px`,
                background: `${color}${alphaFor(scale)}`,
                color: scale > 0.8 ? '#fff' : color,
                borderRadius: 999,
                fontSize: 11 + 4 * scale,
                fontWeight: 700,
                transition: 'all 0.1s ease'
              }}
            >
              <span>{k.keyword}</span>
              <span style={{ fontSize: 10, opacity: 0.8, fontWeight: 600 }}>
                {formatNumber(k.volume)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function alphaFor(scale: number): string {
  const alpha = Math.round(scale * 240);
  return alpha.toString(16).padStart(2, '0');
}
