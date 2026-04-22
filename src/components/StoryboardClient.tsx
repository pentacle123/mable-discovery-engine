'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type {
  AIIdea,
  ContentType,
  FactSheet,
  IdeaStoryboard,
  Opportunity,
  StoryboardPlatform
} from '@/types';
import { brand, card, radius } from '@/lib/brand';
import { loadIdeas, saveIdeas } from '@/lib/ideasStore';
import CreatorMatchPanel from './CreatorMatchPanel';

interface Props {
  opportunity: Opportunity;
  ideaIndex: number;
}

const CT_STYLE: Record<ContentType, { bg: string; fg: string; label: string }> = {
  A: { bg: '#FEF2F2', fg: '#DC2626', label: '후기체험형' },
  B: { bg: '#F0FDF4', fg: '#16A34A', label: '정보비교형' },
  C: { bg: '#F0FDF4', fg: '#16A34A', label: '가격특가형' },
  D: { bg: '#F0FDF4', fg: '#16A34A', label: 'AI일정형' },
  F: { bg: '#EFF6FF', fg: '#0770E3', label: 'USP실증형' }
};

export default function StoryboardClient({ opportunity: o, ideaIndex }: Props) {
  const [idea, setIdea] = useState<AIIdea | null>(null);
  const [missing, setMissing] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const ideas = loadIdeas(o.id) as AIIdea[] | null;
    if (!ideas || !ideas[ideaIndex]) {
      setMissing(true);
      return;
    }
    setIdea(ideas[ideaIndex]);
  }, [o.id, ideaIndex]);

  // If the cached idea has no storyboard yet, fetch it on-demand.
  useEffect(() => {
    if (!idea) return;
    if (idea.storyboard?.youtubeShorts) return;
    let cancelled = false;
    setFetching(true);
    setFetchError(null);
    setElapsed(0);
    const interval = setInterval(() => setElapsed((t) => t + 1), 1000);

    (async () => {
      try {
        const res = await fetch('/api/storyboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ opportunity_id: o.id, idea })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || `API 오류 (${res.status})`);
        if (cancelled) return;
        const merged: AIIdea = { ...idea, storyboard: data.storyboard };
        setIdea(merged);
        // persist
        const ideas = (loadIdeas(o.id) as AIIdea[] | null) || [];
        ideas[ideaIndex] = merged;
        saveIdeas(o.id, ideas);
      } catch (err) {
        if (!cancelled) setFetchError(err instanceof Error ? err.message : '알 수 없는 오류');
      } finally {
        if (!cancelled) {
          setFetching(false);
          clearInterval(interval);
        }
      }
    })();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idea?.rank, idea?.title]);

  if (missing) {
    return (
      <div
        style={{
          ...card,
          padding: 36,
          textAlign: 'center',
          borderStyle: 'dashed'
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: brand.textTitle, marginBottom: 4 }}>
          선택한 아이디어를 찾을 수 없습니다
        </div>
        <div style={{ fontSize: 11, color: brand.textMeta, marginBottom: 14, lineHeight: 1.55 }}>
          아이디어 페이지에서 먼저 AI 아이디어를 생성해야 합니다.
        </div>
        <Link
          href={`/opportunity/${o.id}/ideas`}
          style={{
            padding: '10px 18px',
            background: brand.primary,
            color: '#fff',
            fontWeight: 600,
            fontSize: 12,
            borderRadius: radius.md,
            textDecoration: 'none'
          }}
        >
          ← AI 아이디어로 돌아가기
        </Link>
      </div>
    );
  }

  if (!idea) return null;

  const ct = CT_STYLE[idea.contentType] ?? CT_STYLE.C;
  const sb = idea.storyboard;
  const hasStoryboard = !!sb?.youtubeShorts && !!sb?.instagramReels;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* 1. Header */}
      <div style={{ background: brand.heroBg, borderRadius: radius.lg, padding: 20 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 9px',
              borderRadius: 4,
              background: ct.bg,
              color: ct.fg
            }}
          >
            #{idea.rank ?? ideaIndex + 1} · {idea.contentType}. {ct.label}
          </span>
          {idea.stage && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                padding: '3px 9px',
                borderRadius: 4,
                background: brand.surface,
                border: `0.5px solid ${brand.border}`,
                color: brand.textBody
              }}
            >
              {idea.stage}
            </span>
          )}
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 9px',
              borderRadius: 4,
              background: brand.primary,
              color: '#fff'
            }}
          >
            Score {idea.conversionScore}
          </span>
        </div>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: brand.primaryDeep,
            marginBottom: 10,
            letterSpacing: -0.2
          }}
        >
          {idea.title}
        </h2>
        <div
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: brand.primaryDeep,
            fontStyle: 'italic',
            lineHeight: 1.45,
            padding: '10px 14px',
            background: '#FFFBEB',
            border: '0.5px solid #FDE68A',
            borderRadius: 8
          }}
        >
          🪝 {idea.hook3s}
        </div>
      </div>

      {/* 2. Fetch state */}
      {fetching && <FetchingBanner elapsed={elapsed} />}
      {fetchError && (
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
          ⚠️ 스토리보드 생성 실패: {fetchError}
        </div>
      )}

      {/* 3. YouTube | Instagram parallel */}
      {hasStoryboard && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 12
          }}
        >
          <PlatformColumn
            label="YouTube Shorts"
            emoji="▶️"
            color="#FF0000"
            plan={sb!.youtubeShorts}
          />
          <PlatformColumn
            label="Instagram Reels"
            emoji="📷"
            color="#E1306C"
            plan={sb!.instagramReels}
          />
        </div>
      )}

      {/* 4. 4-box meta */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 8
        }}
      >
        <MetaBox label="🎯 타겟" value={idea.target} />
        <MetaBox label="👤 크리에이터 전략" value={idea.creatorStrategy} />
        <MetaBox label="📊 데이터 근거" value={idea.dataProof} />
        <MetaBox label="🔗 USP 연결" value={idea.uspConnection} />
      </div>

      {/* 5. Factsheet (new 4-block schema) */}
      {hasStoryboard && sb?.factSheet && <FactSheetBox fact={sb.factSheet} />}

      {/* 6. Creator matching — context-aware (YouTube API).
          Queries now come from opportunity.youtubeSearchQueries (JSON),
          not idea.creatorSearchQueries (removed from prompt). */}
      {hasStoryboard &&
        Array.isArray(o.youtubeSearchQueries) &&
        o.youtubeSearchQueries.length > 0 && (
          <CreatorMatchPanel
            queries={o.youtubeSearchQueries}
            contentType={idea.contentType}
          />
        )}

      {/* 7. Back */}
      <div style={{ marginTop: 4 }}>
        <Link
          href={`/opportunity/${o.id}/ideas`}
          style={{
            padding: '10px 16px',
            background: brand.surface,
            border: `0.5px solid ${brand.border}`,
            borderRadius: radius.md,
            fontSize: 13,
            color: brand.textBody,
            fontWeight: 500,
            textDecoration: 'none'
          }}
        >
          ← 다른 아이디어 보기
        </Link>
      </div>
    </div>
  );
}

