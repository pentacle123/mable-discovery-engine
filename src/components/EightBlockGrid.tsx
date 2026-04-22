import type { OpportunityAnalysis } from '@/types';
import { brand, radius } from '@/lib/brand';

interface Props {
  analysis: OpportunityAnalysis;
  accentColor: string;
}

const BLOCKS: Array<{
  key: keyof Pick<
    OpportunityAnalysis,
    | 'who_tags'
    | 'when_tags'
    | 'journey_tags'
    | 'pain_tags'
    | 'usp_fit_tags'
    | 'hook_tags'
  >;
  evidenceKey: keyof Pick<
    OpportunityAnalysis,
    | 'who_evidence'
    | 'when_evidence'
    | 'journey_evidence'
    | 'pain_evidence'
    | 'usp_fit_evidence'
    | 'hook_evidence'
  >;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    key: 'who_tags',
    evidenceKey: 'who_evidence',
    label: 'WHO',
    icon: '👤',
    description: '누가 이 순간에 있는가'
  },
  {
    key: 'when_tags',
    evidenceKey: 'when_evidence',
    label: 'WHEN',
    icon: '⏰',
    description: '언제 이 관심사가 폭발하는가'
  },
  {
    key: 'journey_tags',
    evidenceKey: 'journey_evidence',
    label: 'JOURNEY',
    icon: '🧭',
    description: '어떤 경로로 들어오는가'
  },
  {
    key: 'pain_tags',
    evidenceKey: 'pain_evidence',
    label: 'PAIN',
    icon: '💥',
    description: '무엇이 해결되지 않는가'
  },
  {
    key: 'usp_fit_tags',
    evidenceKey: 'usp_fit_evidence',
    label: 'USP FIT',
    icon: '🎯',
    description: '마블 USP와의 정합성'
  },
  {
    key: 'hook_tags',
    evidenceKey: 'hook_evidence',
    label: 'HOOK',
    icon: '🪝',
    description: '어떤 후킹 각도가 작동하는가'
  }
];

export default function EightBlockGrid({ analysis, accentColor }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 14
      }}
    >
      {BLOCKS.map((b) => {
        const tags = analysis[b.key] as string[];
        const evidence = analysis[b.evidenceKey] as string;
        return (
          <div
            key={b.label}
            style={{
              background: brand.surface,
              border: `1px solid ${brand.border}`,
              borderRadius: radius.lg,
              padding: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  fontSize: 22,
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${accentColor}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {b.icon}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: 1, color: brand.text }}>
                  {b.label}
                </div>
                <div style={{ fontSize: 11, color: brand.textMuted }}>{b.description}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 11,
                    padding: '4px 10px',
                    background: `${accentColor}15`,
                    color: accentColor,
                    borderRadius: 999,
                    fontWeight: 700
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>

            <div
              style={{
                fontSize: 12,
                color: brand.text,
                background: brand.bg,
                padding: 10,
                borderRadius: 8,
                borderLeft: `3px solid ${accentColor}`,
                lineHeight: 1.55
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: brand.textMuted,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  marginBottom: 4
                }}
              >
                📍 DATA EVIDENCE
              </div>
              {evidence}
            </div>
          </div>
        );
      })}
    </div>
  );
}
