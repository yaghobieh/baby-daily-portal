import type { ReleaseItem } from './Changelog.types';

export const CHANGELOG_TITLE = 'Release Changelog';
export const CHANGELOG_SUBTITLE =
  'Track every release, feature update, performance boost, and bug fix across BabyDaily.';

export const RELEASES: ReleaseItem[] = [
  {
    version: '0.1.5',
    build: 6,
    date: 'November 2026',
    badge: 'Latest Release',
    tag: 'Production / Closed Testing',
    isLatest: true,
    highlights: [
      'Interactive Today Timeline with swipe-to-delete and swipe-to-pin gestures.',
      'Native Android AlarmClock channel: meal & sleep alerts fire even when silenced or killed.',
      '3-Way reminder delivery selector: Notification, Native Clock Alarm, or Both.',
      'Replaced country flag icons with clean native language names (English, Hebrew, Russian, Spanish).',
      'Fluid sliding pill indicator for the bottom navigation bar.',
      'Settings simplification: deprecated SMS and WhatsApp links removed for focus.',
    ],
    categories: [
      {
        category: 'New Features',
        items: [
          'Timeline swipe right: instantly triggers soft-delete with smooth dismiss animation and total recalc.',
          'Timeline swipe left: pins important events with visible amber pin icon.',
          'Native AlarmClock intent channel: schedules system alarms directly into Android Clock app.',
          'Sliding pill navigation: animated background pill glides between active tabs.',
        ],
      },
      {
        category: 'UI & Localization',
        items: [
          'Language settings updated to show English, Hebrew (עברית), Russian (Русский), and Spanish (Español) without country flags.',
          'RTL auto-directionality for Hebrew and bidirectional typography fixes.',
          'Soft pastel Material 3 card styling with generous 20px radii.',
        ],
      },
      {
        category: 'Bug Fixes & Maintenance',
        items: [
          'Fixed blank white screen on cold launch caused by race condition in locale loader.',
          'Fixed Android Google Auth credentials callback issue.',
          'Cleaned up unused SMS and WhatsApp buttons in caregiver settings.',
        ],
      },
    ],
  },
  {
    version: '0.1.4',
    build: 5,
    date: 'November 2026',
    badge: 'Closed Testing',
    tag: 'Google Play Track',
    highlights: [
      'Google Play store listing compliance: financial and privacy declarations completed.',
      'Caregiver email invitation fanout with real-time in-app alerts.',
      'Initial native alarm integration for critical feeding schedules.',
    ],
    categories: [
      {
        category: 'Compliance & Distribution',
        items: [
          'Target SDK 34 compliance with updated AndroidManifest permissions.',
          'Google Play declarations: Financial Features declaration, User Data Safety audit.',
          'Internal & Closed testing rollout tracks configured on Google Play Console.',
        ],
      },
      {
        category: 'Caregiver Collaboration',
        items: [
          'Normalized phone number matching (last 9 digits) for international invite resolution.',
          'Direct email invitations dispatching in-app alerts upon recipient login.',
        ],
      },
    ],
  },
  {
    version: '0.1.0',
    build: 1,
    date: 'November 2026',
    badge: 'Initial Release',
    tag: 'MVP Launch',
    highlights: [
      'Flutter multi-platform client (iOS, Android, Web) with Fastify + Neon PostgreSQL backend.',
      'Complete routine modules: Nursing, Bottle Feeding, Sleep Ticker, Diaper changes, and Growth logs.',
      'Exportable pediatric summary reports.',
    ],
    categories: [
      {
        category: 'Core Modules',
        items: [
          'Nursing timer with left/right breast stopwatches.',
          'Bottle feeding with milliliter and fluid ounce volume logging.',
          'Live sleep ticker with instant wake-up family notifications.',
          'Growth charts tracking WHO percentiles for weight, height, and head circumference.',
        ],
      },
      {
        category: 'Backend & Infrastructure',
        items: [
          'Fastify REST API deployed on cloud infrastructure.',
          'Neon Serverless PostgreSQL with Prisma ORM connection pooling.',
          '60-day stateless JWT authentication.',
        ],
      },
    ],
  },
];
