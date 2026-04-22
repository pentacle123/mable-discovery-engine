import AppHeader from '@/components/AppHeader';
import ProgressBar from '@/components/ProgressBar';
import Hero from '@/components/Hero';
import NowTop5Section from '@/components/NowTop5Section';
import ServicesSection from '@/components/ServicesSection';
import MomentsSection from '@/components/MomentsSection';
import { metadata as platformMeta } from '@/lib/data';
import { brand } from '@/lib/brand';

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <ProgressBar active="discovery" />
      <Hero />
      <NowTop5Section />
      <ServicesSection />
      <MomentsSection />
      <footer
        style={{
          borderTop: `0.5px solid ${brand.border}`,
          background: brand.surface,
          padding: '18px 24px',
          color: brand.textMeta,
          fontSize: 11,
          textAlign: 'center'
        }}
      >
        © 2026 KB증권 × Pentacle · {platformMeta.stats.data_source} · {platformMeta.platform.last_updated}
      </footer>
    </>
  );
}
