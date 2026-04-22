'use client';

import type { AIIdea } from '@/types';

const KEY = (oppId: string) => `mde:ideas:${oppId}`;

export function saveIdeas(oppId: string, ideas: AIIdea[]): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(KEY(oppId), JSON.stringify(ideas));
  } catch {
    /* quota / private-mode */
  }
}

export function loadIdeas(oppId: string): AIIdea[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(KEY(oppId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearIdeas(oppId: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(KEY(oppId));
  } catch {
    /* ignore */
  }
}
