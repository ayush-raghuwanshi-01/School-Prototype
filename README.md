# Saraswati Vidhya Mandir Hr Sec School — Portal + School ERP (prototype)

A fully interactive React prototype of an MPBSE senior-secondary school in Bhopal
(462010): a public admissions portal **and** the internal school ERP the Principal
runs the campus on, in one app.

Everything is front-end only — no backend, no network calls. All numbers are
deterministic mock data shaped like real Madhya Pradesh school records (MPBSE
affiliation `MP/2134`, ₹ Lakh fee collection, Class XII-B rosters, terms, houses,
Bhopal bus-route numbers, `@svmbhopal.edu.in` staff mailboxes).

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # typecheck + lint + format check + prerender smoke + production build
```

---

## Two products, one shell

### 1. Public portal (default route)

| Section | What it does |
| --- | --- |
| **Floating pill nav** | Blur ramps up on scroll, active-section pill animates between links via `IntersectionObserver`, utility strip collapses away as you scroll, animated mobile sheet. |
| **Hero** | Editorial type scale with a serif-italic accent, plus **Campus Pulse** — a live metrics widget you can drive: switch between attendance / fee collection / board averages, pause the live feed, watch the sparkline redraw and the per-wing bars re-animate. |
| **Programs** | Tabbed card grid for Primary → Middle → Secondary → Senior Secondary, with Science / Commerce / Humanities sub-tabs, expandable subject matrices, and seat-demand meters (applications vs seats). |
| **Testimonials** | Autoplay carousel (pause/resume), manual rail + pagination dots, per-slide progress bar animated by Framer Motion, ← / → keyboard support, blurred cross-fade transitions. |
| **Campus** | Interactive image gallery (thumbnails ↔ hero with ring indicator), facility grid, and live progress on capital projects. |
| **Admissions** | Four-step process explainer, accordion FAQ, and a validated enquiry form with a loading state and an animated success panel. |
| **Footer** | Contact block, newsletter capture, and a staff-console hand-off. |

### 2. Management console (`⌘K` → jump anywhere, or click *Dashboard*)

**14 modules** across four working groups — the Principal's desk, school operations, insight, and finance & people.

| Module | Highlights |
| --- | --- |
| **Command Centre** *(Principal's landing view)* | One screen for the day: KPI band (students present, staff on duty, September collection, approvals pending) with click-through to each module; **task board** with priority/owner filters, inline composer, tick-off and clear-completed; attendance-by-wing bars; MPBSE exam readiness meters; fee-collection area chart against target; five-year board-result trajectory; campus alerts; statutory compliance deadlines (MPBSE · UDISE+ · RTE); today's substitutions; approvals rail; memo board; parent voice; the Principal's seven-slot day plan; birthdays; sick-bay log; transport status. |
| **Approvals** | The Principal's sanction queue — KPI band (open, urgent, money pending, same-day clearance), search across requester/detail/kind, kind filter segmented (Leave · Expense · Certificate · Purchase · Fee waiver · Transport), approve in one click, **return-with-remarks modal** with preset reasons, decision policy panel, weekly throughput, and a **live audit log that is written as you decide** (session decisions stack above the seeded entries). Locked out for parents, read-only for other roles. |
| **Notices & Circulars** | Compose-and-publish desk: priority (push + SMS / push / app only), category, multi-select audience chips with delivery estimates, four **quick templates** that pre-fill the composer, read-receipt progress bars with a "nudge pending guardians" action, delivery-channel mix, and a **parent-app preview modal** that renders the circular as a phone notification. |
| **Notes & Reviews** | Three tabs — **Notes** (colour-coded memo cards, pin/edit/delete, pinned rail, writing prompts), **Lesson plans** (per-teacher submissions with quality stars, approve / return-with-remarks, review-discipline meters, observation slots) and **Parent voice** (rated feedback cards, sentiment pills, reply composer with presets, satisfaction histogram, hot-topic bars, SMC escalation summary). |
| **Staff & Duty** | Duty register for 12 rostered staff with present / leave / on-duty segmented toggles, wing filters, mark filter counts, whole-staff "mark all present", register export, **substitution engine** (period slots with absent teacher, reason, substitute — confirm cover or auto-assign a free teacher), workload balance against the 30-period norm, approved-leave list and department strength vs sanctioned posts. |
| **Analytics** | Recharts **bar chart** of monthly fee collections in ₹ Lakh, Recharts **donut** for the attendance split with a centred read-out, admissions funnel line chart, at-risk watchlist, activity timeline, and the floating **Quick Action** menu. |
| **Attendance** | Six-month **calendar heatmap** (click any day for its split, gradient legend, today marker) beside the **live register for Class XII-B** — per-student P/L/A toggles, bulk "mark all present", filter counts, and a chronic-absenteeism watchlist against the MPBSE 75% norm. |
| **Fees & Invoicing** | Invoice table with status filters (All / Paid / Pending / Overdue), search, sort, row selection with bulk reminders, colour-coded status pills, a **Record Payment modal** (fee-head breakdown, method, partial payments, quick amounts) that posts a receipt and fires a toast, plus an invoice drawer with a ledger timeline. |
| **Exams & Marks** | Exam calendar with lifecycle states and a **marks-entry matrix** — edit any cell and the class average, subject averages, grade distribution and per-student aggregate/grade recompute instantly. "Simulate entry" streams a whole dataset in with a progress state. |
| **Students** | Table ⇄ card layouts, house filters, attendance and aggregate meters, and a tabbed record drawer (overview / academics / finance). |
| **Faculty** | Directory with wing filters, workload + syllabus completion, appraisal actions, and a live weekly timetable highlighting the selected teacher's periods. |
| **Reports** | Report library with generate/download states, compliance checklist, system health, and an audit trail. |
| **Admissions** | Funnel KPIs, pipeline list with one-tap stage advance, a click-the-progress-bar stage stepper, and channel performance analysis. |
| **My Ward** | The parent-facing view: subject breakdown, fee receipt, timetable, updates timeline, and contact shortcuts. |

### Console chrome

- **Persistent topbar** — ⌘K/Ctrl-K search trigger, notification dropdown (unread badge, mark-all-read), dark/light switch, and **role selector**.
- **Role switching** — Administrator, Principal, Class Teacher, Accounts Officer, Parent. Each role has its own module scope, default landing view, and a read-only banner + lock icons when you open something outside it. Administrators and the Principal land on the Command Centre; the Class Teacher on the register, the Accounts Officer on fees and parents on their ward's record.
- **Sidebar badges** — live counts for the approval queue (rose) and pending lesson-plan reviews (violet), grouped as *Today*, *School operations*, *Insight*, *Finance*, *People*, *Growth* and *Family*.
- **Quick actions** — floating FAB that expands with staggered options, wired to real navigation and events.
- **Toasts** — spring-animated stack, tone-coded, auto-dismissing.

---

## Design system

| Token | Value |
| --- | --- |
| Primary | Electric Blue `#2563EB` (`brand-*`) |
| Secondary | Violet `#7C3AED` (`violet-accent-*`) |
| Neutrals | Slate ramp `ink-50 … ink-950` |
| Status | `emerald` paid/present · `amber` pending/late · `rose` overdue/absent |
| Type | Plus Jakarta Sans (UI), Instrument Serif (editorial italics), JetBrains Mono (codes, amounts) |

