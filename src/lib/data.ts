import opportunitiesData from '@/data/opportunities.json';
import servicesData from '@/data/services.json';
import categoriesData from '@/data/categories.json';
import accountsData from '@/data/accounts.json';
import nowTop5Data from '@/data/now-top5.json';
import metadataData from '@/data/metadata.json';
import type {
  Account,
  Category,
  MomentAxis,
  NowTop5,
  Opportunity,
  Service
} from '@/types';

export const opportunities = opportunitiesData.opportunities as Opportunity[];
export const services = servicesData.services as Service[];
export const categories = categoriesData.categories as Category[];
export const accounts = accountsData.accounts as Account[];
export const nowTop5 = nowTop5Data as NowTop5;
export const metadata = metadataData;

export function getOpportunity(id: string): Opportunity | undefined {
  return opportunities.find((o) => o.id === id);
}

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getAccount(id: string | null): Account | undefined {
  if (!id) return undefined;
  return accounts.find((a) => a.id === id);
}

export function opportunitiesByService(serviceId: string): Opportunity[] {
  return opportunities.filter((o) => o.services.some((s) => s.id === serviceId));
}

export const MOMENT_AXIS: Record<string, MomentAxis> = {
  'O-A04': '위기·심리',
  'O-A05': '위기·심리',
  'O-A06': '위기·심리',
  'O-ACC11': '위기·심리',
  'O-B12': '위기·심리',
  'O-A02': '라이프진입',
  'O-A03': '라이프진입',
  'O-A08': '라이프진입',
  'O-C01': '라이프진입',
  'O-C08': '라이프진입',
  'O-C11': '라이프진입',
  'O-ACC06': '경계'
};

export function momentAxis(id: string): MomentAxis {
  return MOMENT_AXIS[id] ?? '경계';
}

export const MOMENT_AXIS_META: Record<
  MomentAxis,
  { color: string; icon: string; description: string }
> = {
  '위기·심리': {
    color: '#DC2626',
    icon: '🚨',
    description: '급락·패닉·공포·혼란 — 지금 구조 요청이 폭발하는 상황'
  },
  '라이프진입': {
    color: '#10B981',
    icon: '🌱',
    description: '일상 경험·생애 이벤트가 투자로 번지는 피터 린치식 진입로'
  },
  '경계': {
    color: '#F59E0B',
    icon: '⚡',
    description: '서비스/계좌 KPI와 순간적으로 겹치는 경계 영역'
  }
};

export const OPPORTUNITY_IDS = opportunities.map((o) => o.id);
