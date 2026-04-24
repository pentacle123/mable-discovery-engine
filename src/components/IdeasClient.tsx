'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AIIdea, ContentType, Opportunity } from '@/types';
import { brand, card, radius } from '@/lib/brand';
import { loadIdeas, saveIdeas } from '@/lib/ideasStore';

interface Props {
  opportunity: Opportunity;
}

const CONTENT_TYPE: Record<
  ContentType,
  { label: string; bar: string; badgeBg: string; badgeFg: string }
> = {
  A: { label: '후기체험형', bar: '#FF6B6B', badgeBg: '#FEF2F2', badgeFg: '#DC2626' },
  B: { label: '정보비교형', bar: '#10B981', badgeBg: '#F0FDF4', badgeFg: '#16A34A' },
  C: { label: '가격특가형', bar: '#10B981', badgeBg: '#F0FDF4', badgeFg: '#16A34A' },
  D: { label: 'AI일정형', bar: '#10B981', badgeBg: '#F0FDF4', badgeFg: '#16A34A' },
  F: { label: 'USP실증형', bar: '#0770E3', badgeBg: '#EFF6FF', badgeFg: '#0770E3' }
};

const STAGE_BADGE: Record<string, { bg: string; fg: string }> = {
  Dream: { bg: '#EFF6FF', fg: '#0770E3' },
  Plan: { bg: '#FFF7ED', fg: '#FF6B00' },
  Book: { bg: '#F0FDF4', fg: '#10B981' },
  Share: { bg: '#FFFBEB', fg: '#D97706' }
};

const LOADING_STEPS = [
  { label: '소비자 맥락 분석', from: 0, to: 5 },
  { label: '3개 콘텐츠 유형 조합', from: 5, to: 10 },
  { label: '아이디어 씬 구성 중', from: 10, to: 999 }
];

const TABS = [
  { key: 'auto', label: 'AI 자동 추천', enabled: true },
  { key: 'context', label: 'A. 소비자 맥락 조합', enabled: false },
  { key: 'journey', label: 'B. 검색 여정 발견', enabled: false },
  { key: 'cross', label: 'C. 크로스 카테고리', enabled: false }
];

