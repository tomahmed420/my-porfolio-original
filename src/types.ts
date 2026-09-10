export interface SiteIdentity {
  logoText: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface HeroData {
  name: string;
  headline: string;
  subHeadline: string;
  image: string;
  isAvailable: boolean;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
  results: string;
  problem: string;
  strategy: string;
  description: string;
  caseStudyLink: string;
  status: 'draft' | 'published';
  displayOrder: number;
}

export interface Skill {
  id: number;
  name: string;
  level: number;
  displayOrder: number;
}

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  category: string;
  image: string;
  content: string;
  status: 'draft' | 'published';
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  image: string;
  video: string;
  result: string;
  content: string;
  displayOrder: number;
}

export interface ContactLead {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

export interface HistoryItem {
  id: number;
  action: string;
  details: string;
  timestamp: string;
}

export interface AppData {
  identity: SiteIdentity;
  hero: HeroData;
  portfolio: PortfolioItem[];
  skills: Skill[];
  blog: BlogPost[];
  testimonials: Testimonial[];
  leads: ContactLead[];
  history: HistoryItem[];
}
