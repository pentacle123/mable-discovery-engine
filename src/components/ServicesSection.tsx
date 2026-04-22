'use client';

import { useState } from 'react';
import type { Opportunity, Service } from '@/types';
import { brand, container, SECTION_COLOR, SERVICE_COLOR, toBorder, toSoft } from '@/lib/brand';
import { opportunities, services } from '@/lib/data';
import OpportunityRow from './OpportunityRow';
import SectionTitle from './SectionTitle';

export default function ServicesSection() {
  const pool = opportunities.filter((o) => o.display_mode === 'service');
  const [activeId, setActiveId] = useState<string>(services[0].id);
  const active = services.find((s) => s.id === activeId) as Service;

  const connected = (sid: string) => pool.filter((o) => o.services.some((s) => s.id === sid));
  const filtered = connected(activeId);
  const activeColor = SERVICE_COLOR[activeId] ?? SECTION_COLOR.services;

  return (
    <section style={container}>
      <SectionTitle
        icon="🔵"
        label={`Services · 마블 5대 자산의 기회 — ${pool.length}개`}
        color={SECTION_COLOR.services}
      />

      {/* 5 service tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 8,
          marginBottom: 16
        }}
      >
        {services.map((s) => {
          const color = SERVICE_COLOR[s.id] ?? SECTION_COLOR.services;
          const count = connected(s.id).length;
          const isActive = s.id === activeId;
          return (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              style={{
                textAlign: 'left',
                padding: '14px 16px',
                borderRadius: 10,
                background: isActive ? toSoft(color) : brand.surface,
                border: isActive
                  ? `1px solid ${toBorder(color)}`
                  : `0.5px solid ${brand.border}`,
                borderTop: `3px solid ${color}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: isActive ? color : brand.textTitle,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: color,
                    opacity: 0.6,
                    fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  {count}
                </div>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: brand.textBody,
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

      <ActiveServicePanel service={active} opportunities={filtered} color={activeColor} />
    </section>
  );
}

function ActiveServicePanel({
  service,
  opportunities,
  color
}: {
  service: Service;
  opportunities: Opportunity[];
  color: string;
}) {
  const primary = opportunities.filter(
    (o) => o.services.find((s) => s.id === service.id)?.role === 'primary'
  );
  const secondary = opportunities.filter(
    (o) => o.services.find((s) => s.id === service.id)?.role === 'secondary'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {primary.length > 0 && (
        <div>
          <GroupLabel color={color}>Primary · {primary.length}</GroupLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {primary.map((o, i) => (
              <OpportunityRow key={o.id} opportunity={o} index={i + 1} sectionColor={color} />
            ))}
          </div>
        </div>
      )}
      {secondary.length > 0 && (
        <div>
          <GroupLabel color={color} muted>
            Secondary · {secondary.length}
          </GroupLabel>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: 12
            }}
          >
            {secondary.map((o) => (
              <OpportunityRow key={o.id} opportunity={o} sectionColor={color} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GroupLabel({
  children,
  color,
  muted
}: {
  children: React.ReactNode;
  color: string;
  muted?: boolean;
}) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: muted ? brand.textMeta : color,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
        marginBottom: 8
      }}
    >
      {children}
    </div>
  );
}
