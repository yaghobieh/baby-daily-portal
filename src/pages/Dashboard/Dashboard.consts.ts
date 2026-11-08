import type { PricingPlanItem } from './Dashboard.types';

export const PRICING_PLANS: PricingPlanItem[] = [
  {
    id: 'MONTHLY',
    title: 'Monthly Care',
    price: '$4.99',
    period: '/ month',
    badge: 'Flexible',
    description: 'Unlimited AI assistant, live nap sweet-spot insights, daily email summaries & 7-day trends.',
  },
  {
    id: 'YEARLY',
    title: 'Annual Family Plan',
    price: '$39.99',
    period: '/ year ($3.33/mo)',
    badge: 'Most Popular • Save 33%',
    description: 'Includes 7-day free trial, full family sharing, unlimited AI Q&A, and pediatric export reports.',
  },
  {
    id: 'LIFETIME',
    title: 'Lifetime Family Pass',
    price: '$69.99',
    period: 'one-time payment',
    badge: 'Best Value',
    description: 'Pay once for all your children and caregivers forever. Every future AI & analytics feature included.',
  },
];

export const QUICK_BOTTLE_AMOUNTS = [90, 120, 150];

export const ENTRY_TYPE_LABELS: Record<string, string> = {
  FEED: '🍼 Feeding',
  SLEEP: '😴 Sleep',
  DIAPER: '🧷 Diaper',
  MEDICINE: '💊 Medicine',
  GROWTH: '📏 Growth',
  NOTE: '📝 Note',
};

