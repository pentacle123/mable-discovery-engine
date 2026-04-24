'use client';

import { useState } from 'react';
import type { ContentType, CreatorCollab } from '@/types';
import { brand, radius } from '@/lib/brand';
import CreatorMatchPanel from './CreatorMatchPanel';

const PURPLE = '#8B5CF6';

interface Props {
  collab: CreatorCollab;
  contentType: ContentType;
  youtubeSearchQueries: string[];
}

export default function CreatorCollabColumn({
  collab,
  contentType,
  youtubeSearchQueries
}: Props) {
  const [rationaleOpen, setRationaleOpen] = useState(false);
  const profile = collab.creatorProfile;

  return (
    <div
      style={{
        background: brand.surface,
        border: `1px solid ${brand.border}`,
        borderTop: `3px solid ${PURPLE}`,
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 10,
          borderBottom: `0.5px solid ${brand.border}`,
          paddingBottom: 12
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🎤</span>
            <div style={{ fontSize: 16, fontWeight: 700, color: PURPLE }}>
              크리에이터 협업 숏폼
            </div>
          </div>
          <div style={{ fontSize: 11, color: brand.textMeta, marginTop: 2 }}>
            Micro Creator Collaboration
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <Pill>MAX 30s</Pill>
          <Pill>9:16</Pill>
        </div>
      </div>

      {/* Title from hookDirection */}
      {collab.brief?.hookDirection && (
        <div style={{ fontSize: 14, fontWeight: 600, color: brand.textTitle, lineHeight: 1.4 }}>
          {collab.brief.hookDirection}
        </div>
      )}

      {/* Brief box */}
      {collab.brief && (
        <div
          style={{
            background: '#F8FAFC',
            borderRadius: 10,
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}
        >
          {collab.brief.hookDirection && (
            <BriefRow icon="🎯" label="HOOK 방향" labelColor={PURPLE}>
              {collab.brief.hookDirection}
            </BriefRow>
          )}
          {collab.brief.brandMoment && (
            <BriefRow icon="✨" label="브랜드 노출 포인트" labelColor={PURPLE}>
              {collab.brief.brandMoment}
            </BriefRow>
          )}
          <BriefRow icon="⏱️" label="분량 · 톤" labelColor={PURPLE} muted>
            {(collab.brief.duration || '30초')}
            {collab.brief.tone ? ` · ${collab.brief.tone}` : ''}
          </BriefRow>
          {collab.brief.guidelines && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: PURPLE, marginBottom: 6 }}>
                📋 가이드라인
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {(collab.brief.guidelines.must || []).map((m, i) => (
                  <div
                    key={`m${i}`}
                    style={{ fontSize: 12, color: '#10B981', lineHeight: 1.5 }}
                  >
                    ✓ {m}
                  </div>
                ))}
                {(collab.brief.guidelines.avoid || []).map((a, i) => (
                  <div
                    key={`a${i}`}
                    style={{ fontSize: 12, color: '#DC2626', lineHeight: 1.5 }}
                  >
                    ✗ {a}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scene flow — creator voice */}
      {collab.scenes && collab.scenes.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: PURPLE,
              letterSpacing: 0.3,
              marginBottom: 8
            }}
          >
            ✦ SCENE FLOW (크리에이터 구어체)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {collab.scenes.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: i < collab.scenes.length - 1 ? '1px solid #F3F4F6' : 'none'
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    background: 'rgba(139, 92, 246, 0.1)',
                    color: PURPLE,
                    fontWeight: 700,
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: brand.textTitle,
                    fontStyle: 'italic',
                    lineHeight: 1.5
                  }}
                >
                  “{s}”
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hashtags */}
      {collab.hashtags && collab.hashtags.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {collab.hashtags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 10,
                padding: '3px 10px',
                background: 'rgba(139, 92, 246, 0.1)',
                color: PURPLE,
                borderRadius: 12,
                fontWeight: 500
              }}
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div style={{ borderTop: `1px dashed ${brand.border}`, margin: '4px 0' }} />

      {/* Recommended creator niche */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: brand.textTitle }}>
          🎬 이런 크리에이터와 협업 추천
        </div>
        {profile && (
          <div style={{ fontSize: 11, color: brand.textMeta, marginTop: 4, lineHeight: 1.55 }}>
            {profile.niche}
            {profile.subscribers && ` · ${profile.subscribers}`}
            {profile.style && ` · ${profile.style}`}
          </div>
        )}
      </div>

      {/* Matched creators (YouTube API) */}
      {youtubeSearchQueries.length > 0 && (
        <CreatorMatchPanel
          queries={youtubeSearchQueries}
          contentType={contentType}
          embedded
          microFirst
          collabTemplate={collab.brief?.brandMoment}
        />
      )}

      {/* Rationale — collapsible */}
      {collab.rationale && (
        <div
          style={{
            background: '#FAF5FF',
            borderRadius: 8,
            padding: '10px 12px'
          }}
        >
          <button
            onClick={() => setRationaleOpen((v) => !v)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
              fontWeight: 600,
              color: PURPLE,
              background: 'transparent'
            }}
          >
            <span>💡 왜 이런 크리에이터를 추천하나요?</span>
            <span style={{ fontSize: 14 }}>{rationaleOpen ? '▴' : '▾'}</span>
          </button>
          {rationaleOpen && (
            <div
              style={{
                fontSize: 12,
                color: brand.textBody,
                lineHeight: 1.65,
                marginTop: 10,
                paddingTop: 10,
                borderTop: `0.5px solid ${brand.border}`
              }}
            >
              {collab.rationale}
              <div style={{ marginTop: 8, fontSize: 11, lineHeight: 1.7 }}>
                <div style={{ fontWeight: 600, color: brand.textTitle, marginBottom: 4 }}>
                  마이크로 크리에이터 협업 이점:
                </div>
                <div>• 핸들링 용이 — 소통 단순, 수정 요청 수용도 높음</div>
                <div>• 진정성 ↑ — 개인 팬덤 기반 신뢰 자산</div>
                <div>• 니치 도달 — 타겟 세그먼트 정확히 매칭</div>
                <div>• 예산 효율 — MACRO 대비 1/10 비용</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: '3px 8px',
        background: 'rgba(139, 92, 246, 0.08)',
        color: PURPLE,
        borderRadius: 999,
        border: `0.5px solid rgba(139, 92, 246, 0.2)`,
        whiteSpace: 'nowrap'
      }}
    >
      {children}
    </span>
  );
}

function BriefRow({
  icon,
  label,
  labelColor,
  muted,
  children
}: {
  icon: string;
  label: string;
  labelColor: string;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: labelColor, marginBottom: 3 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 12, color: muted ? brand.textBody : brand.textTitle, lineHeight: 1.5 }}>
        {children}
      </div>
    </div>
  );
}
