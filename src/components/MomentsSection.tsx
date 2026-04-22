import type { MomentAxis, Opportunity } from '@/types';
import { brand, container } from '@/lib/brand';
import { momentAxis, opportunities } from '@/lib/data';
import OpportunityRow from './OpportunityRow';
import SectionTitle from './SectionTitle';

const AXIS_ORDER: MomentAxis[] = ['위기·심리', '라이프진입', '경계'];

export default function MomentsSection() {
  const moments = opportunities.filter((o) => o.display_mode === 'moment');
  const grouped: Record<MomentAxis, Opportunity[]> = {
    '위기·심리': [],
    '라이프진입': [],
    '경계': []
  };
  moments.forEach((o) => grouped[momentAxis(o.id)].push(o));

  return (
    <section style={{ ...container, paddingTop: 28, paddingBottom: 60 }}>
      <SectionTitle
        icon="🟢"
        title="Moments — 소비자 상황의 기회"
        meta={`${moments.length}개 · display_mode=moment`}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {AXIS_ORDER.map((axis) => {
          const list = grouped[axis];
          if (list.length === 0) return null;
          return (
            <div key={axis}>
              <AxisHeader axis={axis} count={list.length} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {list.map((o, i) => (
                  <OpportunityRow key={o.id} opportunity={o} index={i + 1} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function AxisHeader({ axis, count }: { axis: MomentAxis; count: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 6,
        marginBottom: 8
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 500, color: brand.textTitle }}>{axis}</div>
      <div style={{ fontSize: 11, color: brand.textMeta, fontVariantNumeric: 'tabular-nums' }}>
        {count}
      </div>
      <div
        style={{
          flex: 1,
          height: 0,
          borderTop: `0.5px dashed ${brand.border}`
        }}
      />
    </div>
  );
}