export default function IdeasClient({ opportunity: o }: Props) {
  const [ideas, setIdeas] = useState<AIIdea[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [storyboardLoadingIdx, setStoryboardLoadingIdx] = useState<number | null>(null);
  const [storyboardError, setStoryboardError] = useState<string | null>(null);
  const router = useRouter();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const cached = loadIdeas(o.id);
    if (cached) setIdeas(cached as AIIdea[]);
  }, [o.id]);

  useEffect(() => {
    if (loading) {
      setElapsed(0);
      intervalRef.current = setInterval(() => setElapsed((t) => t + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loading]);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunity_id: o.id })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `API 오류 (${res.status})`);
      const incoming = Array.isArray(data.ideas) ? (data.ideas as AIIdea[]) : [];
      setIdeas(incoming);
      saveIdeas(o.id, incoming);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  }

  async function openStoryboard(index: number) {
    if (!ideas) return;
    const target = ideas[index];
    if (!target) return;
    setStoryboardError(null);

    // Already has storyboard — just navigate
    if (target.storyboard?.youtubeShorts) {
      router.push(`/opportunity/${o.id}/ideas/${index}/storyboard`);
      return;
    }

    setStoryboardLoadingIdx(index);
    try {
      const res = await fetch('/api/storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunity_id: o.id, idea: target })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `API 오류 (${res.status})`);
      const updated = ideas.map((it, i) => (i === index ? { ...it, storyboard: data.storyboard } : it));
      setIdeas(updated);
      saveIdeas(o.id, updated);
      router.push(`/opportunity/${o.id}/ideas/${index}/storyboard`);
    } catch (err) {
      setStoryboardError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setStoryboardLoadingIdx(null);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Top bar: seed context + regenerate */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap'
        }}
      >
        <div style={{ fontSize: 12, color: brand.textMeta, lineHeight: 1.55, maxWidth: 780 }}>
          타겟 <strong style={{ color: brand.textBody }}>{o.ai_ideas_seed.target}</strong> ·{' '}
          톤 <strong style={{ color: brand.textBody }}>{o.ai_ideas_seed.tone}</strong> ·{' '}
          포맷 <strong style={{ color: brand.textBody }}>{o.ai_ideas_seed.format_hint}</strong>
        </div>
        {ideas && !loading && (
          <button
            onClick={generate}
            style={{
              padding: '8px 18px',
              background: brand.surface,
              border: `1px solid ${brand.border}`,
              borderRadius: 24,
              fontSize: 13,
              color: brand.textBody,
              fontWeight: 500,
              whiteSpace: 'nowrap'
            }}
          >
            ↻ 다른 관점으로 재생성
          </button>
        )}
      </div>

      {/* 4-tab filter */}
      <TabFilter />

      {!ideas && !loading && <EmptyState onGenerate={generate} />}
      {loading && <Loading elapsed={elapsed} />}
      {error && <ErrorBox message={error} onRetry={generate} />}

      {ideas && ideas.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {storyboardError && (
            <div
              style={{
                padding: 12,
                border: '0.5px solid #FCA5A5',
                background: '#FEF2F2',
                color: '#991B1B',
                borderRadius: radius.md,
                fontSize: 12,
                lineHeight: 1.55
              }}
            >
              ⚠️ 스토리보드 생성 실패: {storyboardError}
            </div>
          )}
          {ideas.map((idea, i) => (
            <IdeaCard
              key={i}
              idea={idea}
              index={i}
              opportunityId={o.id}
              loading={storyboardLoadingIdx === i}
              onOpenStoryboard={() => openStoryboard(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TabFilter() {
  return (
    <div
      style={{
        display: 'flex',
        gap: 6,
        borderBottom: `0.5px solid ${brand.border}`,
        overflowX: 'auto'
      }}
    >
      {TABS.map((t) => {
        const active = t.enabled; // only first is enabled = active
        return (
          <div
            key={t.key}
            style={{
              padding: '10px 14px',
              fontSize: 12,
              fontWeight: active ? 700 : 500,
              color: active ? brand.textTitle : brand.textMeta,
              borderBottom: `2px solid ${active ? brand.primary : 'transparent'}`,
              marginBottom: -1,
              cursor: active ? 'default' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
              opacity: active ? 1 : 0.55
            }}
          >
            <span>{t.label}</span>
            {!active && <span style={{ fontSize: 10, color: brand.textMeta }}>(준비중)</span>}
          </div>
        );
      })}
    </div>
  );
}

function IdeaCard({
  idea,
  index,
  opportunityId,
  loading,
  onOpenStoryboard
}: {
  idea: AIIdea;
  index: number;
  opportunityId: string;
  loading: boolean;
  onOpenStoryboard: () => void;
}) {
  const type = CONTENT_TYPE[idea.contentType] ?? CONTENT_TYPE.B;
  const score =
    typeof idea.conversionScore === 'number' && idea.conversionScore > 0
      ? idea.conversionScore
      : 95 - index * 3;
  const scoreColor = score >= 95 ? '#10B981' : score >= 85 ? '#0770E3' : '#FF6B00';
  const stageStyle = idea.stage ? STAGE_BADGE[idea.stage] : undefined;
  const scenes = (idea.sceneFlow || []).slice(0, 4);

  return (
    <div
      style={{
        background: brand.surface,
        border: `1px solid ${brand.border}`,
        borderLeft: `4px solid ${type.bar}`,
        borderRadius: 16,
        padding: '20px 24px',
        display: 'flex',
        gap: 20,
        alignItems: 'flex-start'
      }}
    >
      {/* LEFT · number circle */}
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: 'rgba(7, 112, 227, 0.1)',
          color: brand.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          fontWeight: 800,
          flexShrink: 0,
          fontVariantNumeric: 'tabular-nums'
        }}
      >
        {(idea.rank ?? index + 1).toString()}
      </div>

      {/* MIDDLE · info */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* row 1: badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Badge bg={type.badgeBg} fg={type.badgeFg}>
            {idea.contentType}. {idea.contentTypeLabel || type.label}
          </Badge>
          {stageStyle && idea.stage && (
            <Badge bg={stageStyle.bg} fg={stageStyle.fg}>
              {idea.stage}
            </Badge>
          )}
        </div>

        {/* row 2: title */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: brand.textTitle,
            lineHeight: 1.4,
            letterSpacing: -0.15
          }}
        >
          {idea.title}
        </div>

        {/* row 3: target keyword */}
        {idea.targetKeyword && (
          <div style={{ fontSize: 11, color: brand.textBody, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span>🎯 타겟 진입점</span>
            <span
              style={{
                padding: '2px 8px',
                background: 'rgba(7, 112, 227, 0.12)',
                color: brand.primary,
                borderRadius: 6,
                fontWeight: 600
              }}
            >
              {idea.targetKeyword}
            </span>
            {typeof idea.targetKeywordVol === 'number' && (
              <span style={{ color: brand.textMeta }}>
                ({idea.targetKeywordVol.toLocaleString('ko-KR')}/연)
              </span>
            )}
            {idea.target && (
              <span style={{ color: brand.textMeta }}>· {idea.target}</span>
            )}
          </div>
        )}

        {/* row 4: data proof */}
        {idea.dataProof && (
          <div style={{ fontSize: 12, color: brand.textBody, lineHeight: 1.55 }}>
            📊 {idea.dataProof}
          </div>
        )}

        {/* row 5: HOOK */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#FF6B00',
            lineHeight: 1.45,
            letterSpacing: -0.2
          }}
        >
          ✦ HOOK: {idea.hook3s}
        </div>

        {/* row 6: scene flow (4-column grid, 1-line) */}
        {scenes.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8
            }}
          >
            {scenes.map((sc, i) => (
              <div
                key={i}
                style={{
                  background: '#F8FAFC',
                  border: `1px solid ${brand.border}`,
                  borderRadius: 10,
                  padding: '8px 10px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  minHeight: 56
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: brand.primary
                  }}
                >
                  씬 {i + 1}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: brand.textTitle,
                    lineHeight: 1.4,
                    fontWeight: 500
                  }}
                >
                  {sc}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* row 7: USP */}
        {idea.uspConnection && (
          <div style={{ fontSize: 12, color: brand.primary, fontWeight: 500 }}>
            USP: {idea.uspConnection}
          </div>
        )}

        {/* row 8: creator strategy box */}
        {idea.creatorStrategy && (
          <div
            style={{
              background: '#F8FAFC',
              border: `1px solid ${brand.border}`,
              borderRadius: 10,
              padding: '8px 12px',
              fontSize: 12,
              color: brand.textTitle,
              lineHeight: 1.5
            }}
          >
            🎬 크리에이터 협업 — {idea.creatorStrategy}
          </div>
        )}
      </div>

      {/* RIGHT · score + button */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          minWidth: 96,
          flexShrink: 0,
          paddingTop: 4,
          alignSelf: 'stretch'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: scoreColor,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {score}
          </div>
          <div style={{ fontSize: 10, color: brand.textMeta, marginTop: 2 }}>전환점수</div>
        </div>
        <button
          onClick={onOpenStoryboard}
          disabled={loading}
          style={{
            marginTop: 12,
            padding: '10px 16px',
            background: loading ? '#CBD5E1' : brand.primary,
            color: '#fff',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          {loading && (
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.5)',
                borderTopColor: '#fff',
                display: 'inline-block',
                animation: 'mde-spin 0.8s linear infinite'
              }}
            />
          )}
          {loading ? '구성 중...' : '스토리보드 보기 →'}
        </button>
      </div>
    </div>
  );
}

function Badge({ children, bg, fg }: { children: React.ReactNode; bg: string; fg: string }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        padding: '3px 10px',
        borderRadius: 8,
        background: bg,
        color: fg,
        letterSpacing: 0.2
      }}
    >
      {children}
    </span>
  );
}

function EmptyState({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div
      style={{
        ...card,
        padding: 40,
        textAlign: 'center',
        borderStyle: 'dashed'
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 10 }}>🤖</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: brand.textTitle, marginBottom: 6 }}>
        Claude가 아이디어 3개를 도출합니다
      </div>
      <div style={{ fontSize: 11, color: brand.textMeta, marginBottom: 18, lineHeight: 1.55 }}>
        약 15초 소요 · 스토리보드는 카드에서 클릭 시 따로 생성됩니다
      </div>
      <button
        onClick={onGenerate}
        style={{
          padding: '12px 24px',
          background: brand.primary,
          color: '#fff',
          fontWeight: 600,
          fontSize: 14,
          borderRadius: radius.md
        }}
      >
        AI 아이디어 3개 생성
      </button>
    </div>
  );
}

