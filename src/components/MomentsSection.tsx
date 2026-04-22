import type { MomentAxis, Opportunity } from '@/types';
import {
  container,
  MOMENT_AXIS_COLOR,
  MOMENT_AXIS_ICON,
  MOMENT_AXIS_LABEL,
  SECTION_COLOR
} from '@/lib/brand';
import { momentAxis, opportunities } from '@/lib/data';
import OpportunityRow from './OpportunityRow';
import SectionTitle from './SectionTitle';

// 2 axes only (경계 removed, items merged into 라이프진입)
const AXIS_ORDER: MomentAxis[] = ['위기·심리', '라이프진입'];

export default function MomentsSection() {
  const moments = opportunities.filter((o) => o.display_mode === 'moment');
  const grouped: Record<MomentAxis, Opportunity[]> = {
    '위기·심리': [],
    '라이프진입': []
  };
  moments.forEach((o) => grouped[momentAxis(o.id)].push(o));

  return (
    <section style={{ ...container, paddingBottom: 60 }}>
      <SectionTitle
        icon="🟢"
        label={`Moments · 소비자 상황의 기회 — ${moments.length}개`}
        color={SECTION_COLOR.moments}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {AXIS_ORDER.map((axis) => {
          const list = grouped[axis];
          if (list.length === 0) return null;
          const color = MOMENT_AXIS_COLOR[axis];
          const icon = MOMENT_AXIS_ICON[axis];
          const label = MOMENT_AXIS_LABEL[axis];
          return (
            <div key={axis}>
              <SectionTitle
                icon={icon}
                label={`${label} — ${list.length}개`}
                color={color}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {list.map((o, i) => (
                  <OpportunityRow key={o.id} opportunity={o} index={i + 1} sectionColor={color} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
