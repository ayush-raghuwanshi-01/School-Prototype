import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  Activity,
  AlarmClock,
  ArrowRight,
  BadgeIndianRupee,
  BellRing,
  Cake,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  HeartPulse,
  Layers,
  Lightbulb,
  ListChecks,
  MessageSquareQuote,
  PackageCheck,
  Pin,
  Plus,
  ShieldAlert,
  Sparkles,
  StickyNote,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  BookOpenCheck,
  Bus,
} from 'lucide-react'
import { useApp, useCountUp, useSimulatedLoad } from '../../../state/store'
import {
  BOARD_TREND,
  CAMPUS_ALERTS,
  CLASS_ROLLUP,
  COMPLIANCE_DEADLINES,
  DUTY_STAFF,
  EXAM_READINESS,
  FEE_TRENDS,
  BIRTHDAYS,
  PRINCIPAL_DAY,
  SCHOOL,
  SICK_BAY,
  STUDENTS,
  type NoteTone,
} from '../../../data/school'
import { Card, Eyebrow } from '../../ui/Card'
import { Pill, TONES, type Tone } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { Avatar, Input, Segmented, Select } from '../../ui/Form'
import { Modal } from '../../ui/Overlay'
import { SkeletonList, SkeletonStatGrid } from '../../ui/Skeleton'
import { AXIS_STYLE, ChartFrame, ChartTooltip } from '../ChartKit'
import { DataBar, PanelCard, PriorityPill, RatingStars, SectionLink, SentimentPill, TaskRow } from '../Panels'
import { cn, inrCompact } from '../../../lib/utils'
import { RoiStrip } from '../RoiStrip'
import { LiveTicker } from '../LiveTicker'

const NOTE_TONES: Record<NoteTone, { card: string; chip: string; label: string }> = {
  brand: {
    card: 'border-brand-200/80 bg-brand-50/80 dark:border-brand-500/25 dark:bg-brand-500/10',
    chip: 'bg-brand-600',
    label: 'Blue',
  },
  amber: {
    card: 'border-amber-200/80 bg-amber-50/80 dark:border-amber-500/25 dark:bg-amber-500/10',
    chip: 'bg-amber-500',
    label: 'Amber',
  },
  emerald: {
    card: 'border-emerald-200/80 bg-emerald-50/80 dark:border-emerald-500/25 dark:bg-emerald-500/10',
    chip: 'bg-emerald-500',
    label: 'Green',
  },
  violet: {
    card: 'border-violet-accent-100 bg-violet-accent-50/80 dark:border-violet-accent-400/25 dark:bg-violet-accent-500/10',
    chip: 'bg-violet-accent-600',
    label: 'Violet',
  },
  rose: {
    card: 'border-rose-200/80 bg-rose-50/80 dark:border-rose-500/25 dark:bg-rose-500/10',
    chip: 'bg-rose-500',
    label: 'Rose',
  },
  slate: {
    card: 'border-ink-200/80 bg-white/70 dark:border-white/10 dark:bg-white/[0.03]',
    chip: 'bg-ink-500',
    label: 'Grey',
  },
}

const ALERT_TONE: Record<'high' | 'medium' | 'low', Tone> = { high: 'rose', medium: 'amber', low: 'slate' }

