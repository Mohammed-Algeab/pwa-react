// types/index.ts
// ponytail: منقول حرفياً من team-apk/types/index.ts — البنية تطابق جداول
// Supabase الفعلية، وهي مشتركة بين كل واجهات فريق ألفا (web, admin, هنا).

export interface Settings {
  site_name: string;
  tagline: string;
  telegram_channel: string;
  telegram_group: string;
  email: string | null;
  site_description: string;
  keywords: string;
}

export interface Comparison {
  id: string;
  before_image: string;
  after_image: string;
  caption: string;
}

export interface TimelineItem {
  date: string;
  version: string;
  notes: string;
}

export interface Project {
  id: string;
  name: string;
  title: string;
  type: 'تعريب' | 'أداة' | 'لعبة';
  status: 'active' | 'completed' | 'upcoming' | 'paused';
  cover: string;
  description: string;
  struggle_story: string | null;
  latest_version: string;
  download_link: string | null;
  progress: number;
  featured: boolean;
  display_order: number;
  images: string[] | null;
  comparisons: Comparison[] | null;
  timeline: TimelineItem[] | null;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  project_id: string | null;
  category_id: string | null;
  created_at: string;
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  display_order: number;
}

export interface Download {
  id: string;
  title: string;
  project_id: string;
  changelog_id: string;
  link: string;
  filename: string | null;
  notes: string | null;
  type: string;
  status: string;
  created_at: string;
  changelog?: { version: string; date: string };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  joined_date: string;
}

export interface Independent {
  id: string;
  name: string;
  type: string;
  description: string;
  cover: string | null;
  link: string;
  status: string;
  date: string;
}

export interface GlossaryItem {
  id: string;
  term_original: string;
  term_arabic: string;
  reason: string | null;
  project_id: string | null;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface CreditItem {
  id: string;
  name: string;
  role: string;
  project_id: string | null;
}

export interface ChangelogItem {
  id: string;
  project_id: string;
  version: string;
  date: string;
  changes: string[];
}

export type SiteFeatures = Record<string, boolean>;