function FetchingBanner({ elapsed }: { elapsed: number }) {
  return (
    <div
      style={{
        ...card,
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: `2px solid ${brand.border}`,
          borderTopColor: brand.primary,
          animation: 'mde-spin 0.9s linear infinite',
          flexShrink: 0
        }}
      />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: brand.textTitle }}>
          스토리보드 구성 중
        </div>
        <div style={{ fontSize: 11, color: brand.textMeta }}>
          YouTube × Instagram × 팩트시트 · 약 10초 · 경과 {elapsed}초
        </div>
      </div>
    </div>
  );
}

function PlatformColumn({
  label,
  emoji,
  color,
  plan
}: {
  label: string;
  emoji: string;
  color: string;
  plan: StoryboardPlatform;
}) {
  // Strip leading "Scene N." / "씬N." / "1." prefixes so the UI can
  // supply its own numbering without duplication.
  const scenes = (plan.scenes || []).map((s) =>
    s.replace(/^\s*(?:scene|씬)?\s*\d+\s*\.[\s\d\.]*/i, '').trim()
  );

  return (
    <div
      style={{
        background: brand.surface,
        border: `0.5px solid ${brand.border}`,
        borderTop: `3px solid ${color}`,
        borderRadius: radius.lg,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          paddingBottom: 10,
          borderBottom: `0.5px solid ${brand.border}`
        }}
      >
        <div style={{ fontSize: 18 }}>{emoji}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color }}>{label}</div>
        {plan.title && (
          <div
            style={{
              marginLeft: 'auto',
              fontSize: 11,
              color: brand.textMeta,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {plan.title}
          </div>
        )}
      </div>

      <Row label="HOOK (0-3s)" color={color} text={plan.hook} strong />

      <div>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.8,
            color,
            marginBottom: 8
          }}
        >
          SCENE FLOW
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {scenes.map((sc, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                padding: '10px 0',
                borderBottom: i < scenes.length - 1 ? '1px solid #F3F4F6' : 'none'
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  background: `${color}1A`,
                  color,
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
                  lineHeight: 1.6
                }}
              >
                {sc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Row label="PROOF" color={color} text={plan.proof} />
      <Row label="CTA" color={color} text={plan.cta} strong />
      {plan.hashtags && plan.hashtags.length > 0 && (
        <Row label="HASHTAGS" color={color}>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {plan.hashtags.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 11,
                  padding: '2px 7px',
                  background: `${color}15`,
                  color,
                  borderRadius: 4,
                  fontWeight: 500
                }}
              >
                #{t}
              </span>
            ))}
          </div>
        </Row>
      )}
      {(plan.uploadTime || plan.targetCluster) && (
        <div style={{ fontSize: 11, color: brand.textMeta, lineHeight: 1.55 }}>
          {plan.uploadTime && <>🕐 {plan.uploadTime}</>}
          {plan.uploadTime && plan.targetCluster && ' · '}
          {plan.targetCluster && <>🎯 {plan.targetCluster}</>}
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  color,
  text,
  children,
  strong
}: {
  label: string;
  color: string;
  text?: string;
  children?: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 0.8,
          color,
          marginBottom: 6
        }}
      >
        {label}
      </div>
      {text && (
        <div
          style={{
            fontSize: strong ? 14 : 13,
            fontWeight: strong ? 600 : 500,
            lineHeight: 1.5,
            color: brand.textTitle,
            padding: strong ? '10px 12px' : 0,
            background: strong ? `${color}10` : 'transparent',
            borderRadius: strong ? 8 : 0
          }}
        >
          {text}
        </div>
      )}
      {children}
    </div>
  );
}

