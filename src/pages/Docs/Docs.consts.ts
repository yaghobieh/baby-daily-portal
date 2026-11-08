import type { DocSection } from './Docs.types';

export const DOCS_TITLE = 'BabyDaily Architecture & Routine Documentation';
export const DOCS_SUBTITLE =
  'A complete technical and practical guide to our multi-platform baby tracking engine, sweet-spot sleep predictions, DeepSeek AI pediatrician assistant, phone clock alarms, and live cloud synchronization across iOS, Android, and Web.';

export const DOCS_SECTIONS: DocSection[] = [
  {
    id: 'architecture',
    badge: 'Core Engine',
    title: 'Multi-Platform Auto-Sync Architecture',
    summary:
      'BabyDaily connects parents and caregivers in real time. Any entry logged on an Android device or iPhone instantly synchronizes with the web portal and updates all caregivers via push notifications and live web sockets.',
    details: [
      'Frontend Clients: Multi-platform Flutter (iOS, Android, Web) and React 18 + Vite Web Portal with Bear UI and Synapse state management.',
      'Backend API: High-throughput Node.js Fastify v4 service hosted on Vercel Serverless with strict Zod validation.',
      'Database: Neon Serverless PostgreSQL with dual connection pooling (PgBouncer pooled connection for sub-10ms queries, direct URL for migrations).',
      'UTC Normalization: Every event timestamp is recorded in UTC with timezone offset recorded on sign-in, ensuring seamless cross-time-zone travel.',
      'Stateless 60-Day JWT: Zero-friction authentication persisted in secure hardware keystore on mobile and localStorage on web.',
    ],
    codeSnippet: {
      title: 'Neon Serverless PostgreSQL Schema Excerpt (Prisma)',
      language: 'prisma',
      code: `model Entry {
  id        String    @id @default(cuid())
  babyId    String
  userId    String
  type      EntryType // FEED, SLEEP, DIAPER, MEDICINE, GROWTH, NOTE
  startedAt DateTime  @default(now())
  endedAt   DateTime? // null indicates ongoing sleep nap
  data      Json      // bottle volume, nursing side, diaper texture, notes
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  baby      Baby      @relation(fields: [babyId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([babyId, startedAt(sort: Desc)])
}`,
    },
    metrics: [
      { label: 'Cloud Sync Latency', value: '< 200ms', desc: 'Instant fanout to all active family devices' },
      { label: 'Token Lifespan', value: '60 Days', desc: 'Stateless JWT with auto-renewal' },
      { label: 'Database Engine', value: 'PostgreSQL 16', desc: 'Neon Serverless with PgBouncer' },
    ],
  },
  {
    id: 'sweet-spot-sleep',
    badge: 'Sleep Science',
    title: 'Sweet-Spot Sleep Engine & Wake Window Science',
    summary:
      'Prevent overtired meltdowns with age-calibrated wake windows. When a baby wakes up, BabyDaily calculates the optimal nap window using pediatric age brackets, countdown timers, and live overtired warnings.',
    details: [
      'Age-Bracket Calibrations: Wake windows expand gradually as the infant circadian rhythm matures (e.g., 45-60m for newborns, 90-120m for 4-month-olds, 2.5-3.5h for 10-month-olds).',
      'Live Countdown Timer: Continuously tracks elapsed wake minutes since the last recorded sleep.endedAt.',
      'Tricolor State Indicator: OPTIMAL (in safe wake window), APPROACHING_OVERTIRED (last 15 minutes of window), and OVERTIRED (exceeded max window).',
      'Family Wake-Up Fanout: When sleep is ended, all caregivers receive an alert with total duration (e.g., "Liam woke up: slept 1h 25m").',
    ],
    codeSnippet: {
      title: 'Wake Window Matrix by Age Bracket',
      language: 'typescript',
      code: `// Age bracket wake windows (in minutes) based on pediatric sleep research:
export const WAKE_WINDOW_BRACKETS = [
  { minDays: 0,   maxDays: 30,  minMin: 45,  maxMin: 60,  naps: '4–5 naps' }, // 0–1 mo
  { minDays: 31,  maxDays: 90,  minMin: 60,  maxMin: 90,  naps: '4–5 naps' }, // 1–3 mo
  { minDays: 91,  maxDays: 180, minMin: 90,  maxMin: 120, naps: '3–4 naps' }, // 3–6 mo
  { minDays: 181, maxDays: 270, minMin: 120, maxMin: 150, naps: '3 naps'   }, // 6–9 mo
  { minDays: 271, maxDays: 365, minMin: 150, maxMin: 210, naps: '2 naps'   }, // 9–12 mo
  { minDays: 366, maxDays: 548, minMin: 180, maxMin: 270, naps: '1–2 naps' }, // 12–18 mo
  { minDays: 549, maxDays: 999, minMin: 270, maxMin: 360, naps: '1 nap'    }, // 18+ mo
];`,
    },
    metrics: [
      { label: '0–3 Months Window', value: '45–90 min', desc: 'Prevents cortisol buildup and fussiness' },
      { label: '4–6 Months Window', value: '90–120 min', desc: 'Encourages consolidated naps' },
      { label: '7–12 Months Window', value: '2–3.5 hours', desc: 'Predictable 2-nap daily schedule' },
    ],
  },
  {
    id: 'deepseek-ai',
    badge: 'AI Intelligence',
    title: 'DeepSeek AI Pediatric Advisor & Daily Digest',
    summary:
      'BabyDaily embeds DeepSeek AI directly into your baby’s daily routine. The AI analyzes the baby’s last 25 routine events (breastfeeding times, bottle volumes, diaper changes, and sleep duration) to provide personalized, evidence-based guidance and automated daily digests.',
    details: [
      'Context-Aware Analysis: The assistant receives real data including baby age in days, awake time, milk volume in the last 24 hours, and diaper health.',
      'Daily AI Digest: Parents receive an automated end-of-day summary email and push notification synthesizing feeds, total sleep, and routine recommendations.',
      'Pediatric Guardrails: Guided by WHO and AAP guidelines with clear disclaimer that AI complements, but never replaces, professional pediatrician consultations.',
      'Free & Premium Quotas: Free tier includes 3 daily AI queries; Premium subscribers enjoy unlimited real-time chat and automated email reports.',
    ],
    codeSnippet: {
      title: 'Contextual Prompt Construction Excerpt',
      language: 'typescript',
      code: `const contextPrompt = \`
You are BabyDaily AI, an expert, warm, and reassuring pediatric assistant.
BABY CONTEXT:
- Name: \${baby.name}
- Age: \${ageDays} days old (\${ageText})
- Current Status: \${activeSleep ? 'Sleeping since ' + activeSleep.startedAt : 'Awake for ' + awakeMinutes + ' min'}
- Recommended Wake Window: \${bracket.minMin} - \${bracket.maxMin} minutes
- Past 24h Summary: \${stats.totalFeeds} feeds (\${stats.bottleMl}ml), \${stats.sleepHours}h total sleep, \${stats.diapers} diapers.
RECENT LOGS (Last 25 entries):
\${recentEntries.map(e => \`- [\${e.type}] \${e.startedAt}: \${JSON.stringify(e.data)}\`).join('\\n')}

Provide empathetic, concise, and scientifically grounded pediatric insights.
\`;`,
    },
    metrics: [
      { label: 'Context Horizon', value: 'Last 25 Events', desc: 'Full feed, sleep, and diaper timeline' },
      { label: 'Response Time', value: '~1.2s', desc: 'Streaming DeepSeek generative completion' },
      { label: 'Automated Digest', value: 'Daily 20:00', desc: 'Email + Push notifications to caregivers' },
    ],
  },
  {
    id: 'phone-clock-alarms',
    badge: 'Smart Alarms',
    title: 'Native Android Clock Alarms & Smart Reminders',
    summary:
      'Unlike standard baby apps whose background notifications get silently killed by Android battery optimization, BabyDaily integrates directly with Android’s native AlarmClock intent to ring reliable, wake-up alarms.',
    details: [
      '3-Way Delivery Channel: Choose between standard Notification, Native Phone Clock Alarm, or Both.',
      'After-Last Triggers: Automatically sets an alarm for N hours after the most recent event of that type (e.g., 3 hours after the last bottle feed).',
      'Daily-At Triggers: Fixed daily alarms for routine events such as morning Vitamin D drops or bedtime baths.',
      'Deep Hardware Integration: Fires through Android’s native AlarmClock provider even if the app process is terminated or battery saver is active.',
    ],
    codeSnippet: {
      title: 'Native Android AlarmClock Intent Integration (Flutter / Kotlin)',
      language: 'dart',
      code: `// Dispatches native system clock alarm via Android AlarmClock intent
Future<void> scheduleNativePhoneAlarm({
  required String title,
  required int hour,
  required int minute,
}) async {
  final intent = AndroidIntent(
    action: 'android.intent.action.SET_ALARM',
    arguments: <String, dynamic>{
      'android.intent.extra.alarm.HOUR': hour,
      'android.intent.extra.alarm.MINUTES': minute,
      'android.intent.extra.alarm.MESSAGE': 'BabyDaily: ' + title,
      'android.intent.extra.alarm.SKIP_UI': true,
    },
  );
  await intent.launch();
}`,
    },
    metrics: [
      { label: 'Alarm Reliability', value: '100%', desc: 'Native OS alarm provider bypasses battery doze' },
      { label: 'Supported Modes', value: 'Notification / Clock', desc: 'Configurable per reminder item' },
      { label: 'Quiet Hours', value: 'Per Caregiver', desc: 'Mutes non-essential alerts during night sleep' },
    ],
  },
  {
    id: 'family-sharing',
    badge: 'Caregiver RBAC',
    title: 'Multi-Caregiver Role Permissions & Normalized Invites',
    summary:
      'Parenting is teamwork. Invite partners, grandparents, and babysitters with granular permissions and automatic contact synchronization.',
    details: [
      'OWNER Role: Full administrative authority (manage baby profile, invite/remove caregivers, view full audit logs, delete baby).',
      'CAREGIVER Role: Active tracking authority (log, edit, and delete feedings, sleep, diapers, medicines, and notes).',
      'VIEWER Role: Read-only access (perfect for grandparents and pediatricians to check timeline and sleep totals without accidental edits).',
      'Normalized Phone & Email Matching: Phone numbers are stored with a normalized 9-digit key (phoneKey), ensuring invitations sent via local formats (+972 vs 05x, +1 vs local) match instantly when the user registers.',
    ],
    codeSnippet: {
      title: 'Role-Based Access Control Middleware (Fastify)',
      language: 'typescript',
      code: `export async function requireBabyRole(
  userId: string,
  babyId: string,
  allowedRoles: ('OWNER' | 'CAREGIVER' | 'VIEWER')[]
) {
  const membership = await prisma.babyMember.findUnique({
    where: { babyId_userId: { babyId, userId } },
  });
  if (!membership || !allowedRoles.includes(membership.role)) {
    throw new FastifyError(403, 'INSUFFICIENT_PERMISSIONS');
  }
  return membership;
}`,
    },
  },
  {
    id: 'api-reference',
    badge: 'REST API',
    title: 'Live REST API Endpoints & Request Examples',
    summary:
      'BabyDaily provides an authenticated REST API for mobile clients and web dashboards. All endpoints require a Bearer JWT token in the Authorization header.',
    details: [
      'Base URL: https://baby-daily-api.vercel.app',
      'Authentication: Authorization: Bearer <jwt_token>',
      'Format: JSON request and response payloads with standard HTTP status codes.',
    ],
    endpoints: [
      {
        method: 'GET',
        path: '/babies/:babyId/ai/insights',
        description: 'Returns real-time sweet-spot sleep status, awake minutes, wake window bracket, and DeepSeek routine suggestions.',
        curl: `curl -X GET "https://baby-daily-api.vercel.app/babies/cmvdjetx80001f8rkhgk4p251/ai/insights" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
        response: `{
  "babyId": "cmvdjetx80001f8rkhgk4p251",
  "babyName": "Liam",
  "ageText": "4 months old",
  "isSleeping": false,
  "awakeMinutes": 75,
  "recommendedWakeWindow": { "min": 90, "max": 120 },
  "wakeStatus": "OPTIMAL",
  "suggestions": [
    {
      "id": "nap-prep",
      "icon": "😴",
      "title": "Sweet-Spot Nap in ~25 Minutes",
      "body": "Liam has been awake for 75m. Begin wind-down routine soon."
    }
  ],
  "quota": { "isPremium": true, "aiQueriesToday": 1, "dailyLimit": 999 }
}`,
      },
      {
        method: 'POST',
        path: '/babies/:babyId/ai/chat',
        description: 'Asks the DeepSeek AI pediatric assistant a question grounded in the baby’s real-time 24h event logs.',
        curl: `curl -X POST "https://baby-daily-api.vercel.app/babies/cmvdjetx80001f8rkhgk4p251/ai/chat" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Why is Liam waking up every 45 minutes today?"}'`,
        response: `{
  "reply": "Liam is 4 months old, which corresponds to the classic 4-month sleep regression where infant sleep cycles mature. Today he has taken 3 short naps of 35-45 minutes each. Try extending his wake window by 10 minutes before nap 2 to build higher sleep pressure.",
  "quota": { "remainingToday": 998, "isPremium": true }
}`,
      },
      {
        method: 'POST',
        path: '/babies/:babyId/entries',
        description: 'Logs a routine event (FEED, SLEEP, DIAPER, MEDICINE, NOTE) and fans out push alerts to connected family members.',
        curl: `curl -X POST "https://baby-daily-api.vercel.app/babies/cmvdjetx80001f8rkhgk4p251/entries" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "FEED",
    "startedAt": "2026-11-08T10:30:00Z",
    "data": { "kind": "bottle", "amountMl": 150, "note": "Formula finished quickly" }
  }'`,
        response: `{
  "id": "cmve123450000abcdef",
  "babyId": "cmvdjetx80001f8rkhgk4p251",
  "type": "FEED",
  "startedAt": "2026-11-08T10:30:00.000Z",
  "data": { "kind": "bottle", "amountMl": 150, "note": "Formula finished quickly" },
  "createdAt": "2026-11-08T10:30:05.123Z"
}`,
      },
      {
        method: 'GET',
        path: '/babies/:babyId/stats?days=7',
        description: 'Returns 7-day routine trend aggregation for pediatric reports and charts.',
        curl: `curl -X GET "https://baby-daily-api.vercel.app/babies/cmvdjetx80001f8rkhgk4p251/stats?days=7" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
        response: `{
  "days": 7,
  "averages": {
    "avgFeedsPerDay": 6.2,
    "avgBottleMlPerDay": 780,
    "avgSleepHoursPerDay": 13.8,
    "longestSleepMinutes": 390
  },
  "daily": [
    { "date": "2026-11-07", "feedsCount": 6, "bottleMl": 810, "sleepHours": 14.1, "diapersTotal": 7 }
  ]
}`,
      },
    ],
  },
];
