import type { DocSection } from './Docs.types';

export const DOCS_TITLE = 'BabyDaily User Guide & Documentation';
export const DOCS_SUBTITLE =
  'Comprehensive reference for all routine tracking modules, phone clock alarms, family synchronization, and pediatric reports.';

export const DOCS_SECTIONS: DocSection[] = [
  {
    id: 'overview',
    badge: 'Overview',
    title: 'Design Philosophy & Architecture',
    summary:
      'BabyDaily is engineered for one-handed 3:00 AM usability, zero stress, soft pastel aesthetics, and strict ad-free privacy.',
    details: [
      'Built with Flutter client (iOS, Android, Web) and Node.js Fastify + Neon Serverless PostgreSQL backend.',
      'Stateless 60-day JWT authentication with fault-tolerant offline local caching.',
      'All timestamps stored in UTC and rendered in your device local timezone.',
    ],
  },
  {
    id: 'feeding',
    badge: 'Module 1',
    title: 'Feeding Tracker (Breast, Bottle & Solids)',
    summary:
      'Log every type of meal in under 2 seconds with dual nursing timers, volume presets, and solid food reaction notes.',
    details: [
      'Nursing stopwatch: Track left and right breast duration with quick pause and switch.',
      'Bottle feeding: Record formula or expressed milk volume in milliliters or fluid ounces.',
      'Solid foods: Note first tastes, allergens, portion sizes, and baby reactions for pediatric reviews.',
    ],
  },
  {
    id: 'sleep',
    badge: 'Module 2',
    title: 'Sleep Tracker & Live Ticker',
    summary:
      'Keep track of daytime naps and nighttime sleep with an active timer and instant wake-up family notifications.',
    details: [
      'One-tap sleep start: Prominent live duration ticker on the home screen.',
      'Wake-up alert: Instantly notifies connected family members with sleep duration (e.g., "Liam woke up: slept 1h 45m").',
      'Daily sleep totals: Summarizes total naps, night sleep, and awake windows.',
    ],
  },
  {
    id: 'diaper',
    badge: 'Module 3',
    title: 'Diaper & Wellness Monitoring',
    summary:
      'Monitor hydration, digestion, medications, and pediatric growth milestones effortlessly.',
    details: [
      'Diaper changes: Log wet, dirty, or mixed diapers with optional stool texture and color notes.',
      'Medications: Schedule reminders for Vitamin D drops, antibiotics, and fever reducers.',
      'Growth charts: Record weight, height, and head circumference percentiles.',
    ],
  },
  {
    id: 'reminders',
    badge: 'Module 4',
    title: 'Phone Clock Alarms & Smart Reminders',
    summary:
      'Real Android clock alarms and notifications scheduled after the last event or daily at fixed times.',
    details: [
      '3-Way Delivery Channel: Choose between Notification, Phone Clock Alarm, or Both.',
      'After-Last Reminders: Automatically reschedules N hours after the most recent entry of that type.',
      'Native Phone Alarms: Fires through Android’s native AlarmClock even if the app is killed or phone is on silent.',
      'Quiet Hours: Respects per-member quiet windows so night sleep is never disturbed.',
    ],
  },
  {
    id: 'sharing',
    badge: 'Module 5',
    title: 'Multi-Caregiver Family Sync & RBAC',
    summary:
      'Coordinate care between parents, grandparents, and babysitters with granular permissions and email invitations.',
    details: [
      'OWNER: Full administrative control to invite or remove members and manage baby profiles.',
      'CAREGIVER: Permission to log, edit, and delete daily entries with instant live sync.',
      'VIEWER: Read-only access for extended family members to view the timeline and daily summary.',
      'Normalized contact matching: Invitations match by email or phone key seamlessly.',
    ],
  },
  {
    id: 'timeline',
    badge: 'Module 6',
    title: 'Today’s Timeline & Quick Actions',
    summary:
      'Interactive daily activity feed with swipe-to-delete, swipe-to-pin, and export capabilities.',
    details: [
      'Swipe right to delete: Permanently removes an entry with instant visual feedback and silent summary updates.',
      'Swipe left to pin: Keeps critical entries pinned at the top of the timeline with a pin badge.',
      'Export reports: Download your baby’s full log history as Excel CSV, printable Pediatric PDF, or Word DOC.',
    ],
  },
];