function Loading({ elapsed }: { elapsed: number }) {
  return (
    <div
      style={{
        ...card,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: `3px solid ${brand.border}`,
          borderTopColor: brand.primary,
          animation: 'mde-spin 0.9s linear infinite'
        }}
      />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: brand.textTitle, marginBottom: 4 }}>
          AI가 3개 아이디어를 생성 중입니다
        </div>
        <div style={{ fontSize: 11, color: brand.textMeta }}>
          평균 15초 소요 · 경과 {elapsed}초
        </div>
      </div>
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          background: '#F8FAFC',
          border: `1px solid ${brand.border}`,
          borderRadius: 10,
          padding: 14
        }}
      >
        {LOADING_STEPS.map((s) => {
          const done = elapsed >= s.to;
          const active = elapsed >= s.from && elapsed < s.to;
          const pending = elapsed < s.from;
          const icon = done ? '✓' : active ? '⟳' : '·';
          const color = done ? '#10B981' : active ? brand.primary : brand.textMeta;
          return (
            <div
              key={s.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 12,
                color: pending ? brand.textMeta : brand.textBody,
                fontWeight: active ? 600 : 500
              }}
            >
              <span
                style={{
                  width: 16,
                  textAlign: 'center',
                  color,
                  display: 'inline-block',
                  animation: active ? 'mde-spin 1.2s linear infinite' : undefined
                }}
              >
                {icon}
              </span>
              <span>
                {s.label}
                {active ? '...' : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ErrorBox({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      style={{
        padding: 16,
        border: '0.5px solid #FCA5A5',
        background: '#FEF2F2',
        color: '#991B1B',
        borderRadius: radius.md,
        fontSize: 13,
        lineHeight: 1.55
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>⚠️ 생성 실패</div>
      <div style={{ marginBottom: 8 }}>{message}</div>
      <div style={{ fontSize: 11, marginBottom: 10, opacity: 0.8 }}>
        .env.local ANTHROPIC_API_KEY 확인 + dev 서버 재시작 필요
      </div>
      <button
        onClick={onRetry}
        style={{
          fontSize: 12,
          padding: '7px 14px',
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
