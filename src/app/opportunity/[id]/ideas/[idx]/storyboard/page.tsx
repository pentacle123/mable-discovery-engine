import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import ProgressBar from '@/components/ProgressBar';
import StoryboardClient from '@/components/StoryboardClient';
import { brand, container, radius } from '@/lib/brand';
import { getOpportunity } from '@/lib/data';

export const dynamicParams = true;

export default function StoryboardPage({ params }: { params: { id: string; idx: string } }) {
  const o = getOpportunity(params.id);
  if (!o) notFound();
  const ideaIndex = Number(params.idx);
  if (Number.isNaN(ideaIndex) || ideaIndex < 0) notFound();

  return (
    <>
      <AppHeader />
      <ProgressBar active="storyboard" opportunityId={o.id} ideaIndex={ideaIndex} />

      <section style={{ ...container, paddingTop: 20 }}>
        <div
          style={{
            background: brand.heroBg,
            borderRadius: radius.lg,
            padding: 22,
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}
        >
          <Link
            href={`/opportunity/${o.id}/ideas`}
            style={{
              fontSize: 11,
              color: brand.primary,
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            ← AI 아이디어
          </Link>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 0.4,
              color: brand.primary,
              fontWeight: 700,
              textTransform: 'uppercase'
            }}
          >
            Step 4 · Storyboard
          </div>
          <h1
            style={{
              fontSize: 19,
              fontWeight: 500,
              color: brand.primaryDeep,
              lineHeight: 1.4,
              letterSpacing: -0.2
            }}
          >
            🎬 {o.title} — 스토리보드
          </h1>
          <p style={{ fontSize: 12, color: brand.textBody, lineHeight: 1.55 }}>
            YouTube Shorts · 크리에이터 협업 숏폼 · 팩트시트 · 크리에이터 매칭
          </p>
        </div>
      </section>

      <main style={{ ...container, paddingTop: 20, paddingBottom: 60 }}>
        <StoryboardClient opportunity={o} ideaIndex={ideaIndex} />
      </main>
    </>
  );
}
