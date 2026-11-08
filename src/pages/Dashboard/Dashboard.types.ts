export interface PortalUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  locale: string;
  isPremium: boolean;
  subscriptionPlan: 'FREE' | 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  subscriptionSince: string | null;
  aiQueriesToday: number;
  aiDailyLimit: number;
  dailySummaryEmail: boolean;
}

export interface PortalBaby {
  id: string;
  name: string;
  birthDate: string | null;
  gender: string | null;
  role: 'OWNER' | 'CAREGIVER' | 'VIEWER';
}

export interface PortalEntry {
  id: string;
  babyId: string;
  type: 'FEED' | 'SLEEP' | 'DIAPER' | 'MEDICINE' | 'GROWTH' | 'NOTE';
  startedAt: string;
  endedAt: string | null;
  data: Record<string, unknown>;
}

export interface PortalSummary {
  feedsCount: number;
  bottleMl: number;
  breastMinutes: number;
  sleepMinutes: number;
  napsCount: number;
  diapersWet: number;
  diapersDirty: number;
  diapersTotal: number;
  activeSleep: PortalEntry | null;
  lastFeed: PortalEntry | null;
  lastSleep: PortalEntry | null;
  lastDiaper: PortalEntry | null;
}

export interface AiSuggestion {
  id: string;
  type: 'SLEEP' | 'FEED' | 'DIAPER' | 'SUMMARY';
  priority: 'HIGH' | 'NORMAL' | 'INFO';
  icon: string;
  title: string;
  body: string;
}

export interface AiInsightsResponse {
  babyName: string;
  ageText: string;
  isSleeping: boolean;
  awakeMinutes: number | null;
  minutesSinceLastFeed: number | null;
  recommendedWakeWindow: { min: number; max: number };
  suggestions: AiSuggestion[];
  quota: {
    isPremium: boolean;
    subscriptionPlan: string;
    aiQueriesToday: number;
    aiDailyLimit: number;
  };
}

export interface DailyStatBucket {
  date: string;
  feedsCount: number;
  bottleMl: number;
  breastMinutes: number;
  sleepMinutes: number;
  sleepHours: number;
  napsCount: number;
  diapersWet: number;
  diapersDirty: number;
  diapersTotal: number;
}

export interface BabyStatsResponse {
  days: number;
  daily: DailyStatBucket[];
  averages: {
    avgFeedsPerDay: number;
    avgBottleMlPerDay: number;
    avgSleepHoursPerDay: number;
    avgDiapersPerDay: number;
    longestSleepMinutes: number;
  };
}

export interface PricingPlanItem {
  id: 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  title: string;
  price: string;
  period: string;
  badge: string;
  description: string;
}

