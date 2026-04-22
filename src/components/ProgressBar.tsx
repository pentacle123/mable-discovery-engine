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

export default function ProgressBar({ active, opportunityId, ideaIndex }: Props) {
  const activeIndex = STEPS.findIndex((s) => s.id === active);

  // On client, check whether ideas are cached for this opportunity
  // so the storyboard step can be reached forward as well.
  const [cachedIdeaIdx, setCachedIdeaIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!opportunityId) {
      setCachedIdeaIdx(null);
      return;
    }
    const ideas = loadIdeas(opportunityId);
    if (ideas && ideas.length > 0) {
      setCachedIdeaIdx(0);
    } else {
      setCachedIdeaIdx(null);
    }
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
          // Enabled if there is a target URL for this step and it's not the step you're already on.
          const enabled = !!href && !isActive;
          const reachedColor = isActive || isDone ? brand.primary : brand.textMeta;

          const circleStyle: React.CSSProperties = {
            width: 18,
            height: 18,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 700,
            background: isActive ? brand.primary : brand.surface,
            color: isActive ? '#fff' : reachedColor,
            border: isActive ? 'none' : `0.5px solid ${brand.border}`,
            flexShrink: 0
          };

          const stepContent = (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0 4px',
                cursor: enabled ? 'pointer' : isActive ? 'default' : 'not-allowed',
                opacity: enabled || isActive || isDone ? 1 : 0.55
              }}
            >
              <div style={circleStyle}>{i + 1}</div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: isActive ? 700 : 500,
                  color: reachedColor,
                  whiteSpace: 'nowrap'
                }}
              >
                {s.label}
              </div>
            </div>
          );

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
                    borderTop: `0.5px solid ${i < activeIndex ? brand.primary : brand.border}`,
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
