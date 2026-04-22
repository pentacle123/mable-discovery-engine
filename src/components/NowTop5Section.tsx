import { container, SECTION_COLOR } from '@/lib/brand';
import { getOpportunity, nowTop5 } from '@/lib/data';
import OpportunityRow from './OpportunityRow';
import SectionTitle from './SectionTitle';

export default function NowTop5Section() {
  return (
    <section style={{ ...container }}>
      <SectionTitle icon="🚨" label={`2026 NOW · 지금 폭발하는 ${nowTop5.entries.length}개`} color={SECTION_COLOR.now} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {nowTop5.entries.map((e, i) => {
          const opp = getOpportunity(e.opportunity_id);
          if (!opp) return null;
          return (
            <OpportunityRow
              key={e.opportunity_id}
              opportunity={opp}
              index={i + 1}
              sectionColor={SECTION_COLOR.now}
            />
          );
        })}
      </div>
    </section>
  );
}
