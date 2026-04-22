import { brand } from '@/lib/brand';

interface Props {
  icon?: string;
  title: string;
  meta?: string;
}

export default function SectionTitle({ icon, title, meta }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        paddingBottom: 10,
        marginBottom: 14
      }}
    >
      {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: brand.textTitle,
          whiteSpace: 'nowrap'
        }}
      >
        {title}
      </div>
      {meta && (
        <span style={{ fontSize: 11, color: brand.textMeta, whiteSpace: 'nowrap' }}>{meta}</span>
      )}
      <div
        style={{
          flex: 1,
          height: 0,
          borderTop: `0.5px solid ${brand.border}`
        }}
      />
    </div>
  );
}
