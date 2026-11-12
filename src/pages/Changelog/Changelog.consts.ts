import type { ReleaseItem } from './Changelog.types';

export const CHANGELOG_TITLE = 'Release Changelog & v1.2.0 Roadmap';
export const CHANGELOG_SUBTITLE =
  'Track every release, feature update, performance boost, and upcoming roadmap milestone across BabyDaily.';

export const RELEASES: ReleaseItem[] = [
  {
    version: '1.2.0',
    build: 9,
    date: 'November 2026',
    badge: 'Latest Release',
    tag: 'v1.2.0 All-In-One Suite',
    isLatest: true,
    highlights: [
      'Pumping & Breast Milk Stash Manager: Dual-side timer + Fridge/Freezer inventory with expiration alerts.',
      '100 First Foods & Top 9 Allergen Tracker (Solid Starts style) with reaction & preference badges.',
      'Tummy Time Goal Ring, Activity Stopwatch & CDC/WHO Developmental Milestones + Mental Leaps.',
      'Interactive WHO Growth Percentile Curves (3rd–97th) & Pediatrician Visit PDF Pack.',
      'Hands-Free AI Voice & Natural Language Logging ("Liam drank 150ml formula 20m ago").',
      'Built-in Soothing White Noise & Sleep Sound Machine with auto-fade timer.',
      'Lock-Screen Live Timer Notifications, Home Screen Widgets & 3 AM Red-Light Night Shift Mode.',
    ],
    categories: [
      {
        category: 'Feeding, Pumping & Solids (Inspired by Cubtale & Solid Starts)',
        items: [
          'Dual Left/Right breast pumping stopwatch and volume tracker (leftMl, rightMl, totalMl).',
          'Fridge (4-day) & Freezer (6-month) Milk Stash inventory with FIFO bottle deduction.',
          'Interactive "100 First Foods Before Age 1" checklist & Top 9 Allergen multi-exposure tracker.',
          'Food reaction severity logging (none, mild rash, hives, tummy upset) and preference tags (loved, neutral, disliked).',
        ],
      },
      {
        category: 'Sleep, Soothing & AI Automation (Inspired by Huckleberry & Robin)',
        items: [
          'Hands-free voice & natural language entry parsing powered by DeepSeek AI.',
          'Built-in background White Noise, Rain, Womb Heartbeat, and Shusher audio player.',
          'Auto-adjusting multi-nap daily schedule builder that recalculates when a nap runs short.',
          'Caregiver Shift Handoff summary card for seamless partner and nanny transitions.',
        ],
      },
      {
        category: 'Milestones, WHO Curves & Native Experience (Inspired by Nara & Glow)',
        items: [
          'Tummy Time daily goal ring + Bath, Walk, Skin-to-Skin, and Story Time stopwatches.',
          'Month-by-month CDC/WHO developmental milestone checklist & mental leap alerts with photo memories.',
          'Interactive WHO Growth Percentile curves for weight, height, and head circumference.',
          'Lock-screen ongoing timer controls, Home Screen widgets, and 3 AM red/amber night-vision mode.',
        ],
      },
    ],
  },
  {
    version: '0.1.7',
    build: 8,
    date: 'November 2026',
    badge: 'Latest Release',
    tag: 'AI & Web Dashboard Sync',
    isLatest: true,
    highlights: [
      'DeepSeek AI Pediatric Routine Advisor & Sweet-Spot Wake Window predictor.',
      'Interactive Web App & Family Dashboard with instant Neon PostgreSQL synchronization.',
      '7-Day pediatric routine averages, automated daily email digests, and Lifetime VIP tier.',
      '1-Click Gmail & Phone/Email login across Web and Mobile.',
    ],
    categories: [
      {
        category: 'AI & Smart Insights',
        items: [
          'Age-calibrated Sweet-Spot wake window calculator preventing overtired meltdowns.',
          'Embedded DeepSeek AI chat grounded in your baby’s real-time 24h feeding, sleep, and diaper logs.',
          '1-click Daily AI Routine Digest delivered via email and in-app notification.',
        ],
      },
      {
        category: 'Web App & Multi-Device Sync',
        items: [
          'Full Web Dashboard (/dashboard) with 1-tap Feeding, Sleep, Diaper, and Notes logging.',
          '7-Day trend analytics for daily feeds, sleep hours, bottle volume, and longest sleep stretch.',
          'Direct APK release distribution and Google Account / Phone number authentication.',
        ],
      },
    ],
  },
  {
    version: '0.1.5',
    build: 6,
    date: 'November 2026',
    badge: 'Stable Release',
    tag: 'Production / Closed Testing',
    isLatest: false,
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
