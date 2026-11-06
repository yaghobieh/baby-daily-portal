export interface ReleaseCategory {
  category: string;
  items: string[];
}

export interface ReleaseItem {
  version: string;
  build: number;
  date: string;
  badge: string;
  tag: string;
  isLatest?: boolean;
  highlights: string[];
  categories: ReleaseCategory[];
}
