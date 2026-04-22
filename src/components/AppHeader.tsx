import Link from 'next/link';
import { brand, container } from '@/lib/brand';

export default function AppHeader() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        height: 56,
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
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textDecoration: 'none'
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kb-logo.png"
            alt="KB"
            width={56}
            height={28}
            style={{
              objectFit: 'contain',
              display: 'block'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: brand.textTitle, lineHeight: 1.1 }}>
              M-able Discovery Engine
            </div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: 0.5,
                color: brand.textMeta,
                textTransform: 'uppercase'
              }}
            >
              Algorithm Performance Platform
            </div>
          </div>
        </Link>

        <div style={{ fontSize: 11, color: brand.textMeta, letterSpacing: 0.2 }}>
          Pentacle × AI
        </div>
      </div>
    </header>
  );
}
