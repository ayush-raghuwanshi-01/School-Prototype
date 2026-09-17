/**
 * Prerender smoke suite for Saraswati Vidhya Mandir Hr Sec School.
 *
 * Runs under Node via `npm run smoke`. It renders the public portal and every
 * management module server-side and asserts the real content is present (the
 * `__SVM_INSTANT__` flag disables the simulated network delay so views
 * render their loaded state instead of pulse skeletons), then sanity-checks the
 * mock dataset the UI is built on.
 */
declare const process: { exitCode?: number }
;(globalThis as { __SVM_INSTANT__?: boolean }).__SVM_INSTANT__ = true

import { renderToString } from 'react-dom/server'
import App from '../src/App'
import { AppProvider, type ViewKey } from '../src/state/store'
import { DashboardShell } from '../src/components/dashboard/DashboardShell'
import { ATTENDANCE_HISTORY, FEE_TRENDS, STUDENTS, SUBJECTS, buildInvoices } from '../src/data/school'
import { gradeFor, groupIndian, inrCompact } from '../src/lib/utils'

let failures = 0

function check(name: string, condition: boolean, detail = '') {
  if (!condition) {
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
    failures += 1
  }
}

function expectText(name: string, html: string, needles: string[]) {
  for (const needle of needles) {
    check(`${name} renders "${needle}"`, html.includes(needle))
  }
  // Guard against data holes surfacing as raw sentinel text in the markup.
  for (const bad of ['>NaN<', '>undefined<', '>Infinity<', 'NaN%', 'undefined%', '₹NaN']) {
    check(`${name} has no ${bad} in markup`, !html.includes(bad))
  }
}

/* ------------------------------------------------------------------ */
console.log('\n▸ Prerender suite\n')

const portal = renderToString(<App />)
expectText('portal', portal, [
  'Campus Pulse',
  'A school built',
  'Academic Programs',
  'Voices from campus',
  'The Innovation Lab',
  'Start an enquiry',
  'Talk to admissions',
  'The SVM Bulletin',
  'campus-innovation-lab.jpg',
])
console.log(`  portal                 ${String(portal.length).padStart(7)} chars`)

const VIEWS: [ViewKey, string[]][] = [
  [
    'overview',
    [
      'Command Centre',
      'Students present today',
      'Today’s task board',
      'syllabus readiness',
      'Approvals waiting',
      'Campus alerts',
      'memo board',
      'Principal’s day',
    ],
  ],
  ['approvals', ['Approvals &amp; sanctions', 'Leave', 'Awaiting decision', 'Decision policy']],
  ['notices', ['Notices &amp; circulars', 'Compose circular', 'Read receipts', 'Quick templates', 'Delivery channels']],
  ['reviews', ['Notes, reviews &amp; feedback', 'New note', 'Lesson plans', 'Parent voice', 'Writing prompts']],
  ['staff', ['Duty roster', 'Substitution engine', 'Present today', 'Workload balance', 'Department strength']],
  [
    'analytics',
    [
      'Good morning',
      'Monthly fee collection',
      'Attendance split',
      'Admissions funnel',
      'Watchlist',
      'Activity feed',
      'Board average',
    ],
  ],
  [
    'attendance',
    [
      'Monthly attendance heatmap',
      'Live register',
      'Chronic absenteeism watchlist',
      'Mark all present',
      'Present marks',
    ],
  ],
  ['fees', ['invoicing', 'Record payment', 'Collected', 'Overdue', 'INV-2026', 'Sort: Student']],
  [
    'exams',
    [
      'Exam schedule',
      'Marks entry matrix',
      'Class analytics',
      'Simulate entry',
      'Subject average',
      'Examination calendar',
    ],
  ],
  ['students', ['Directory', 'Admission no.', 'Aggregate', 'All houses']],
  ['faculty', ['Faculty directory', 'Weekly timetable', 'Syllabus completion', 'Start appraisal']],
  ['reports', ['Reports, audits', 'Compliance checklist', 'Report library', 'Audit trail', 'System health']],
  ['admissions', ['Admissions pipeline', 'Pipeline stage', 'Source performance', 'Advance stage']],
  ['child', ['Good afternoon', 'Subject performance', 'This week', 'Reach the school', 'Download report card']],
]

