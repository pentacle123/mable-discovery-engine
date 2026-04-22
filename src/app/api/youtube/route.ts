import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// ─────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────

const NEWS_KEYWORDS = [
  'NEWS',
  '뉴스',
  '방송국',
  'MBC',
  'KBS',
  'SBS',
  'JTBC',
  'YTN',
  '연합뉴스',
  '채널A',
  'TV조선',
  'KNN',
  'tbs뉴스',
  'broadcaster',
  '보도',
  'PRESS',
  'Arirang News',
  'News24'
];

const SUBS_MIN = 500;
const SUBS_MAX = 3_000_000;
const MIN_VIDEO_COUNT = 10;
const DEFAULT_PUBLISHED_DAYS = 90;
const MAX_RESULTS_RETURN = 5;

type Tier = 'MACRO' | 'MICRO' | 'NANO';

// Static collab-strategy map: tier × contentType → one-liner (Korean)
const STRATEGY: Record<Tier, Record<string, string>> = {
  MACRO: {
    A: '대규모 구독자 신뢰도로 풀영상 후기 제작',
    B: '권위 있는 비교 콘텐츠로 브랜드 공식 파트너',
    C: '공신력 있는 가격·제도 해설 롱폼',
    D: 'AI 일정 가이드 시리즈 브랜드 앰버서더',
    E: '데이터 랭킹 콘텐츠 공식 협업',
    F: 'USP 공식 리뷰 · 메인 파트너십',
    _: '구독자 신뢰도 활용 공식 콜라보'
  },
  MICRO: {
    A: '공감대 있는 진짜 후기로 핵심 타겟 도달',
    B: '디테일한 비교 리뷰 숏폼 시리즈',
    C: '꿀팁·가성비 비교 숏폼 제작',
    D: '일정 활용 브이로그 단편 시리즈',
    E: '니치 랭킹 영상 콜라보',
    F: '솔직 사용 후기로 체감 콘텐츠',
    _: '타겟 세그먼트 정밀 도달 콜라보'
  },
  NANO: {
    A: '깊은 팬덤에 시리즈형 후기 제작',
    B: '니치 커뮤니티 정보 비교 콘텐츠',
    C: '특정 세그먼트 꿀팁 채널 파트너',
    D: 'AI·일정 툴 팬덤 리뷰 장기',
    E: '마니아 대상 데이터 랭킹 시리즈',
    F: 'USP 체험 시리즈 장기 파트너',
    _: '니치 팬덤 심층 공략 콜라보'
  }
};

