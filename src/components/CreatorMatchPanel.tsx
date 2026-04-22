'use client';

import { useEffect, useState } from 'react';
import type { ContentType } from '@/types';
import { brand, radius } from '@/lib/brand';

type Tier = 'MACRO' | 'MICRO' | 'NANO';

interface CreatorMatch {
  channelId: string;
  channelTitle: string;
  channelThumbnail: string;
  subscriberCount: number;
  tier: Tier;
  videoCount: number;
  recentVideo: {
    videoId: string;
    title: string;
    publishedAt: string;
    thumbnail: string;
    url: string;
  };
  channelUrl: string;
  collabStrategy: string;
}

const TIER_COLOR: Record<Tier, string> = {
  MACRO: '#FF6B00',
  MICRO: '#0770E3',
  NANO: '#8B5CF6'
};

const COLLAB_TEMPLATES: Record<ContentType, string> = {
  A: '실제 경험담 브이로그로 진정성 확보, M-able 화면 자연스럽게 노출',
  B: '데이터 비교 콘텐츠로 신뢰도 확보, 브랜드가 팩트 제공',
  C: '가격·혜택 소구 콘텐츠, 실사용 후기 형식',
  D: 'AI 서비스 시연, "나도 써봤어요" 리뷰형',
  F: 'USP 실증 콘텐츠, 전후 비교로 설득력 강화'
};
// Placeholder for possible contentType 'E' (데이터 랭킹) if AI emits it
const COLLAB_TEMPLATE_E = '데이터 랭킹 콘텐츠, 시각화 자료 브랜드 제공';

interface Props {
  queries: string[]; // from opportunity.youtubeSearchQueries (JSON)
  contentType: ContentType;
}

