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

const CT_STYLE: Record<ContentType, { bg: string; fg: string; label: string }> = {
  A: { bg: '#FEF2F2', fg: '#DC2626', label: '후기체험형' },
  B: { bg: '#F0FDF4', fg: '#16A34A', label: '정보비교형' },
  C: { bg: '#F0FDF4', fg: '#16A34A', label: '가격특가형' },
  D: { bg: '#F0FDF4', fg: '#16A34A', label: 'AI일정형' },
  F: { bg: '#EFF6FF', fg: '#0770E3', label: 'USP실증형' }
};

interface Props {
  queries: string[];
  contentType: ContentType;
  strategy?: string;
}

export default function CreatorMatchPanel({ queries, contentType, strategy }: Props) {
  const validQueries = (queries || []).filter(Boolean);
  const [activeQuery, setActiveQuery] = useState<string>(validQueries[0] || '');
  const [results, setResults] = useState<Record<string, CreatorMatch[] | string>>({});
  const [loadingQuery, setLoadingQuery] = useState<string | null>(null);
  const [errorByQuery, setErrorByQuery] = useState<Record<string, string>>({});
  const ct = CT_STYLE[contentType] ?? CT_STYLE.C;

  useEffect(() => {
    if (!activeQuery) return;
    if (results[activeQuery] !== undefined) return; // already loaded
    fetchQuery(activeQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuery]);

  async function fetchQuery(q: string) {
    setLoadingQuery(q);
    setErrorByQuery((prev) => ({ ...prev, [q]: '' }));
    try {
      const url = `/api/youtube?type=search&q=${encodeURIComponent(
        q
      )}&contentType=${encodeURIComponent(contentType)}`;
      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `API 오류 (${res.status})`);
      }
      const items = Array.isArray(data.creators) ? (data.creators as CreatorMatch[]) : [];
      if (items.length === 0 && data.note) {
        setResults((prev) => ({ ...prev, [q]: data.note as string }));
      } else {
        setResults((prev) => ({ ...prev, [q]: items }));
      }
    } catch (err) {
      setErrorByQuery((prev) => ({
        ...prev,
        [q]: err instanceof Error ? err.message : '알 수 없는 오류'
      }));
    } finally {
      setLoadingQuery(null);
    }
  }

  if (validQueries.length === 0) return null;

  const currentResult = results[activeQuery];
  const currentError = errorByQuery[activeQuery];
  const isLoading = loadingQuery === activeQuery;

  return (
    <div
      style={{
        background: brand.surface,
        border: `0.5px solid ${brand.border}`,
        borderRadius: radius.lg,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          flexWrap: 'wrap'
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 700, color: brand.textTitle }}>
          🎤 크리에이터 매칭 (맥락 기반)
        </div>
        <div
          style={{
            fontSize: 10,
            padding: '2px 7px',
            borderRadius: 4,
            background: ct.bg,
            color: ct.fg,
            fontWeight: 600
          }}
        >
          {contentType}. {ct.label}
        </div>
      </div>

      {strategy && (
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
          👤 <strong style={{ color: brand.textTitle, fontWeight: 600 }}>협업 포인트 —</strong>{' '}
          {strategy}
        </div>
      )}

      {/* Query chips (switch active) */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {validQueries.map((q) => {
          const active = q === activeQuery;
          const loaded = results[q] !== undefined;
          return (
            <button
              key={q}
              onClick={() => setActiveQuery(q)}
              style={{
                fontSize: 12,
                padding: '6px 12px',
                background: active ? brand.primary : brand.heroBg,
                color: active ? '#fff' : brand.primary,
                borderRadius: 999,
                fontWeight: 600,
                border: `0.5px solid ${active ? brand.primary : 'rgba(12, 68, 124, 0.15)'}`,
                whiteSpace: 'nowrap'
              }}
            >
              🔎 {q}
              {loaded && !active && (
                <span style={{ marginLeft: 4, opacity: 0.6, fontWeight: 500, fontSize: 10 }}>·</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {isLoading && <LoadingState query={activeQuery} />}
      {!isLoading && currentError && <ErrorState message={currentError} onRetry={() => fetchQuery(activeQuery)} />}
      {!isLoading && !currentError && typeof currentResult === 'string' && (
        <EmptyState note={currentResult} />
      )}
      {!isLoading && !currentError && Array.isArray(currentResult) && currentResult.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {currentResult.map((c) => (
            <CreatorCard key={c.channelId} creator={c} />
          ))}
        </div>
      )}

      <div style={{ fontSize: 11, color: brand.textMeta, lineHeight: 1.55 }}>
        💡 YouTube Data API로 실시간 검색 · 숏폼(4분 미만) · 최근 90일 · 한국어 기준.
        구독자 500~300만, 뉴스·방송사 필터링 후 상위 5개 매칭.
      </div>
    </div>
  );
}

function CreatorCard({ creator: c }: { creator: CreatorMatch }) {
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
          이 크리에이터와 협업 시 — {c.collabStrategy}
        </div>
      </div>
    </div>
  );
}

function LoadingState({ query }: { query: string }) {
  return (
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
      '{query}'에 매칭되는 크리에이터 찾는 중...
    </div>
  );
}

function EmptyState({ note }: { note: string }) {
  return (
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
          기본 할당량은 일 10,000 units. 검색 1회당 ~100 units 소모. Google Cloud Console에서 할당량 증가 요청 가능.
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