Motion rules: staggered fade + slide-up on view and card mounts (`AnimatePresence`
with spring transitions), hover lifts (`.lift-hover`), pointer-down scale
(`.press`), animated ring/underline indicators driven by `layoutId`, and pulse
skeletons for every loading state.

**Interaction details worth clicking:** the Campus Pulse live toggle, heatmap day
cells, the P/L/A segmented toggles, the "Simulate entry" button on the marks
matrix, the partial-payment switch in the payment modal, the quick-action FAB,
the task board composer on the Command Centre, an Approve in the sanction queue
(watch the audit log fill in), a quick template in the circular desk, the
substitution "auto-assign" button, and ⌘K → type a student's name.

---

## Architecture

```
src/
├─ App.tsx                     # route switch + lazy-loaded console + Suspense skeleton
├─ index.css                   # Tailwind v4 theme tokens, dark variant, keyframes, utilities
├─ data/school.ts              # deterministic mock data (roster, invoices, heatmap, programs…)
├─ lib/utils.ts                # Indian number formatting, grading, PRNG, cn()
├─ state/store.tsx             # context: route/view/theme/role, attendance, marks, invoices, toasts
├─ components/
│  ├─ ui/                      # Button, Card, Badge/Pill, Form, Overlay (Modal/Drawer), Skeleton, ToastHost
│  ├─ portal/                  # nav, hero, live showcase, programs, testimonials, campus, admissions, footer
│  └─ dashboard/               # shell, topbar, sidebar, command palette, quick actions, charts, panels, 14 views
└─ tests/                      # smoke (SSR prerender + data) and interaction (jsdom click-through) suites
```