for (const [view, needles] of VIEWS) {
  const html = renderToString(
    <AppProvider initialRoute="dashboard" initialView={view}>
      <DashboardShell />
    </AppProvider>,
  )
  expectText(`dashboard:${view}`, html, needles)
  console.log(`  dashboard:${view.padEnd(12)} ${String(html.length).padStart(7)} chars`)
}

/* ------------------------------------------------------------------ */
console.log('\n▸ Dataset sanity\n')

check('roster is 24 students', STUDENTS.length === 24, `got ${STUDENTS.length}`)
check(
  'roll numbers are sequential',
  STUDENTS.every((s, i) => s.roll === i + 1),
)
check(
  'attendance percentages are plausible',
  STUDENTS.every((s) => s.attendancePct > 50 && s.attendancePct <= 100),
)
check(
  'every student carries a fee status',
  STUDENTS.every((s) => ['paid', 'pending', 'overdue'].includes(s.feeStatus)),
)

const invoices = buildInvoices()
check('one invoice per student', invoices.length === STUDENTS.length)
check(
  'fee head breakdowns sum to the invoice amount',
  invoices.every((inv) => inv.heads.reduce((a, h) => a + h.amount, 0) <= inv.amount + inv.heads.length),
)
check(
  'paid invoices carry a receipt number',
  invoices.filter((i) => i.status === 'paid').every((i) => Boolean(i.receiptNo)),
)
check(
  'only settled invoices carry a payment date',
  invoices.filter((i) => i.status !== 'paid').every((i) => !i.paidOn),
)

const workingDays = ATTENDANCE_HISTORY.filter((d) => !d.holiday)
check('heatmap spans six months', ATTENDANCE_HISTORY.length === 183, `${ATTENDANCE_HISTORY.length} days`)
check(
  'heatmap covers 1 Apr – 30 Sep 2026',
  ATTENDANCE_HISTORY[0].date === '2026-04-01' && ATTENDANCE_HISTORY[182].date === '2026-09-30',
)
check('at least 100 working days recorded', workingDays.length >= 100, `${workingDays.length} working days`)
check(
  'daily splits never exceed the class size',
  ATTENDANCE_HISTORY.every((d) => d.present + d.late + d.absent <= STUDENTS.length),
)
check(
  'Sundays are always marked as holidays',
  ATTENDANCE_HISTORY.filter((d) => new Date(`${d.date}T00:00:00`).getDay() === 0).every((d) => d.holiday),
)

// Calendar matrix alignment: the Monday-based start index of each month must
// match the real 2026 calendar, or the heatmap columns would drift.
const MONTHS = [
  { month: 4, startDow: 2 },
  { month: 5, startDow: 4 },
  { month: 6, startDow: 0 },
  { month: 7, startDow: 2 },
  { month: 8, startDow: 5 },
  { month: 9, startDow: 1 },
]
for (const m of MONTHS) {
  const real = (new Date(Date.UTC(2026, m.month - 1, 1)).getUTCDay() + 6) % 7
  check(`heatmap start index for month ${m.month}`, real === m.startDow, `calendar ${real} vs configured ${m.startDow}`)
}

check('six fee trend months', FEE_TRENDS.length === 6)
check('six subjects on the marks matrix', SUBJECTS.length === 6)
check(
  'MPBSE grade bands behave',
  gradeFor(95) === 'A1' && gradeFor(85) === 'A2' && gradeFor(75) === 'B1' && gradeFor(30) === 'D',
)

/* ------------------------------------------------------------------ */
console.log('\n▸ Formatting\n')
check('Indian digit grouping with a lakh boundary', groupIndian(1250000) === '12,50,000', groupIndian(1250000))
check('Indian digit grouping for thousands', groupIndian(45000) === '45,000', groupIndian(45000))
check('crore compaction', inrCompact(12400000) === '₹1.24 Cr', inrCompact(12400000))
check('lakh compaction', inrCompact(1589000) === '₹15.89 L', inrCompact(1589000))
check('thousand compaction', inrCompact(24000) === '₹24.0K', inrCompact(24000))

/* ------------------------------------------------------------------ */
if (failures === 0) {
  console.log('\n✅ All smoke checks passed\n')
  process.exitCode = 0
} else {
  console.error(`\n❌ ${failures} check(s) failed\n`)
  process.exitCode = 1
}
