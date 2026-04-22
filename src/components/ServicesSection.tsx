'use client';

import { useState } from 'react';
import type { Opportunity, Service } from '@/types';
import { brand, container, radius } from '@/lib/brand';
import { opportunities, services } from '@/lib/data';
import OpportunityRow from './OpportunityRow';
import SectionTitle from './SectionTitle';

export default function ServicesSection() {
  const pool = opportunities.filter((o) => o.display_mode === 'service');
  const [activeId, setActiveId] = useState<string>(services[0].id);
  const active = services.find((s) => s.id === activeId) as Service;

  const connected = (sid: string) => pool.filter((o) => o.services.some((s) => s.id === sid));
  const filtered = connected(activeId);

  return (
    <section style={{ ...container, paddingTop: 28 }}>
      <SectionTitle
        icon="🔵"
        title="Services — 마블 5대 자산의 기회"
        meta={`${pool.length}개 · display_mode=service`}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 8,
          marginBottom: 14
        }}
      >
        {services.map((s) => {
          const count = connected(s.id).length;
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: radius.md,
                background: isActive ? '#EEF4FB' : brand.surface,
                border: `0.5px solid ${isActive ? 'rgba(12, 68, 124, 0.35)' : brand.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? brand.primary : brand.textTitle
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: isActive ? brand.primary : brand.textMeta,
                    fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  {count}
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: brand.textMeta,
                  lineHeight: 1.4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {s.usp}
              </div>
            </button>
          );
        })}
      </div>

      <ActiveServicePanel service={active} opportunities={filtered} />
    </section>
  );
}

function ActiveServicePanel({
  service,
  opportunities
}: {
  service: Service;
  opportunities: Opportunity[];
}) {
  const primary = opportunities.filter(
    (o) => o.services.find((s) => s.id === service.id)?.role === 'primary'
  );
  const secondary = opportunities.filter(
    (o) => o.services.find((s) => s.id === service.id)?.role === 'secondary'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {primary.length > 0 && (
        <Group label={`Primary · ${primary.length}`} opportunities={primary} />
      )}
      {secondary.length > 0 && (
        <Group label={`Secondary · ${secondary.length}`} opportunities={secondary} muted />
      )}
    </div>
  );
}

function Group({
  label,
  opportunities,
  muted
}: {
  label: string;
  opportunities: Opportunity[];
  muted?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: muted ? brand.textMeta : brand.primary,
          letterSpacing: 0.3,
          textTransform: 'uppercase',
          marginBottom: 6
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {opportunities.map((o, i) => (
          <OpportunityRow key={o.id} opportunity={o} index={i + 1} />
        ))}
      </div>
    </div>
  );
}
