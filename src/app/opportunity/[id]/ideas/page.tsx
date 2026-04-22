import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import ProgressBar from '@/components/ProgressBar';
import IdeasClient from '@/components/IdeasClient';
import { brand, container, radius } from '@/lib/brand';
import { getOpportunity, OPPORTUNITY_IDS } from '@/lib/data';

export function generateStaticParams() {
  return OPPORTUNITY_IDS.map((id) => ({ id }));
}

export default function IdeasPage({ params }: { params: { id: string } }) {
  const o = getOpportunity(params.id);
  if (!o) notFound();

  return (
    <>
      <AppHeader />
      <ProgressBar active="ideas" opportunityId={o.id} />

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
            href={`/opportunity/${o.id}`}
            style={{
              fontSize: 11,
              color: brand.primary,
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            ← 기회 분석
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
            Step 3 · AI Ideas
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
            🤖 {o.title} — AI 아이디어 3개
          </h1>
          <p style={{ fontSize: 12, color: brand.textBody, lineHeight: 1.55 }}>
            {o.ai_ideas_seed.target} · {o.ai_ideas_seed.tone} · {o.ai_ideas_seed.format_hint}
          </p>
        </div>
      </section>

      <main style={{ ...container, paddingTop: 20, paddingBottom: 60 }}>
        <IdeasClient opportunity={o} />
      </main>
    </>
  );
}
