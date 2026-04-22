import type { Metadata } from 'next';
import platformMeta from '@/data/metadata.json';
import './globals.css';

export const metadata: Metadata = {
  title: `${platformMeta.platform.name} | KB증권 × Pentacle`,
  description: platformMeta.platform.tagline
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
