'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { brand, container } from '@/lib/brand';
import { loadIdeas } from '@/lib/ideasStore';

export type ProgressStep = 'discovery' | 'analysis' | 'ideas' | 'storyboard';

interface Props {
  active: ProgressStep;
  opportunityId?: string;
  ideaIndex?: number;
}

const STEPS: Array<{ id: ProgressStep; label: string }> = [
  { id: 'discovery', label: '기회 발견' },
  { id: 'analysis', label: '기회 분석' },
  { id: 'ideas', label: 'AI 아이디어' },
  { id: 'storyboard', label: '스토리보드' }
];

const DONE_GREEN = '#10B981';
const CURRENT_YELLOW = '#FFD700';
const UPCOMING_GRAY = '#CBD5E1';

export default function ProgressBar({ active, opportunityId, ideaIndex }: Props) {
  const activeIndex = STEPS.findIndex((s) => s.id === active);

  const [cachedIdeaIdx, setCachedIdeaIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!opportunityId) {
      setCachedIdeaIdx(null);
      return;
    }
    const ideas = loadIdeas(opportunityId);
    setCachedIdeaIdx(ideas && ideas.length > 0 ? 0 : null);
  }, [opportunityId]);

  const hrefFor = (step: ProgressStep): string | null => {
    switch (step) {
      case 'discovery':
        return '/';
      case 'analysis':
        return opportunityId ? `/opportunity/${opportunityId}` : null;
      case 'ideas':
        return opportunityId ? `/opportunity/${opportunityId}/ideas` : null;
      case 'storyboard':
        if (opportunityId && ideaIndex !== undefined) {
          return `/opportunity/${opportunityId}/ideas/${ideaIndex}/storyboard`;
        }
        if (opportunityId && cachedIdeaIdx !== null) {
          return `/opportunity/${opportunityId}/ideas/${cachedIdeaIdx}/storyboard`;
        }
        return null;
    }
  };

  return (
    <div
      style={{
        height: 44,
        background: brand.surface,
        borderBottom: `0.5px solid ${brand.border}`,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          ...container,
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          width: '100%',
          overflowX: 'auto'
        }}
      >
        {STEPS.map((s, i) => {
          const isActive = i === activeIndex;
          const isDone = i < activeIndex;
          const href = hrefFor(s.id);
          const enabled = !!href && !isActive;

          // Step circle styling
          const circleBg = isActive
            ? brand.kbNavy
            : isDone
              ? DONE_GREEN
              : brand.surface;
          const circleFg = isActive
            ? brand.kbYellow
            : isDone
              ? '#fff'
              : brand.textMeta;
          const circleBorder = isActive || isDone ? 'none' : `0.5px solid ${brand.border}`;

          const circleStyle: React.CSSProperties = {
            width: 18,
            height: 18,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 700,
            background: circleBg,
            color: circleFg,
            border: circleBorder,
            flexShrink: 0
          };

          const labelColor = isActive
            ? brand.kbNavy
            : isDone
              ? DONE_GREEN
              : brand.textMeta;

          const stepContent = (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0 4px',
                cursor: enabled ? 'pointer' : isActive ? 'default' : 'not-allowed',
                opacity: enabled || isActive || isDone ? 1 : 0.7
              }}
            >
              <div style={circleStyle}>{i + 1}</div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 500,
                  color: labelColor,
                  whiteSpace: 'nowrap'
                }}
              >
                {s.label}
              </div>
            </div>
          );

          // Connector color between step i and i+1
          let connectorColor = UPCOMING_GRAY;
          if (i < activeIndex) connectorColor = DONE_GREEN;
          else if (i === activeIndex) connectorColor = CURRENT_YELLOW;

          return (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              {enabled ? (
                <Link href={href!} style={{ textDecoration: 'none' }} prefetch={false}>
                  {stepContent}
                </Link>
              ) : (
                stepContent
              )}
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    width: 24,
                    height: 0,
                    borderTop: `1.5px solid ${connectorColor}`,
                    margin: '0 8px'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