- **Tailwind v4** with `@theme` tokens and a class-based dark variant
  (`@custom-variant dark`), toggled on `<html>` and persisted to `localStorage`.
- **Framer Motion** for all transitions, overlays and micro-interactions.
- **Recharts** for the analytics and marks visualisations.
- **Deep links** — the console keeps `#/dashboard/<module>` in sync
  (`#/dashboard/fees`, `#/dashboard/attendance`, …) and reacts to browser back/forward.
- **Keyboard** — `⌘K` / `Ctrl+K` opens the command palette, `↑`/`↓` + `↵` to run,
  `Esc` closes overlays, `←`/`→` move the testimonial carousel.
- **Verification** — `tests/smoke.tsx` (SSR prerender + dataset assertions) and
  `tests/interaction.tsx` (jsdom click-through of the real app) run in CI-style
  with `npm run check`.
- **Code splitting** — the console (Recharts + tables) is lazy-loaded, so the
  marketing site ships without it.

## Mock data notes

- 1,363 students, 138 staff, session 2026–27; MPBSE recognition `MP/2134`, Bhopal
  462010, `info@svmbhopal.edu.in`, `+91 755 266 8800`.
- The Principal workspace ships its own datasets: 9 seeded tasks, 5 memos, 8
  approval requests, 5 circulars (one draft), 6 parent reviews, 5 lesson-plan
  reviews, 4 grievances, 12 duty-roster staff, 4 substitutions, 5 birthdays, a
  7-slot principal's day, 4 class rollups, 4 campus alerts, 4 compliance
  deadlines, 5 exam-readiness meters, a sick-bay log and a 5-year MPBSE trend.
- 24 students in Class XII-B with admission numbers, guardians, houses, transport
  flags, attendance percentages and fee states.
- Fee invoices derive per-head breakdowns (tuition, lab, transport, examination)
  and settle into receipts when you record a payment.
- The attendance heatmap covers 1 Apr – 30 Sep 2026 (183 days) with weekday/holiday
  logic and Monday-aligned month grids; today is pinned to 16 Sep 2026.
- Marks are seeded so the grade distribution reads like a real section
  (A1 → D) and are fully editable in the UI.
- All randomness uses a seeded PRNG so the prototype renders identically on every load.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server (host `0.0.0.0`, so it works behind a proxied preview URL). |
| `npm run build` | Typecheck (`tsc -b`) then production build. |
| `npm run lint` | oxlint (correctness as errors). |
| `npm run format` / `format:check` | Prettier write / verify. |
| `npm run smoke` | Prerenders the portal and all fourteen console modules server-side and asserts content + dataset invariants + number formatting. |
| `npm run test:dom` | Mounts the real app in jsdom and drives it with DOM events (48 checks) — portal tabs, theme, ⌘K, per-student attendance toggles, bulk actions, the payment modal posting a toast, live marks recalculation, filter changes, the Principal workspace (task composer + tick-off, approval decision writing an audit entry, circular publish, memo note, staff register) and role switching. |
| `npm run test` | `smoke` + `test:dom`. |
| `npm run check` | The full gate: types → lint → format → both test suites → build. |

## Scope & next steps

This is a prototype: authentication, persistence and API calls are simulated in
context/state. Natural next steps would be a real API layer (TanStack Query),
RBAC enforced server-side, per-role optimistic updates, drag-and-drop for the
admissions pipeline, and PDF receipt generation.
#   S c h o o l - P r o t o t y p e  
 #   S c h o o l - P r o t o t y p e  
 