export function OverviewView() {
  const {
    role,
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    clearDoneTasks,
    notes,
    addNote,
    updateNote,
    togglePinNote,
    deleteNote,
    approvals,
    decideApproval,
    notices,
    feedback,
    lessonPlans,
    substitutions,
    staffDuty,
    setView,
    pushToast,
    attendance,
    setBiometricModalOpen,
    setWhatsAppModalOpen,
    setWhatsAppInvoice,
  } = useApp()

  const [aiAnalyzing, setAiAnalyzing] = useState(false)
  const [taskFilter, setTaskFilter] = useState<'open' | 'high' | 'done'>('open')
  const [noteComposer, setNoteComposer] = useState(false)
  const [taskComposer, setTaskComposer] = useState(false)
  const loading = useSimulatedLoad('overview', 620)

  const triggerAiAnalysis = () => {
    setAiAnalyzing(true)
    setTimeout(() => {
      setAiAnalyzing(false)
      pushToast({
        tone: 'success',
        title: 'AI Attendance Radar refreshed',
        description: 'Analyzed 1,420 biometric logs · 3 students flagged for chronic absenteeism patterns.',
      })
    }, 1200)
  }

  const canApprove = role.views.includes('approvals')
  const canReview = role.views.includes('reviews')

  const presentToday = useMemo(
    () => Object.values(attendance).filter((m) => m === 'present' || m === 'late').length,
    [attendance],
  )
  const staffPresent = DUTY_STAFF.length - Object.values(staffDuty).filter((v) => v !== 'present').length
  const collectionThisMonth = FEE_TRENDS[FEE_TRENDS.length - 1]
  const collectionPct = (collectionThisMonth.collected / collectionThisMonth.target) * 100

  const openTasks = tasks.filter((t) => !t.done)
  const doneTasks = tasks.filter((t) => t.done)
  const completion = tasks.length ? (doneTasks.length / tasks.length) * 100 : 0
  const visibleTasks = useMemo(() => {
    if (taskFilter === 'done') return doneTasks
    if (taskFilter === 'high') return openTasks.filter((t) => t.priority === 'high')
    return openTasks
  }, [doneTasks, openTasks, taskFilter])

  const feedbackAvg = feedback.reduce((a, b) => a + b.rating, 0) / (feedback.length || 1)
  const concerns = feedback.filter((f) => f.sentiment === 'concern').length
  const pendingPlans = lessonPlans.filter((p) => p.status === 'pending').length
  const unconfirmedSubs = substitutions.filter((s) => !s.confirmed).length

  const feeCollected = useCountUp(collectionThisMonth.collected, 900)
  const studentTotal = SCHOOL.students

  if (loading) {
    return (
      <div className="space-y-5">
        <SkeletonStatGrid count={4} />
        <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
          <SkeletonList rows={6} />
          <SkeletonList rows={4} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* ---------------- Header ---------------- */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>
            <Sparkles className="h-3.5 w-3.5" /> Command centre
          </Eyebrow>
          <h1 className="mt-2.5 text-[clamp(1.6rem,3vw,2.15rem)] leading-tight font-extrabold tracking-[-0.04em] text-ink-900 dark:text-white">
            Namaste, {role.person.split(' ').slice(-1)[0]}.
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500 dark:text-ink-400">
            Wednesday, 16 September 2026 · Day 118 of session {SCHOOL.session} · Term 2
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Pill tone={collectionPct >= 100 ? 'emerald' : 'amber'} dot>
            Collections at {collectionPct.toFixed(0)}% of target
          </Pill>
          <Button
            size="sm"
            variant="outline"
            icon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setTaskComposer(true)}
          >
            Add task
          </Button>
          <Button size="sm" icon={<BellRing className="h-3.5 w-3.5" />} onClick={() => setView('notices')}>
            New circular
          </Button>
        </div>
      </div>

      {/* ---------------- Dedicated Faculty Cockpit when logged in as Teacher ---------------- */}
      {role.id === 'teacher' && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/70 pb-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-700 text-white font-bold text-sm">
                XII-B
              </span>
              <div>
                <h3 className="text-[15px] font-extrabold text-slate-900">Faculty Workspace · Dr. Shalini Verma</h3>
                <p className="text-[11.5px] text-emerald-800 font-medium">
                  Class Teacher XII-B (Science PCM) & Head of Science Department
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                className="bg-emerald-700 text-white hover:bg-emerald-800"
                onClick={() => {
                  setView('attendance')
                  pushToast({
                    tone: 'success',
                    title: 'Class XII-B Attendance Register',
                    description: 'Opened homeroom register · 24 scholars enrolled.',
                  })
                }}
              >
                Take XII-B Attendance
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setView('exams')
                  pushToast({
                    tone: 'info',
                    title: 'Physics Mid-Term Marks Matrix',
                    description: '20 of 24 answer scripts evaluated.',
                  })
                }}
              >
                Enter Exam Marks
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  pushToast({
                    tone: 'success',
                    title: 'Homework Dispatched to Class XII-B',
                    description: 'Ray Optics derivation assigned to 24 students via portal.',
                  })
                }}
              >
                Dispatch Homework
              </Button>
            </div>
          </div>

          {/* Today's Teaching Schedule */}
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              My Teaching Schedule Today (5 Periods)
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { time: '08:15 – 09:00', class: 'Class XII-B', topic: 'Physics (Optics)', room: 'Room 204' },
                { time: '10:05 – 10:50', class: 'Class XI-A', topic: 'Physics (Mechanics)', room: 'Room 108' },
                { time: '11:15 – 12:45', class: 'Class XII-B', topic: 'Optics Practical Lab', room: 'Lab 3' },
                { time: '01:40 – 02:25', class: 'Class IX-A', topic: 'General Science', room: 'Room 302' },
                { time: '02:35 – 03:15', class: 'Doubt Clinic', topic: 'Remedial Science', room: 'Lab 3' },
              ].map((period, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-2xs">
                  <span className="font-mono text-[10px] font-bold text-emerald-700">{period.time}</span>
                  <p className="text-[12px] font-extrabold text-slate-900 mt-0.5">{period.class}</p>
                  <p className="text-[11px] text-slate-600 truncate">{period.topic}</p>
                  <span className="text-[10px] text-slate-400 font-medium">{period.room}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Value / ROI Strip (Executive Proof) ---------------- */}
      <RoiStrip />

      {/* ---------------- Live Activity Ticker (Perceived Real-Time Credibility) ---------------- */}
      <LiveTicker onOpenBiometric={() => setBiometricModalOpen(true)} />

      {/* ---------------- KPI band ---------------- */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Students present today',
            value: `${presentToday}/${STUDENTS.length}`,
            sub: `Class XII-B register · whole school ${(94.1).toFixed(1)}%`,
            icon: Users,
            tone: 'brand' as Tone,
            onClick: () => setView('attendance'),
          },
          {
            label: 'Staff on duty',
            value: `${staffPresent}/${DUTY_STAFF.length}`,
            sub: `${Object.values(staffDuty).filter((v) => v === 'leave').length} on leave · ${unconfirmedSubs} substitutions pending`,
            icon: UserCheck,
            tone: 'emerald' as Tone,
            onClick: () => setView('staff'),
          },
          {
            label: 'Fee collected · September',
            value: inrCompact(collectionThisMonth.collected * 100000),
            sub: `Target ${inrCompact(collectionThisMonth.target * 100000)} · ₹${collectionThisMonth.dues} L outstanding`,
            icon: BadgeIndianRupee,
            tone: 'violet' as Tone,
            onClick: () => setView('fees'),
          },
          {
            label: 'Approvals awaiting you',
            value: String(approvals.length),
            sub: approvals.length ? 'Oldest pending since 11 Sep' : 'Inbox clear — well done',
            icon: ClipboardList,
            tone: (approvals.length > 3 ? 'rose' : 'amber') as Tone,
            onClick: () => setView('approvals'),
          },
        ].map((kpi, i) => (
          <motion.button
            key={kpi.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.985 }}
            onClick={kpi.onClick}
            className="surface lift group rounded-3xl p-5 text-left hover:border-brand-300/70 dark:hover:border-brand-500/35"
          >
            <div className="flex items-start justify-between">
              <span
                className={cn('grid h-9 w-9 place-items-center rounded-xl', TONES[kpi.tone].soft, TONES[kpi.tone].text)}
              >
                <kpi.icon className="h-4.5 w-4.5" />
              </span>
              <ArrowRight className="h-4 w-4 -translate-x-1 text-ink-300 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 dark:text-ink-500" />
            </div>
            <p className="mt-3.5 text-[11.5px] font-semibold text-ink-500 dark:text-ink-400">{kpi.label}</p>
            <p className="mt-1 text-[25px] leading-none font-extrabold tracking-[-0.045em] tabular text-ink-900 dark:text-white">
              {kpi.value}
            </p>
            <p className="mt-2 text-[11px] leading-snug text-ink-400">{kpi.sub}</p>
          </motion.button>
        ))}
      </div>

      {/* ---------------- Main grid ---------------- */}
      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <div className="space-y-5">
          {/* Tasks */}
          <PanelCard
            title="Today’s task board"
            subtitle={`${openTasks.length} open · ${doneTasks.length} completed · ${completion.toFixed(0)}% of today’s list done`}
            icon={<ListChecks className="h-4 w-4" />}
            action={<SectionLink label="Add" onClick={() => setTaskComposer(true)} />}
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <Segmented
                size="sm"
                value={taskFilter}
                onChange={setTaskFilter}
                options={[
                  { value: 'open', label: `Open ${openTasks.length}` },
                  { value: 'high', label: `Priority ${openTasks.filter((t) => t.priority === 'high').length}` },
                  { value: 'done', label: `Done ${doneTasks.length}` },
                ]}
              />
              {doneTasks.length > 0 ? (
                <button
                  onClick={() => {
                    clearDoneTasks()
                    pushToast({
                      tone: 'info',
                      title: 'Completed tasks cleared',
                      description: 'Your board is ready for tomorrow.',
                    })
                  }}
                  className="press text-[11.5px] font-bold text-ink-400 transition-colors hover:text-rose-500"
                >
                  Clear completed
                </button>
              ) : null}
            </div>

            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand-600 to-emerald-500"
                animate={{ width: `${completion}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {visibleTasks.map((task, i) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    index={i}
                    onToggle={() => toggleTask(task.id)}
                    onDelete={() => deleteTask(task.id)}
                  />
                ))}
              </AnimatePresence>
              {visibleTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-ink-300 px-4 py-8 text-center dark:border-white/12">
                  <PackageCheck className="mx-auto h-7 w-7 text-emerald-500" />
                  <p className="mt-2.5 text-[13px] font-bold text-ink-800 dark:text-ink-100">
                    {taskFilter === 'done' ? 'Nothing completed yet' : 'Task list is clear'}
                  </p>
                  <p className="mt-1 text-[11.5px] text-ink-500 dark:text-ink-400">
                    {taskFilter === 'done'
                      ? 'Tick a task off to see it here.'
                      : 'Add a task, or enjoy the calm before the assembly.'}
                  </p>
                </div>
              ) : null}
            </div>
          </PanelCard>

          {/* AI Attendance Insights & Retention Radar (AI Wow Differentiator) */}
          <PanelCard
            title="AI Attendance Radar · Students Needing Attention"
            subtitle="Predictive pattern algorithms identifying chronic absence & drop-out risks"
            icon={<Sparkles className="h-4 w-4 text-purple-500" />}
            action={
              <Button
                size="sm"
                variant="outline"
                loading={aiAnalyzing}
                icon={<Sparkles className="h-3 w-3 text-purple-500" />}
                onClick={triggerAiAnalysis}
              >
                {aiAnalyzing ? 'Analyzing Logs…' : 'Refresh AI Radar'}
              </Button>
            }
          >
            <div className="space-y-3">
              {[
                {
                  name: 'Rohan Gupta',
                  classId: 'Class IX-B',
                  drop: '-18.4%',
                  currentPct: '72.1%',
                  pattern: '3 consecutive Mondays absent · High risk of dropping below CBSE 75% norm',
                  urgency: 'high' as const,
                  action: 'WhatsApp Parent',
                },
                {
                  name: 'Simran Kaur',
                  classId: 'Class XI-A',
                  drop: '-11.2%',
                  currentPct: '74.8%',
                  pattern: 'Consistent Friday absenteeism (68% Fri vs 96% Tue-Thu) · Suspected coaching overlap',
                  urgency: 'high' as const,
                  action: 'Teacher Mentor',
                },
                {
                  name: 'Aditya Verma',
                  classId: 'Class X-C',
                  drop: '-9.5%',
                  currentPct: '79.0%',
                  pattern: 'Consecutive post-lunch period unpunctuality flagged by Gate 02 sensor',
                  urgency: 'medium' as const,
                  action: 'Review Log',
                },
              ].map((student) => (
                <div
                  key={student.name}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-200/70 bg-white/70 p-3.5 transition-colors hover:border-brand-300 dark:border-white/8 dark:bg-white/[0.02]"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl font-bold text-xs ${
                        student.urgency === 'high'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                      }`}
                    >
                      {student.drop}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-ink-900 dark:text-white">{student.name}</span>
                        <span className="text-[11px] font-medium text-ink-400">({student.classId})</span>
                        <Pill tone={student.urgency === 'high' ? 'rose' : 'amber'} className="text-[9.5px] py-0">
                          {student.currentPct} Attendance
                        </Pill>
                      </div>
                      <p className="mt-1 text-[11.5px] leading-snug text-ink-500 dark:text-ink-400">
                        {student.pattern}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[11px] h-8"
                      onClick={() => {
                        setWhatsAppInvoice({
                          id: 'INV-ATTN-01',
                          studentId: 's-attn',
                          studentName: student.name,
                          classId: student.classId,
                          term: 'Term 2 (Attendance Alert)',
                          heads: [{ label: 'Tuition Fee', amount: 42500 }],
                          amount: 42500,
                          dueDate: '2026-09-20',
                          status: 'overdue',
                        })
                        setWhatsAppModalOpen(true)
                      }}
                    >
                      {student.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3.5 flex items-center justify-between rounded-xl bg-purple-50/80 px-3 py-2 text-[11px] font-medium text-purple-900 dark:bg-purple-950/20 dark:text-purple-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                AI scans attendance logs at 08:30 AM daily and drafts proactive alerts.
              </span>
              <button
                onClick={() => setView('attendance')}
                className="font-bold text-purple-700 hover:underline dark:text-purple-300"
              >
                View full attendance matrix →
              </button>
            </div>
          </PanelCard>

          {/* Ops row */}
          <div className="grid gap-5 lg:grid-cols-2">
            <PanelCard
              title="Attendance by wing"
              subtitle="Live register · whole school 94.1%"
              icon={<Layers className="h-4 w-4" />}
              action={<SectionLink label="Heatmap" onClick={() => setView('attendance')} />}
            >
              <div className="space-y-3.5">
                {CLASS_ROLLUP.map((row) => (
                  <DataBar
                    key={row.className}
                    label={`${row.className} · ${row.classes}`}
                    value={row.present}
                    max={row.total}
                    tone={
                      row.present / row.total >= 0.94 ? 'emerald' : row.present / row.total >= 0.9 ? 'brand' : 'amber'
                    }
                    hint={`${row.present}/${row.total}`}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-ink-200/70 bg-ink-50/70 px-3.5 py-2.5 dark:border-white/8 dark:bg-white/[0.03]">
                <span className="text-[11.5px] font-semibold text-ink-500 dark:text-ink-400">
                  Absent today (school-wide)
                </span>
                <span className="text-[13px] font-extrabold tabular text-rose-600 dark:text-rose-400">
                  {studentTotal - presentToday - 1000 > 0 ? studentTotal - presentToday - 1000 : 63} students
                </span>
              </div>
            </PanelCard>

            <PanelCard
              title="Exam & syllabus readiness"
              subtitle="Half-yearly examinations from 24 November"
              icon={<BookOpenCheck className="h-4 w-4" />}
              action={<SectionLink label="Exams" onClick={() => setView('exams')} />}
            >
              <div className="space-y-3.5">
                {EXAM_READINESS.map((item) => (
                  <DataBar
                    key={item.id}
                    label={item.label}
                    value={item.value}
                    max={100}
                    tone={item.value >= 80 ? 'emerald' : item.value >= 50 ? 'brand' : 'amber'}
                  />
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3.5 dark:border-amber-500/25 dark:bg-amber-500/10">
                <p className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.1em] text-amber-700 uppercase dark:text-amber-300">
                  <AlarmClock className="h-3.5 w-3.5" /> Action needed
                </p>
                <p className="mt-1 text-[11.5px] leading-relaxed font-medium text-amber-900 dark:text-amber-100">
                  Invigilation roster is only 45% published and 3 papers are still with moderators. Exam cell needs your
                  sign-off by 22 September.
                </p>
              </div>
            </PanelCard>
          </div>

          {/* Collection + board results */}
          <div className="grid gap-5 lg:grid-cols-2">
            <PanelCard
              title="Fee collection"
              subtitle="Monthly collections in ₹ Lakh against target"
              icon={<BadgeIndianRupee className="h-4 w-4" />}
              action={<SectionLink label="Fees" onClick={() => setView('fees')} />}
            >
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.12em] text-ink-400 uppercase">September</p>
                  <p className="mt-1 text-[28px] leading-none font-extrabold tracking-[-0.045em] tabular text-ink-900 dark:text-white">
                    ₹{feeCollected.toFixed(1)} L
                  </p>
                </div>
                <Pill tone="emerald" icon={<TrendingUp className="h-3 w-3" />}>
                  +{collectionPct.toFixed(0)}% vs target
                </Pill>
              </div>
              <ChartFrame className="mt-3 h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={FEE_TRENDS} margin={{ top: 6, right: 4, bottom: 0, left: -26 }}>
                    <defs>
                      <linearGradient id="ovCollection" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="currentColor" strokeOpacity={0.16} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={AXIS_STYLE} tickMargin={8} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={AXIS_STYLE}
                      width={44}
                      tickFormatter={(v) => `₹${Number(v ?? 0)}L`}
                    />
                    <Tooltip content={<ChartTooltip formatter={(v) => `₹${v.toFixed(1)} Lakh`} />} />
                    <Area
                      type="monotone"
                      dataKey="collected"
                      name="Collected"
                      stroke="#2563EB"
                      strokeWidth={2.4}
                      fill="url(#ovCollection)"
                      animationDuration={900}
                    />
                    <Area
                      type="monotone"
                      dataKey="target"
                      name="Target"
                      stroke="#7C3AED"
                      strokeWidth={1.8}
                      strokeDasharray="4 4"
                      fill="none"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartFrame>
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {[
                  { k: 'Collected (YTD)', v: '₹3.13 Cr ' },
                  { k: 'Outstanding', v: `₹${collectionThisMonth.dues} L` },
                  { k: 'Defaulters', v: '46 families' },
                ].map((cell) => (
                  <div key={cell.k} className="rounded-xl border border-ink-200/70 px-2.5 py-2 dark:border-white/8">
                    <p className="text-[10px] font-semibold text-ink-400">{cell.k}</p>
                    <p className="mt-0.5 text-[12.5px] font-extrabold tabular text-ink-900 dark:text-white">{cell.v}</p>
                  </div>
                ))}
              </div>
            </PanelCard>

            <PanelCard
              title="Board results trajectory"
              subtitle="MPBSE Class 10 & 12 · five-year trend"
              icon={<GraduationCap className="h-4 w-4" />}
              action={<SectionLink label="Reports" onClick={() => setView('reports')} />}
            >
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { k: 'Pass rate', v: '100%', tone: 'emerald' as Tone },
                  { k: 'Average', v: '78.4%', tone: 'brand' as Tone },
                  { k: 'Distinctions', v: '62', tone: 'violet' as Tone },
                ].map((cell) => (
                  <div key={cell.k} className="rounded-xl border border-ink-200/70 px-2.5 py-2 dark:border-white/8">
                    <p className="text-[10px] font-semibold text-ink-400">{cell.k}</p>
                    <p className={cn('mt-0.5 text-[15px] font-extrabold tabular', TONES[cell.tone].text)}>{cell.v}</p>
                  </div>
                ))}
              </div>
              <ChartFrame className="mt-3 h-[132px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={BOARD_TREND} margin={{ top: 6, right: 4, bottom: 0, left: -28 }}>
                    <defs>
                      <linearGradient id="ovBoard" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.32} />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="currentColor" strokeOpacity={0.16} />
                    <XAxis dataKey="year" tickLine={false} axisLine={false} tick={AXIS_STYLE} tickMargin={8} />
                    <YAxis domain={[60, 100]} tickLine={false} axisLine={false} tick={AXIS_STYLE} width={44} />
                    <Tooltip content={<ChartTooltip suffix="%" formatter={(v) => `${v}%`} />} />
                    <Area
                      type="monotone"
                      dataKey="average"
                      name="Class average"
                      stroke="#7C3AED"
                      strokeWidth={2.4}
                      fill="url(#ovBoard)"
                      animationDuration={950}
                    />
                    <Area
                      type="monotone"
                      dataKey="pass"
                      name="Pass rate"
                      stroke="#10B981"
                      strokeWidth={2}
                      fill="none"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartFrame>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-400">
                Distinctions up from 34 (2021) to 62 (2025) — the Hindi-medium sections contributed 21 of them.
              </p>
            </PanelCard>
          </div>

          {/* Alerts + compliance + substitutions */}
          <div className="grid gap-5 lg:grid-cols-3">
            <PanelCard
              title="Campus alerts"
              subtitle={`${CAMPUS_ALERTS.length} open items`}
              icon={<ShieldAlert className="h-4 w-4" />}
            >
              <div className="space-y-2.5">
                {CAMPUS_ALERTS.map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-2xl border border-ink-200/70 px-3.5 py-3 transition-colors hover:border-ink-300 dark:border-white/8 dark:hover:border-white/16"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[12px] leading-snug font-bold text-ink-900 dark:text-white">{alert.title}</p>
                      <Pill tone={ALERT_TONE[alert.severity]} className="shrink-0 capitalize">
                        {alert.severity}
                      </Pill>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-ink-500 dark:text-ink-400">{alert.detail}</p>
                    <p className="mt-1 font-mono text-[10px] text-ink-400">
                      {alert.module} · {alert.at}
                    </p>
                  </div>
                ))}
              </div>
            </PanelCard>

            <PanelCard
              title="Statutory compliance"
              subtitle="MPBSE · UDISE+ · RTE calendar"
              icon={<CalendarClock className="h-4 w-4" />}
            >
              <div className="space-y-2.5">
                {COMPLIANCE_DEADLINES.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-2xl border border-ink-200/70 px-3.5 py-3 dark:border-white/8"
                  >
                    <span
                      className={cn(
                        'grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[11px] font-extrabold tabular',
                        item.days <= 3
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300'
                          : item.days <= 10
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300'
                            : 'bg-ink-100 text-ink-500 dark:bg-white/8 dark:text-ink-300',
                      )}
                    >
                      {item.days}d
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-bold text-ink-900 dark:text-white">{item.label}</p>
                      <p className="text-[11px] text-ink-500 dark:text-ink-400">
                        Due {item.due} · {item.owner}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="mt-3.5 w-full"
                onClick={() =>
                  pushToast({
                    tone: 'info',
                    title: 'Compliance digest emailed',
                    description: 'MPBSE and UDISE+ deadlines sent to the office and exam cell.',
                  })
                }
              >
                Email deadline digest
              </Button>
            </PanelCard>

            <PanelCard
              title="Substitutions today"
              subtitle={unconfirmedSubs ? `${unconfirmedSubs} classes still need a teacher` : 'All periods covered'}
              icon={<CalendarDays className="h-4 w-4" />}
              action={<SectionLink label="Staff" onClick={() => setView('staff')} />}
            >
              <div className="space-y-2.5">
                {substitutions.map((sub) => (
                  <div key={sub.id} className="rounded-2xl border border-ink-200/70 px-3.5 py-3 dark:border-white/8">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10.5px] font-bold text-ink-400">{sub.slot}</span>
                      {sub.confirmed ? (
                        <Pill tone="emerald" dot>
                          Covered
                        </Pill>
                      ) : (
                        <Pill tone="amber" dot>
                          Pending
                        </Pill>
                      )}
                    </div>
                    <p className="mt-1 text-[12px] font-bold text-ink-900 dark:text-white">
                      {sub.className} · {sub.subject}
                    </p>
                    <p className="text-[11px] text-ink-500 dark:text-ink-400">
                      {sub.absent} → {sub.substitute}
                    </p>
                  </div>
                ))}
              </div>
            </PanelCard>
          </div>
        </div>

        {/* ---------------- Right rail ---------------- */}
        <div className="space-y-5">
          <PanelCard
            title="Approvals waiting"
            subtitle={approvals.length ? 'Oldest request is 5 days old' : 'Inbox clear'}
            icon={<ClipboardList className="h-4 w-4" />}
            action={<SectionLink label="Open" onClick={() => setView('approvals')} />}
          >
            <div className="space-y-2.5">
              {approvals.slice(0, 4).map((a) => (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="rounded-2xl border border-ink-200/70 bg-white/70 p-3.5 dark:border-white/8 dark:bg-white/[0.03]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Pill tone={a.kind === 'Purchase' ? 'violet' : a.kind === 'Leave' ? 'brand' : 'slate'}>
                      {a.kind}
                    </Pill>
                    <PriorityPill priority={a.priority} />
                  </div>
                  <p className="mt-2 text-[12px] leading-snug font-bold text-ink-900 dark:text-white">{a.requester}</p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-ink-500 dark:text-ink-400">
                    {a.detail}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-ink-400">{a.sla}</span>
                    {canApprove ? (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            decideApproval(a.id, 'approved')
                            pushToast({
                              tone: 'success',
                              title: `${a.kind} approved`,
                              description: `${a.requester} notified · audit entry recorded.`,
                            })
                          }}
                          className="press rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white transition-colors hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            decideApproval(a.id, 'rejected')
                            pushToast({
                              tone: 'warning',
                              title: `${a.kind} returned`,
                              description: `${a.requester} asked to resubmit with remarks.`,
                            })
                          }}
                          className="press rounded-lg border border-ink-200 px-2.5 py-1 text-[11px] font-bold text-ink-600 transition-colors hover:border-rose-300 hover:text-rose-600 dark:border-white/12 dark:text-ink-300"
                        >
                          Return
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10.5px] font-semibold text-ink-400">View only</span>
                    )}
                  </div>
                </motion.div>
              ))}
              {approvals.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-emerald-300/70 bg-emerald-50/60 px-4 py-7 text-center dark:border-emerald-500/25 dark:bg-emerald-500/10">
                  <PackageCheck className="mx-auto h-7 w-7 text-emerald-500" />
                  <p className="mt-2 text-[13px] font-bold text-emerald-900 dark:text-emerald-200">Inbox zero</p>
                  <p className="mt-1 text-[11.5px] text-emerald-700/80 dark:text-emerald-200/70">
                    Every pending request has been decided.
                  </p>
                </div>
              ) : null}
            </div>
          </PanelCard>

          <PanelCard
            title="Notes & memo board"
            subtitle={`${notes.filter((n) => n.pinned).length} pinned · visible to you and your office staff`}
            icon={<StickyNote className="h-4 w-4" />}
            action={<SectionLink label="New" onClick={() => setNoteComposer(true)} />}
          >
            <div className="space-y-2.5">
              <AnimatePresence initial={false}>
                {[...notes]
                  .sort((a, b) => Number(b.pinned) - Number(a.pinned))
                  .slice(0, 4)
                  .map((note) => (
                    <motion.div
                      key={note.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className={cn('group rounded-2xl border p-3.5', NOTE_TONES[note.tone].card)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[12.5px] leading-snug font-bold text-ink-900 dark:text-white">
                          {note.title}
                        </p>
                        <div className="flex shrink-0 items-center gap-0.5">
                          <button
                            onClick={() => togglePinNote(note.id)}
                            aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
                            className={cn(
                              'press grid h-6 w-6 place-items-center rounded-md transition-colors',
                              note.pinned
                                ? 'text-brand-600 dark:text-brand-300'
                                : 'text-ink-400 hover:text-ink-700 dark:hover:text-white',
                            )}
                          >
                            <Pin className={cn('h-3.5 w-3.5', note.pinned && 'fill-current')} />
                          </button>
                          <button
                            onClick={() => deleteNote(note.id)}
                            aria-label="Delete note"
                            className="press grid h-6 w-6 place-items-center rounded-md text-ink-400 opacity-0 transition-all hover:text-rose-500 group-hover:opacity-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="mt-1.5 line-clamp-3 text-[11.5px] leading-relaxed text-ink-600 dark:text-ink-300">
                        {note.body}
                      </p>
                      <p className="mt-2 text-[10px] font-semibold text-ink-400">
                        {note.author} · {note.updatedAt}
                      </p>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
            <button
              onClick={() => setView('reviews')}
              className="press mt-3 w-full rounded-xl border border-dashed border-ink-300 py-2 text-[11.5px] font-bold text-ink-500 transition-colors hover:border-brand-400 hover:text-brand-600 dark:border-white/12 dark:text-ink-400"
            >
              Open full workspace · {notes.length} notes
            </button>
          </PanelCard>

          <PanelCard
            title="Parent voice"
            subtitle={`${feedback.length} reviews this month · ${concerns} need action`}
            icon={<MessageSquareQuote className="h-4 w-4" />}
            action={<SectionLink label="Reviews" onClick={() => setView('reviews')} />}
          >
            <div className="flex items-center gap-4 rounded-2xl border border-ink-200/70 bg-ink-50/70 px-4 py-3 dark:border-white/8 dark:bg-white/[0.03]">
              <div>
                <p className="text-[26px] leading-none font-extrabold tracking-[-0.04em] tabular text-ink-900 dark:text-white">
                  {feedbackAvg.toFixed(1)}
                </p>
                <RatingStars rating={Math.round(feedbackAvg)} />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                {(['positive', 'neutral', 'concern'] as const).map((s) => {
                  const count = feedback.filter((f) => f.sentiment === s).length
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <span className="w-[74px] shrink-0 text-[10.5px] font-semibold capitalize text-ink-500 dark:text-ink-400">
                        {s === 'concern' ? 'concern' : s}
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-200/70 dark:bg-white/10">
                        <motion.div
                          className={cn(
                            'h-full rounded-full',
                            s === 'positive' ? 'bg-emerald-500' : s === 'neutral' ? 'bg-ink-400' : 'bg-amber-500',
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / feedback.length) * 100}%` }}
                          transition={{ duration: 0.7 }}
                        />
                      </div>
                      <span className="w-4 shrink-0 text-right text-[10.5px] font-bold tabular text-ink-700 dark:text-ink-200">
                        {count}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="mt-3 space-y-2.5">
              {feedback.slice(0, 2).map((f) => (
                <div key={f.id} className="rounded-2xl border border-ink-200/70 p-3.5 dark:border-white/8">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[12px] font-bold text-ink-900 dark:text-white">{f.parent}</p>
                    <RatingStars rating={f.rating} size={3} />
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-ink-500 dark:text-ink-400">
                    {f.text}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <SentimentPill sentiment={f.sentiment} />
                    <span className="text-[10px] text-ink-400">
                      {f.topic} · {f.at}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {canReview ? (
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-violet-accent-100 bg-violet-accent-50/70 px-3.5 py-2.5 dark:border-violet-accent-400/25 dark:bg-violet-accent-500/10">
                <span className="text-[11.5px] font-semibold text-violet-accent-800 dark:text-violet-accent-400">
                  {pendingPlans} lesson plans await review
                </span>
                <button
                  onClick={() => setView('reviews')}
                  className="press text-[11.5px] font-bold text-violet-accent-700 underline decoration-violet-accent-300 underline-offset-4 dark:text-violet-accent-400"
                >
                  Review now
                </button>
              </div>
            ) : null}
          </PanelCard>

          <PanelCard
            title="Principal’s day"
            subtitle="Seven engagements scheduled"
            icon={<CalendarClock className="h-4 w-4" />}
          >
            <div className="relative space-y-3.5 pl-1">
              <span className="absolute top-2 bottom-3 left-[5px] w-px bg-ink-200 dark:bg-white/10" />
              {PRINCIPAL_DAY.map((slot, i) => (
                <motion.div
                  key={slot.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative flex gap-3.5"
                >
                  <span
                    className={cn(
                      'relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-white dark:ring-ink-900',
                      TONES[slot.tone].dot,
                    )}
                  />
                  <div className="min-w-0">
                    <p className="font-mono text-[10.5px] font-bold text-ink-400">{slot.time}</p>
                    <p className="text-[12px] leading-snug font-bold text-ink-900 dark:text-white">{slot.title}</p>
                    <p className="text-[10.5px] text-ink-500 dark:text-ink-400">{slot.place}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </PanelCard>

          <PanelCard
            title="Birthdays & announcements"
            subtitle="Read out in tomorrow’s assembly"
            icon={<Cake className="h-4 w-4" />}
          >
            <div className="space-y-2.5">
              {BIRTHDAYS.map((b) => (
                <div
                  key={b.id}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border px-3.5 py-2.5',
                    b.when === 'Today'
                      ? 'border-amber-200/80 bg-amber-50/70 dark:border-amber-500/25 dark:bg-amber-500/10'
                      : 'border-ink-200/70 dark:border-white/8',
                  )}
                >
                  <Avatar name={b.name} tone={b.kind === 'staff' ? 2 : 0} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-bold text-ink-900 dark:text-white">{b.name}</p>
                    <p className="truncate text-[10.5px] text-ink-500 dark:text-ink-400">{b.meta}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Pill tone={b.when === 'Today' ? 'amber' : 'slate'}>{b.when}</Pill>
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard title="Sick bay log" subtitle="Today’s visits" icon={<HeartPulse className="h-4 w-4" />}>
            <div className="space-y-2.5">
              {SICK_BAY.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-start gap-3 rounded-2xl border border-ink-200/70 px-3.5 py-2.5 dark:border-white/8"
                >
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-500 dark:bg-rose-500/15 dark:text-rose-300">
                    <HeartPulse className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-ink-900 dark:text-white">
                      {visit.student} <span className="font-medium text-ink-400">· {visit.className}</span>
                    </p>
                    <p className="text-[11px] text-ink-500 dark:text-ink-400">{visit.issue}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Pill tone={visit.status === 'Sent home' ? 'amber' : 'emerald'}>{visit.status}</Pill>
                    <p className="mt-1 font-mono text-[10px] text-ink-400">{visit.at}</p>
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard title="Transport & safety" subtitle="22 routes · live status" icon={<Bus className="h-4 w-4" />}>
            <div className="space-y-2.5">
              {[
                { label: 'Route 7 · Kolar Road', status: 'Delayed 12 min', tone: 'amber' as Tone },
                { label: 'Route 12 · Ayodhya Bypass', status: 'On time', tone: 'emerald' as Tone },
                { label: 'Route 19 · MP Nagar', status: 'On time', tone: 'emerald' as Tone },
                { label: 'Route 4 · Shahpura', status: 'Driver KYC renewal due', tone: 'rose' as Tone },
              ].map((route) => (
                <div
                  key={route.label}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-ink-200/70 px-3.5 py-2.5 dark:border-white/8"
                >
                  <span className="truncate text-[11.5px] font-semibold text-ink-700 dark:text-ink-200">
                    {route.label}
                  </span>
                  <Pill tone={route.tone} dot className="shrink-0">
                    {route.status}
                  </Pill>
                </div>
              ))}
            </div>
            <div className="mt-3.5 flex items-center gap-2.5 rounded-2xl border border-ink-200/70 bg-ink-50/70 p-3.5 dark:border-white/8 dark:bg-white/[0.03]">
              <Lightbulb className="h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-[11px] leading-relaxed font-medium text-ink-600 dark:text-ink-300">
                46 students on Route 7 change timing from 20 Sep — the circular is scheduled and parents are already
                notified in the app.
              </p>
            </div>
          </PanelCard>
        </div>
      </div>

      {/* ---------------- School snapshot strip ---------------- */}
      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-200/70 pb-4 dark:border-white/8">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-violet-accent-600 text-white">
            <Activity className="h-4.5 w-4.5" />
          </span>
          <div className="flex-1">
            <p className="text-[13.5px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">{SCHOOL.name}</p>
            <p className="text-[11.5px] text-ink-500 dark:text-ink-400">
              {SCHOOL.affiliation} · {SCHOOL.medium} · {SCHOOL.campus}
            </p>
          </div>
          <Pill tone="brand">{SCHOOL.students.toLocaleString('en-IN')} students</Pill>
          <Pill tone="violet">{SCHOOL.staff} staff</Pill>
          <Pill tone="emerald" dot>
            Session {SCHOOL.session} active
          </Pill>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: 'Sections running', v: '51', s: 'Nursery to Class 12' },
            { k: 'Teacher : student', v: '1 : 24', s: 'RTE norm is 1 : 30' },
            { k: 'Transport fleet', v: '34 buses', s: '1,211 students on route' },
            { k: 'Campus infrastructure', v: '6 blocks', s: '2 labs, library, sick bay' },
          ].map((cell) => (
            <div key={cell.k} className="rounded-2xl border border-ink-200/70 px-4 py-3.5 dark:border-white/8">
              <p className="text-[10.5px] font-bold tracking-[0.1em] text-ink-400 uppercase">{cell.k}</p>
              <p className="mt-1 text-[19px] leading-none font-extrabold tracking-[-0.03em] tabular text-ink-900 dark:text-white">
                {cell.v}
              </p>
              <p className="mt-1 text-[11px] text-ink-400">{cell.s}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <p className="text-[11.5px] font-semibold text-ink-500 dark:text-ink-400">Quick jumps:</p>
          {(
            [
              ['Approvals', 'approvals'],
              ['Notices', 'notices'],
              ['Staff & duty', 'staff'],
              ['Reviews', 'reviews'],
              ['Analytics', 'analytics'],
            ] as const
          ).map(([label, view]) => (
            <button
              key={view}
              onClick={() => setView(view)}
              className="press rounded-xl border border-ink-200/80 px-3 py-1.5 text-[11.5px] font-bold text-ink-600 transition-colors hover:border-brand-400 hover:text-brand-700 dark:border-white/10 dark:text-ink-300 dark:hover:border-brand-500/40 dark:hover:text-brand-300"
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      <TaskComposer open={taskComposer} onClose={() => setTaskComposer(false)} onSubmit={addTask} />
      <NoteComposer open={noteComposer} onClose={() => setNoteComposer(false)} onSubmit={addNote} />
      <NotesEditor notes={notes} onUpdate={updateNote} />
      <p className="pb-14 text-[11px] text-ink-400">
        {notices.length} circulars published this session · {Object.keys(staffDuty).length} staff on the duty roster ·
        data refreshes every 60 seconds in production
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
function TaskComposer({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: ReturnType<typeof useApp>['addTask']
}) {
  const { pushToast } = useApp()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high')
  const [category, setCategory] = useState<'Academics' | 'Finance' | 'Discipline' | 'Admin' | 'Parents' | 'Events'>(
    'Academics',
  )
  const [assignee, setAssignee] = useState('You')
  const [due, setDue] = useState('Today, 5:00 pm')

  const submit = () => {
    onSubmit({ title, priority, category, assignee, due })
    pushToast({
      tone: 'success',
      title: 'Task added to today’s board',
      description: `${priority.toUpperCase()} · ${category} · ${due}`,
    })
    setTitle('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a task"
      description="Tasks appear on your command centre and are shared with the assignee."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={title.trim().length < 3} onClick={submit} icon={<Plus className="h-4 w-4" />}>
            Add task
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-bold text-ink-700 dark:text-ink-200">Task</label>
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Verify Class 9 attendance registers with the SMC"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[12.5px] font-bold text-ink-700 dark:text-ink-200">Priority</label>
            <Select value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-bold text-ink-700 dark:text-ink-200">Category</label>
            <Select value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
              {['Academics', 'Finance', 'Discipline', 'Admin', 'Parents', 'Events'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-bold text-ink-700 dark:text-ink-200">Assignee</label>
            <Select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
              {[
                'You',
                'Exam cell',
                'Head clerk',
                'Class teachers',
                'Transport cell',
                'Accounts office',
                'Coordinator',
              ].map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-bold text-ink-700 dark:text-ink-200">Due</label>
            <Select value={due} onChange={(e) => setDue(e.target.value)}>
              {['Today, 8:15 am', 'Today, 1:00 pm', 'Today, 5:00 pm', 'Tomorrow, 11:00 am', '20 Sep', '22 Sep'].map(
                (d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ),
              )}
            </Select>
          </div>
        </div>
      </div>
    </Modal>
  )
}

function NoteComposer({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: ReturnType<typeof useApp>['addNote']
}) {
  const { pushToast } = useApp()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tone, setTone] = useState<NoteTone>('brand')

  const submit = () => {
    onSubmit({ title, body, tone })
    pushToast({ tone: 'success', title: 'Note saved', description: 'Pinned to your memo board for the day.' })
    setTitle('')
    setBody('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New note"
      description="Quick memos, meeting points and follow-ups — private to your account."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={title.trim().length < 2} onClick={submit}>
            Save note
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-bold text-ink-700 dark:text-ink-200">Title</label>
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Points for the staff meeting"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12.5px] font-bold text-ink-700 dark:text-ink-200">Note</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            placeholder="Write the details here…"
            className="ring-focus w-full resize-none rounded-xl border border-ink-200 bg-white px-3.5 py-3 text-sm font-medium text-ink-900 shadow-sm placeholder:font-normal placeholder:text-ink-400 dark:border-white/12 dark:bg-white/[0.05] dark:text-white"
          />
        </div>
        <div>
          <p className="mb-2 text-[12.5px] font-bold text-ink-700 dark:text-ink-200">Colour</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(NOTE_TONES) as NoteTone[]).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                aria-label={`${NOTE_TONES[t].label} note`}
                className={cn(
                  'press h-8 w-8 rounded-xl border-2 transition-transform',
                  NOTE_TONES[t].chip,
                  tone === t
                    ? 'scale-110 border-ink-900 dark:border-white'
                    : 'border-transparent opacity-70 hover:opacity-100',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

/** Inline editor used by the reviews workspace; kept here so notes editing stays in one place. */
function NotesEditor({
  notes,
  onUpdate,
}: {
  notes: ReturnType<typeof useApp>['notes']
  onUpdate: ReturnType<typeof useApp>['updateNote']
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  return (
    <Modal
      open={Boolean(editingId)}
      onClose={() => setEditingId(null)}
      title="Edit note"
      description="Changes save to your memo board immediately."
    >
      {notes
        .filter((n) => n.id === editingId)
        .map((note) => (
          <div key={note.id} className="space-y-4">
            <Input
              defaultValue={note.title}
              onChange={(e) => onUpdate(note.id, { title: e.target.value })}
              className="font-bold"
            />
            <textarea
              defaultValue={note.body}
              onChange={(e) => onUpdate(note.id, { body: e.target.value })}
              rows={6}
              className="ring-focus w-full resize-none rounded-xl border border-ink-200 bg-white px-3.5 py-3 text-sm text-ink-900 dark:border-white/12 dark:bg-white/[0.05] dark:text-white"
            />
          </div>
        ))}
    </Modal>
  )
}