function MetaBox({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div
      style={{
        background: brand.surface,
        border: `0.5px solid ${brand.border}`,
        borderRadius: radius.md,
        padding: 12
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: brand.textMeta,
          letterSpacing: 0.3,
          marginBottom: 4,
          textTransform: 'uppercase'
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 12, color: brand.textTitle, lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

function FactSheetBox({ fact }: { fact: FactSheet }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#78350F', paddingLeft: 2 }}>
        📋 콘텐츠 팩트시트
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 16
        }}
      >
        {/* 1. Service assets */}
        <FactBlock title="📱 노출 정보 (앱/서비스)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(fact.serviceAssets || []).map((s, i) => (
              <div
                key={i}
                style={{
                  padding: 10,
                  background: '#FFFBEB',
                  borderRadius: 8,
                  fontSize: 12,
                  color: brand.textTitle,
                  lineHeight: 1.55
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: brand.textBody }}>
                  🚪 {s.access}
                </div>
                <div style={{ fontSize: 11, color: brand.textBody }}>
                  🧭 {s.path}
                </div>
                {s.tip && (
                  <div style={{ fontSize: 11, color: brand.textMeta, marginTop: 3 }}>
                    💡 {s.tip}
                  </div>
                )}
              </div>
            ))}
          </div>
        </FactBlock>

        {/* 2. Key metrics */}
        <FactBlock title="💰 핵심 수치 (검증된 팩트)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(fact.keyMetrics || []).map((m, i) => (
              <div
                key={i}
                style={{
                  padding: 10,
                  background: '#FFFBEB',
                  borderRadius: 8,
                  fontSize: 12,
                  color: brand.textTitle,
                  lineHeight: 1.55
                }}
              >
                <div style={{ fontSize: 11, color: brand.textMeta, marginBottom: 2 }}>
                  {m.metric}
                </div>
                <div style={{ fontWeight: 700, color: '#B45309' }}>{m.value}</div>
                {m.source && (
                  <div style={{ fontSize: 11, color: brand.textBody, marginTop: 3 }}>
                    📖 {m.source}
                  </div>
                )}
                {m.caveat && (
                  <div style={{ fontSize: 11, color: brand.textMeta, marginTop: 2 }}>
                    ⚠️ {m.caveat}
                  </div>
                )}
              </div>
            ))}
          </div>
        </FactBlock>

        {/* 3. Legal checks */}
        <FactBlock title="📜 법적 · 규제 체크포인트">
          <ul
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 6
            }}
          >
            {(fact.legalChecks || []).map((c, i) => (
              <li
                key={i}
                style={{
                  fontSize: 12,
                  color: brand.textTitle,
                  lineHeight: 1.55,
                  padding: '8px 10px',
                  background: '#FFFBEB',
                  borderRadius: 6
                }}
              >
                ✓ {c}
              </li>
            ))}
          </ul>
        </FactBlock>

        {/* 4. Timing */}
        <FactBlock title="⏰ 최적 제작 타이밍">
          <div
            style={{
              fontSize: 13,
              color: brand.textTitle,
              lineHeight: 1.6,
              padding: '10px 12px',
              background: '#FFFBEB',
              borderRadius: 8
            }}
          >
            {fact.timing}
          </div>
          {fact.mableConnection && <MableConnectionBlock conn={fact.mableConnection} />}
        </FactBlock>
      </div>
    </div>
  );
}

