import { container } from '@/lib/brand';
import { getOpportunity, nowTop5 } from '@/lib/data';
import OpportunityRow from './OpportunityRow';
import SectionTitle from './SectionTitle';

export default function NowTop5Section() {
  return (
    <section style={{ ...container, paddingTop: 28 }}>
      <SectionTitle
        icon="🔥"
        title={`2026 NOW — ${nowTop5.subtitle}`}
        meta={nowTop5.updated_at}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {nowTop5.entries.map((e, i) => {
          const opp = getOpportunity(e.opportunity_id);
          if (!opp) return null;
          return (
            <OpportunityRow
              key={e.opportunity_id}
              opportunity={opp}
              index={i + 1}
              toneOverride="시의성폭발"
            />
          );
        })}
      </div>
    </section>
  );
}
