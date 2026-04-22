import { toBorder, toSoft } from '@/lib/brand';

interface Props {
  label: string;
  color: string;
  icon?: string;
}

/**
 * Horizontal rule — pill — horizontal rule.
 * Used as both top-level section divider (NOW / Services / Moments)
 * and sub-axis divider (service tabs, moment axes).
 */
export default function SectionTitle({ label, color, icon }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginTop: 32,
        marginBottom: 16
      }}
    >
      <div
        style={{
          flex: 1,
          height: 0,
          borderTop: `0.5px solid ${toBorder(color)}`
        }}
      />
      <div
        style={{
          background: toSoft(color),
          color,
          padding: '6px 16px',
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6
        }}
      >
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </div>
      <div
        style={{
          flex: 1,
          height: 0,
          borderTop: `0.5px solid ${toBorder(color)}`
        }}
      />
    </div>
  );
}
