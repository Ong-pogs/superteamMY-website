export interface Member {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  bio: string | null;
  avatar_url: string | null;
  twitter_url: string | null;
  skills: string[];
  achievements: Achievement[];
  badges: string[];
  is_featured: boolean;
  is_core_team: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  title: string;
  description?: string;
  date?: string;
}
