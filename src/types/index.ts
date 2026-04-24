export type CategoryId = 'A' | 'B' | 'C' | 'D';
export type ServiceRole = 'primary' | 'secondary';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Competition = 'LOW' | 'MEDIUM' | 'HIGH';
export type ReviewLevel = 'low' | 'medium' | 'high';
export type DisplayMode = 'service' | 'moment';
export type MomentAxis = '위기·심리' | '라이프진입';

export interface ServiceRef {
  id: string;
  role: ServiceRole;
  reason: string;
}

export interface RelatedKeyword {
  keyword: string;
  volume: number;
}

export interface OpportunityAnalysis {
  interests: string[];
  cluster_path: string[];
  metrics: {
    annual_volume: number | null;
    trend_percent: number | null;
    trend_label: string;
    competition: Competition;
    related_volume?: Record<string, number>;
  };
  demography: {
    gender: string;
    age: string;
  };
  why_now: string;
  review_level: ReviewLevel;
  review_notes: string;

  monthly_volume: number[];
  who_tags: string[];
  who_evidence: string;
  when_tags: string[];
  when_evidence: string;
  journey_tags: string[];
  journey_evidence: string;
  pain_tags: string[];
  pain_evidence: string;
  usp_fit_tags: string[];
  usp_fit_evidence: string;
  hook_tags: string[];
  hook_evidence: string;
  pathfinder_narrative: string;
  cluster_insight: string;
  related_keywords: RelatedKeyword[];
}

export interface Opportunity {
  id: string;
  category_id: CategoryId;
  subgroup: string;
  title: string;
  subtitle: string;
  status: 'confirmed' | 'tentative';
  priority: Priority;
  now_rank: number | null;
  display_mode: DisplayMode;
  analysis: OpportunityAnalysis;
  services: ServiceRef[];
  account_kpi: {
    primary: string | null;
    secondary: string[];
    note: string;
  };
  hook_hypothesis: string;
  ai_ideas_seed: {
    target: string;
    tone: string;
    format_hint: string;
  };
  storyboard: null | unknown;
  youtubeSearchQueries?: string[];
}

export interface Service {
  id: string;
  name: string;
  name_en: string;
  icon: string;
  color: string;
  usp: string;
  description: string;
  review_risk: ReviewLevel;
  review_note: string;
  content_tone: string;
  primary_scenarios: string[];
}

export interface CategorySubgroup {
  code: string;
  label: string;
  count: number;
}

export interface Category {
  id: CategoryId;
  code: string;
  name: string;
  name_en: string;
  subtitle: string;
  color: string;
  color_light: string;
  icon: string;
  order: number;
  opportunity_count: number;
  annual_search_volume: number;
  description: string;
  subgroups: CategorySubgroup[];
  representative_opportunities: string[];
}

export interface Account {
  id: string;
  name: string;
  name_full: string;
  name_en: string;
  color: string;
  icon: string;
  annual_search_volume: number;
  trend: string;
  rank: number;
  demography: { gender: string; age_primary: string };
  kb_position: string;
  kb_position_note: string;
  strategy: string;
  key_events: string[];
  signature_note?: string;
  opportunity_count: number;
  connected_opportunities: string[];
}

export interface NowTop5Entry {
  rank: number;
  medal: string;
  opportunity_id: string;
  title: string;
  subtitle: string;
  trend_percent: number | null;
  trend_label: string;
  annual_volume: number;
  urgency: 'critical' | 'high' | 'medium';
  urgency_note: string;
  category_id: CategoryId;
  account_kpi: string | null;
  demography_highlight: string;
  hook_preview: string;
}

export interface NowTop5 {
  title: string;
  subtitle: string;
  description: string;
  updated_at: string;
  entries: NowTop5Entry[];
}

export type ContentType = 'A' | 'B' | 'C' | 'D' | 'F';

export interface StoryboardPlatform {
  title: string;
  hook: string;
  scenes: string[];
  proof: string;
  cta: string;
  hashtags: string[];
  uploadTime: string;
  targetCluster: string;
}

export interface ServiceAsset {
  name: string;
  access: string;
  path: string;
  tip: string;
}

export interface KeyMetric {
  metric: string;
  value: string;
  source: string;
  caveat: string;
}

export interface MableConnection {
  service_name: string;
  entry_path: string;
  specific_content: string;
  why_here: string;
}

export interface FactSheet {
  serviceAssets: ServiceAsset[];
  keyMetrics: KeyMetric[];
  legalChecks: string[];
  timing: string;
  // Accept legacy string (pre-migration) or structured MableConnection (new).
  mableConnection?: string | MableConnection;
}

export interface CreatorGuidelines {
  must: string[];
  avoid: string[];
}

export interface CreatorBrief {
  hookDirection: string;
  brandMoment: string;
  duration: string;
  tone: string;
  guidelines: CreatorGuidelines;
}

export interface CreatorProfile {
  idealTier: 'MACRO' | 'MICRO' | 'NANO';
  niche: string;
  subscribers: string;
  style: string;
}

export interface CreatorCollab {
  brief: CreatorBrief;
  scenes: string[];
  creatorProfile: CreatorProfile;
  rationale: string;
  hashtags: string[];
}

export interface IdeaStoryboard {
  youtubeShorts: StoryboardPlatform;
  creatorCollab?: CreatorCollab;
  // Legacy field — kept optional for sessionStorage backward compat.
  instagramReels?: StoryboardPlatform;
  factSheet: FactSheet;
}

export interface AIIdea {
  rank: number;
  title: string;
  contentType: ContentType;
  contentTypeLabel: string;
  productionBy: 'creator' | 'brand';
  stage: 'Dream' | 'Plan' | 'Book' | 'Share';
  conversionScore: number;
  hook3s: string;
  sceneFlow: string[];
  uspConnection: string;
  target: string;
  targetKeyword: string;
  targetKeywordVol: number;
  creatorStrategy: string;
  dataProof: string;
  creatorSearchQueries?: string[];
  reviewWarnings?: string[];
  storyboard?: IdeaStoryboard; // populated on-demand via /api/storyboard
}