function MableConnectionBlock({
  conn
}: {
  conn: NonNullable<FactSheet['mableConnection']>;
}) {
  // Legacy: string value (old factsheets cached before prompt update)
  if (typeof conn === 'string') {
    return (
      <div
        style={{
          fontSize: 11,
          color: brand.textBody,
          marginTop: 8,
          padding: '8px 10px',
          background: '#FFFBEB',
          borderRadius: 6,
          lineHeight: 1.55
        }}
      >
        🔗 M-able 연결: {conn}
      </div>
    );
  }

  // New structured shape
  return (
    <div
      style={{
        marginTop: 10,
        padding: 12,
        background: '#FFFBEB',
        borderRadius: 8,
        border: '0.5px solid #FDE68A',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#92400E', letterSpacing: 0.3 }}>
          🔗 M-ABLE 연결
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: brand.primary,
            background: brand.heroBg,
            padding: '2px 8px',
            borderRadius: 999
          }}
        >
          {conn.service_name}
        </span>
      </div>
      <div style={{ fontSize: 12, color: brand.textTitle, lineHeight: 1.55 }}>
        📱 <strong style={{ fontWeight: 600 }}>진입</strong> — {conn.entry_path}
      </div>
      {conn.specific_content && (
        <div style={{ fontSize: 12, color: brand.textTitle, lineHeight: 1.55 }}>
          🎯 <strong style={{ fontWeight: 600 }}>콘텐츠</strong> — {conn.specific_content}
        </div>
      )}
      {conn.why_here && (
        <div style={{ fontSize: 11, color: brand.textBody, lineHeight: 1.5, fontStyle: 'italic' }}>
          💡 {conn.why_here}
        </div>
      )}
    </div>
  );
}

function FactBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: brand.surface,
        border: '1px solid #F5E6B8',
        borderRadius: 12,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: brand.textTitle }}>{title}</div>
      {children}
    </div>
  );
}
