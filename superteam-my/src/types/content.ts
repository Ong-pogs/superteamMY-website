export interface SiteContent {
  id: string;
  section: string;
  content: Record<string, unknown>;
  updated_at: string;
  updated_by: string | null;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  cta_primary: string;
  cta_secondary: string;
}

export interface StatsContent {
  members: number;
  events: number;
  projects: number;
  bounties: number;
  reach: string;
}

export interface FAQItem {
  q: string;
  a: string;
  category?: string;
}