export default function CreatorMatchPanel({ queries, contentType }: Props) {
  const validQueries = (queries || []).filter(Boolean);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [creators, setCreators] = useState<CreatorMatch[]>([]);
  const [usedQuery, setUsedQuery] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempted, setAttempted] = useState<string[]>([]);
  const [retryNonce, setRetryNonce] = useState(0);

  const template =
    COLLAB_TEMPLATES[contentType] ?? (contentType as string) === 'E' ? COLLAB_TEMPLATE_E : COLLAB_TEMPLATES.A;

  useEffect(() => {
    if (!open || validQueries.length === 0) return;
    let cancelled = false;

    async function iterate() {
      setLoading(true);
      setError(null);
      setNote(null);
      setCreators([]);
      setUsedQuery(null);
      const tried: string[] = [];

      for (const q of validQueries) {
        tried.push(q);
        try {
          const url = `/api/youtube?type=search&q=${encodeURIComponent(q)}&contentType=${encodeURIComponent(contentType)}`;
          const res = await fetch(url);
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(data?.error || `API 오류 (${res.status})`);
          }
          const items = Array.isArray(data.creators) ? (data.creators as CreatorMatch[]) : [];
          if (cancelled) return;
          if (items.length >= 3) {
            setCreators(items.slice(0, 5));
            setUsedQuery(q);
            setAttempted(tried);
            return;
          }
          // keep best-so-far as fallback
          if (items.length > creators.length) {
            setCreators(items.slice(0, 5));
            setUsedQuery(q);
          }
        } catch (err) {
          if (cancelled) return;
          setError(err instanceof Error ? err.message : '알 수 없는 오류');
          setAttempted(tried);
          return;
        }
      }

      if (cancelled) return;
      setAttempted(tried);
      if (creators.length === 0) {
        setNote(`'${validQueries.join(' / ')}'로 매칭되는 개인 크리에이터가 없었습니다.`);
      }
    }

    iterate().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, JSON.stringify(validQueries), contentType, retryNonce]);

  if (validQueries.length === 0) return null;

  return (
    <div
      style={{
        background: brand.surface,
        border: `0.5px solid ${brand.border}`,
        borderRadius: radius.lg,
        overflow: 'hidden'
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          fontSize: 13,
          fontWeight: 700,
          color: brand.textTitle,
          background: 'transparent'
        }}
      >
        <span>🎤 크리에이터 매칭 (맥락 기반)</span>
        <span style={{ color: brand.textMeta, fontSize: 14 }}>{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div
          style={{
            padding: '0 18px 18px',
            borderTop: `0.5px solid ${brand.border}`,
            paddingTop: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}
        >
          {/* Static collab template */}
          <div
            style={{
              fontSize: 12,
              color: brand.textBody,
              lineHeight: 1.6,
              padding: '10px 12px',
              background: brand.bg,
              borderRadius: 8,
              borderLeft: `3px solid ${brand.primary}`
            }}
          >
            <strong style={{ color: brand.textTitle, fontWeight: 600 }}>
              이 크리에이터와 협업 시 —
            </strong>{' '}
            {template}
          </div>

          {loading && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: 14,
                background: brand.bg,
                borderRadius: 8,
                fontSize: 12,
                color: brand.textBody
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  border: `2px solid ${brand.border}`,
                  borderTopColor: brand.primary,
                  display: 'inline-block',
                  animation: 'mde-spin 0.8s linear infinite'
                }}
              />
              크리에이터 검색 중... ({attempted.length || 1}/{validQueries.length})
            </div>
          )}

          {!loading && error && (
            <ErrorState message={error} onRetry={() => setRetryNonce((n) => n + 1)} />
          )}

          {!loading && !error && creators.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {creators.map((c) => (
                <CreatorCard key={c.channelId} creator={c} template={template} />
              ))}
            </div>
          )}

          {!loading && !error && creators.length === 0 && note && (
            <div
              style={{
                padding: 14,
                background: brand.bg,
                border: `0.5px dashed ${brand.border}`,
                borderRadius: 8,
                fontSize: 12,
                color: brand.textBody,
                lineHeight: 1.55
              }}
            >
              🔍 {note}
            </div>
          )}

          {/* Debug footer */}
          {(usedQuery || attempted.length > 0) && (
            <div
              style={{
                fontSize: 10,
                color: brand.textMeta,
                lineHeight: 1.55,
                paddingTop: 6,
                borderTop: `0.5px dashed ${brand.border}`
              }}
            >
              YouTube 실시간 검색 · 쿼리: {usedQuery ? `"${usedQuery}"` : '—'} · 최근 90일 숏폼 · 뉴스 제외
              {attempted.length > 1 && (
                <span> · 시도 {attempted.length}개 쿼리 [{attempted.join(' → ')}]</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CreatorCard({
  creator: c,
  template
}: {
  creator: CreatorMatch;
  template: string;
}) {
  const tierColor = TIER_COLOR[c.tier];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: 12,
        padding: 14,
        background: '#F8FAFC',
        border: `1px solid ${brand.border}`,
        borderLeft: `3px solid ${tierColor}`,
        borderRadius: 12
      }}
    >
      <a
        href={c.channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', flexShrink: 0 }}
      >
        {c.channelThumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.channelThumbnail}
            alt={c.channelTitle}
            width={40}
            height={40}
            style={{ borderRadius: 20, objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              background: tierColor,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 800
            }}
          >
            {c.channelTitle.slice(0, 1)}
          </div>
        )}
      </a>
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href={c.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: brand.textTitle,
              textDecoration: 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '60%'
            }}
          >
            {c.channelTitle}
          </a>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '1px 7px',
              background: `${tierColor}20`,
              color: tierColor,
              borderRadius: 4,
              letterSpacing: 0.3
            }}
          >
            {c.tier}
          </span>
          <span style={{ fontSize: 10, color: brand.textMeta, fontVariantNumeric: 'tabular-nums' }}>
            구독자 {formatCount(c.subscriberCount)}
          </span>
        </div>
        <a
          href={c.recentVideo.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 11,
            color: brand.textBody,
            textDecoration: 'none',
            lineHeight: 1.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          최근: {c.recentVideo.title} ↗
        </a>
        <div
          style={{
            fontSize: 11,
            color: brand.primary,
            fontWeight: 500,
            lineHeight: 1.5,
            marginTop: 2
          }}
        >
          이 크리에이터와 협업 시 — {template}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const isNoKey = /YOUTUBE_API_KEY/i.test(message);
  const isQuota = /할당량|quota/i.test(message);
  return (
    <div
      style={{
        padding: 14,
        border: '0.5px solid #FCA5A5',
        background: '#FEF2F2',
        color: '#991B1B',
        borderRadius: radius.md,
        fontSize: 12,
        lineHeight: 1.55
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4 }}>⚠️ 크리에이터 매칭 실패</div>
      <div style={{ marginBottom: 6 }}>{message}</div>
      {isNoKey && (
        <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 8, lineHeight: 1.55 }}>
          Vercel 대시보드 → Project Settings → Environment Variables에{' '}
          <code style={{ background: '#FECACA', padding: '1px 5px', borderRadius: 3 }}>
            YOUTUBE_API_KEY
          </code>
          를 추가한 뒤 재배포하세요.
        </div>
      )}
      {isQuota && (
        <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 8, lineHeight: 1.55 }}>
          기본 할당량은 일 10,000 units. 검색 1회당 ~100 units 소모.
        </div>
      )}
      <button
        onClick={onRetry}
        style={{
          fontSize: 11,
          padding: '6px 12px',
          background: '#991B1B',
          color: '#fff',
          borderRadius: 4,
          fontWeight: 600
        }}
      >
        다시 시도
      </button>
    </div>
  );
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