// ─────────────────────────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'YOUTUBE_API_KEY not configured in environment' },
      { status: 500 }
    );
  }

  const url = new URL(req.url);
  const type = url.searchParams.get('type') || 'search';

  try {
    if (type === 'search') return await handleSearch(url, apiKey);
    if (type === 'channelStats') return await handleChannelStats(url, apiKey);
    return NextResponse.json(
      { error: `Unknown type '${type}'. Use 'search' or 'channelStats'.` },
      { status: 400 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────
// Mode: search + enrich + filter
// ─────────────────────────────────────────────────────────────────

async function handleSearch(url: URL, apiKey: string): Promise<NextResponse> {
  const q = (url.searchParams.get('q') || '').trim();
  if (!q) {
    return NextResponse.json({ error: "query param 'q' is required" }, { status: 400 });
  }
  const maxResults = clamp(Number(url.searchParams.get('maxResults')) || 8, 1, 15);
  const contentType = (url.searchParams.get('contentType') || '').toUpperCase();
  const publishedAfter =
    url.searchParams.get('publishedAfter') || daysAgoISO(DEFAULT_PUBLISHED_DAYS);

  // 1) Video search
  const searchParams = new URLSearchParams({
    part: 'snippet',
    q,
    type: 'video',
    maxResults: String(maxResults),
    videoDuration: 'short',
    publishedAfter,
    order: 'relevance',
    regionCode: 'KR',
    relevanceLanguage: 'ko',
    key: apiKey
  });
  const videoCategoryId = url.searchParams.get('videoCategoryId');
  if (videoCategoryId) searchParams.set('videoCategoryId', videoCategoryId);

  const searchRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?${searchParams.toString()}`,
    { cache: 'no-store' }
  );
  if (!searchRes.ok) return await mapYouTubeError(searchRes);

  const searchData = (await searchRes.json()) as {
    items?: Array<{
      id: { videoId: string };
      snippet: {
        channelId: string;
        title: string;
        publishedAt: string;
        thumbnails?: Record<string, { url: string }>;
      };
    }>;
  };
  const videos = searchData.items || [];
  if (videos.length === 0) {
    return NextResponse.json({
      creators: [],
      note: `'${q}'에 맞는 크리에이터가 없습니다. 다른 아이디어를 시도해주세요.`,
      query: q
    });
  }

  // 2) Channel stats lookup
  const channelIds = Array.from(new Set(videos.map((v) => v.snippet.channelId)));
  const chParams = new URLSearchParams({
    part: 'snippet,statistics',
    id: channelIds.join(','),
    key: apiKey
  });
  const chRes = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?${chParams.toString()}`,
    { cache: 'no-store' }
  );
  if (!chRes.ok) return await mapYouTubeError(chRes);

  const chData = (await chRes.json()) as {
    items?: Array<{
      id: string;
      snippet: {
        title: string;
        description: string;
        thumbnails?: Record<string, { url: string }>;
        publishedAt?: string;
      };
      statistics: {
        subscriberCount?: string;
        videoCount?: string;
        hiddenSubscriberCount?: boolean;
      };
    }>;
  };
  const channelMap = new Map(chData.items?.map((c) => [c.id, c]) || []);

  // 3) Filter + tier + strategy
  const seen = new Set<string>();
  const creators: CreatorMatch[] = [];

  for (const v of videos) {
    const cid = v.snippet.channelId;
    if (seen.has(cid)) continue;
    const ch = channelMap.get(cid);
    if (!ch) continue;

    const subs = Number(ch.statistics.subscriberCount || '0');
    const vidCount = Number(ch.statistics.videoCount || '0');
    const title = ch.snippet.title || '';
    const desc = ch.snippet.description || '';

    if (looksLikeNews(title, desc)) continue;
    if (ch.statistics.hiddenSubscriberCount) continue;
    if (subs > SUBS_MAX || subs < SUBS_MIN) continue;
    if (vidCount < MIN_VIDEO_COUNT) continue;

    seen.add(cid);
    const tier = tierOf(subs);
    creators.push({
      channelId: cid,
      channelTitle: title,
      channelThumbnail: ch.snippet.thumbnails?.default?.url || '',
      subscriberCount: subs,
      tier,
      videoCount: vidCount,
      recentVideo: {
        videoId: v.id.videoId,
        title: v.snippet.title,
        publishedAt: v.snippet.publishedAt,
        thumbnail:
          v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url || '',
        url: `https://www.youtube.com/watch?v=${v.id.videoId}`
      },
      channelUrl: `https://www.youtube.com/channel/${cid}`,
      collabStrategy: strategyFor(tier, contentType)
    });

    if (creators.length >= MAX_RESULTS_RETURN) break;
  }

  if (creators.length === 0) {
    return NextResponse.json({
      creators: [],
      note: `'${q}' 필터링 후 매칭되는 개인 크리에이터가 없었습니다 (뉴스·대형 채널 제외 기준).`,
      query: q
    });
  }

  return NextResponse.json({ creators, query: q });
}

// ─────────────────────────────────────────────────────────────────
// Mode: channelStats (raw passthrough)
// ─────────────────────────────────────────────────────────────────

async function handleChannelStats(url: URL, apiKey: string): Promise<NextResponse> {
  const channelId = url.searchParams.get('channelId');
  if (!channelId) {
    return NextResponse.json({ error: "query param 'channelId' is required" }, { status: 400 });
  }
  const params = new URLSearchParams({
    part: 'snippet,statistics',
    id: channelId,
    key: apiKey
  });
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?${params.toString()}`,
    { cache: 'no-store' }
  );
  if (!res.ok) return await mapYouTubeError(res);
  const data = await res.json();
  return NextResponse.json(data);
}

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

interface CreatorMatch {
  channelId: string;
  channelTitle: string;
  channelThumbnail: string;
  subscriberCount: number;
  tier: Tier;
  videoCount: number;
  recentVideo: {
    videoId: string;
    title: string;
    publishedAt: string;
    thumbnail: string;
    url: string;
  };
  channelUrl: string;
  collabStrategy: string;
}

function tierOf(subs: number): Tier {
  if (subs >= 500_000) return 'MACRO';
  if (subs >= 10_000) return 'MICRO';
  return 'NANO';
}

function looksLikeNews(title: string, description: string): boolean {
  const haystack = `${title} ${description}`.toLowerCase();
  return NEWS_KEYWORDS.some((k) => haystack.includes(k.toLowerCase()));
}

function strategyFor(tier: Tier, contentType: string): string {
  const map = STRATEGY[tier];
  return map[contentType] || map._;
}

function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function daysAgoISO(days: number): string {
  return new Date(Date.now() - days * 86400 * 1000).toISOString();
}

async function mapYouTubeError(res: Response): Promise<NextResponse> {
  let body: { error?: { message?: string; errors?: Array<{ reason?: string }> } } | null = null;
  try {
    body = await res.json();
  } catch {
    /* non-json error */
  }
  const reason = body?.error?.errors?.[0]?.reason;
  if (reason === 'quotaExceeded' || (res.status === 403 && reason === 'dailyLimitExceeded')) {
    return NextResponse.json(
      {
        error:
          '일일 할당량을 초과했습니다. 내일 다시 시도하거나 Google Cloud에서 유료 전환이 필요합니다.'
      },
      { status: 403 }
    );
  }
  return NextResponse.json(
    { error: body?.error?.message || `YouTube API 오류 (${res.status})` },
    { status: res.status }
  );
}
