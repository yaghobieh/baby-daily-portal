export const HERO_TITLE = 'Parenting Made Simple, Calm & Beautiful';
export const HERO_SUBTITLE = 'The all-in-one daily routine tracker for your baby. Seamlessly log feeding, sleep, diaper changes, and medications with instant family sync and real phone clock alarms.';

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: 'feed' | 'sleep' | 'diaper' | 'alarm' | 'sharing' | 'shield';
  accentColor: string;
  badge: string;
}

export const FEATURES_LIST: FeatureItem[] = [
  {
    id: 'feat-feed',
    title: 'Breast, Bottle & Solids',
    description: 'Left and right nursing stopwatch timers, precise bottle volumes in ml/oz, and solid meal logs with reaction notes.',
    iconName: 'feed',
    accentColor: '#FF7A7A',
    badge: 'Feeding',
  },
  {
    id: 'feat-sleep',
    title: 'Live Sleep Ticker & Wake-Up',
    description: 'One-tap sleep tracking with prominent live duration ticker and quick wake-up notifications to family members.',
    iconName: 'sleep',
    accentColor: '#8C7AE6',
    badge: 'Sleep',
  },
  {
    id: 'feat-alarm',
    title: 'Phone Clock Alarms for Meals',
    description: 'Real Android phone clock alarms and smart reminder countdowns for upcoming feeds and medications.',
    iconName: 'alarm',
    accentColor: '#FFAA00',
    badge: 'Smart Reminders',
  },
  {
    id: 'feat-diaper',
    title: 'Diaper & Wellness Log',
    description: 'Track wet, dirty, and mixed diapers. Log temperatures, medication doses, vitamin D, and growth milestones.',
    iconName: 'diaper',
    accentColor: '#48C78E',
    badge: 'Care',
  },
  {
    id: 'feat-sharing',
    title: 'Multi-Caregiver Family Sync',
    description: 'Invite parents, grandparents, and nannies by email. Real-time updates so everyone stays in sync with zero friction.',
    iconName: 'sharing',
    accentColor: '#3897F0',
    badge: 'Care Team',
  },
  {
    id: 'feat-shield',
    title: 'Private & Secure',
    description: 'Encrypted in transit, no advertising trackers, and easy swipe-to-delete for full control over your private baby data.',
    iconName: 'shield',
    accentColor: '#FF7A7A',
    badge: 'Privacy',
  },
];

export const STATS_LIST = [
  { value: '4 Languages', label: 'English, עברית, Español, Русский' },
  { value: '100% Free', label: 'Zero ads, pure parenting focus' },
  { value: '< 2 Seconds', label: 'Fast quick-log actions' },
  { value: 'Instant Sync', label: 'Multi-parent real-time updates' },
];
