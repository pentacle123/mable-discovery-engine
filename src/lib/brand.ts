import type { CSSProperties } from 'react';

export const brand = {
  // Surfaces
  bg: '#F5F7FA',
  surface: '#FFFFFF',
  heroBg: '#E6F1FB',
  // Text
  textTitle: '#1E293B',
  textBody: '#64748B',
  textMeta: '#94A3B8',
  // KB Brand
  kbNavy: '#1D1D1B',
  kbYellow: '#FFD700',
  kbGold: '#F59E0B',
  // Accents (legacy primary blue still used for some UI)
  primary: '#0C447C',
  primaryDeep: '#042C53',
  trendRed: '#A32D2D',
  // Borders
  border: 'rgba(0, 0, 0, 0.08)',
  borderSoft: 'rgba(0, 0, 0, 0.05)',
  // Legacy aliases
  text: '#1E293B',
  textMuted: '#64748B',
  accent: '#FFD700',
  navy: '#1D1D1B'
};

// Section dividers
export const SECTION_COLOR = {
  now: '#DC2626', // 2026 NOW
  services: '#1E40AF', // Services
  moments: '#10B981' // Moments
} as const;

// Individual service colors (Services subsection)
export const SERVICE_COLOR: Record<string, string> = {
  'mybrief': '#8B5CF6',
  'ai-briefing': '#0770E3',
  'today-kok': '#F59E0B',
  'prime-club': '#DC2626',
  'ipo-tracker': '#10B981'
};

// Moments axis colors (2 axes only — 경계 removed)
export const MOMENT_AXIS_COLOR: Record<string, string> = {
  '위기·심리': '#DC2626',
  '라이프진입': '#8B5CF6'
};

export const MOMENT_AXIS_ICON: Record<string, string> = {
  '위기·심리': '🔥',
  '라이프진입': '💼'
};

export const MOMENT_AXIS_LABEL: Record<string, string> = {
  '위기·심리': '위기·심리 대응',
  '라이프진입': '라이프 전환 진입'
};

// Category colors (used on analysis detail page header)
export const categoryColors: Record<string, { base: string; light: string }> = {
  A: { base: '#0C447C', light: '#E6F1FB' },
  B: { base: '#B8860B', light: '#FDF6E3' },
  C: { base: '#0F766E', light: '#E6F6F3' },
  D: { base: '#A32D2D', light: '#FCEBEB' }
};

export const priorityColors: Record<string, string> = {
  critical: '#A32D2D',
  high: '#B8860B',
  medium: '#0C447C',
  low: '#94A3B8'
};

export const displayModeBadge: Record<'service' | 'moment', { bg: string; fg: string; label: string }> = {
  service: { bg: '#EEEDFE', fg: '#3C3489', label: 'Service' },
  moment: { bg: '#FCEBEB', fg: '#791F1F', label: 'Moment' }
};

export const shadow = {
  sm: '0 1px 2px rgba(15, 23, 42, 0.03)',
  md: '0 2px 6px rgba(15, 23, 42, 0.05)',
  lg: '0 4px 12px rgba(15, 23, 42, 0.06)',
  xl: '0 8px 24px rgba(15, 23, 42, 0.08)'
};

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 20
};

export const container: CSSProperties = {
  maxWidth: 1200,
  margin: '0 auto',
  padding: '0 24px'
};

export const card: CSSProperties = {
  background: brand.surface,
  border: `0.5px solid ${brand.border}`,
  borderRadius: radius.lg
};

export function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return '–';
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export function formatTrend(percent: number | null | undefined): string {
  if (percent === null || percent === undefined) return '–';
  return `${percent > 0 ? '+' : ''}${percent.toLocaleString()}%`;
}

export function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

// Translucent helpers for section color → soft bg / border
export const toSoft = (hex: string) => `${hex}15`;
export const toBorder = (hex: string) => `${hex}30`;
