import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarDays,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  Radio,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Thermometer,
  TrendingDown,
  UserX,
  Users,
  X,
} from 'lucide-react'
import { Card, CardHeader, Eyebrow } from '../../ui/Card'
import { Pill, type Tone } from '../../ui/Badge'
import { Button, IconButton } from '../../ui/Button'
import { Avatar, Input, Segmented } from '../../ui/Form'
import { SkeletonChart, SkeletonList } from '../../ui/Skeleton'
import { ATTENDANCE_HISTORY, STUDENTS, type AttendanceMark } from '../../../data/school'
import { useApp, useSimulatedLoad } from '../../../state/store'
import { cn, formatDate } from '../../../lib/utils'

// `startDow` is the Monday-based weekday index of the 1st (Mon = 0) — read
// straight off the 2026 calendar so the matrix lines up with the real dates.
const MONTHS = [
  { id: 3, label: 'April 2026', days: 30, startDow: 2 },
  { id: 4, label: 'May 2026', days: 31, startDow: 4 },
  { id: 5, label: 'June 2026', days: 30, startDow: 0 },
  { id: 6, label: 'July 2026', days: 31, startDow: 2 },
  { id: 7, label: 'August 2026', days: 31, startDow: 5 },
  { id: 8, label: 'September 2026', days: 30, startDow: 1 },
]

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function heatClass(rate: number, holiday: boolean) {
  if (holiday) return 'bg-ink-100/70 dark:bg-white/[0.03] text-ink-300 dark:text-ink-600'
  if (rate >= 96) return 'bg-emerald-600/90 text-white'
  if (rate >= 92) return 'bg-emerald-500/75 text-white'
  if (rate >= 88) return 'bg-amber-400/80 text-amber-950'
  if (rate >= 82) return 'bg-orange-400/80 text-orange-950'
  return 'bg-rose-500/85 text-white'
}

const MARK_TONE: Record<AttendanceMark, Tone> = { present: 'emerald', late: 'amber', absent: 'rose' }

export function AttendanceView() {
  const {
    attendance,
    setAttendanceMark,
    bulkAttendance,
    attendanceReset,
    pushToast,
    role,
    setBiometricModalOpen,
    setWhatsAppModalOpen,
    setWhatsAppInvoice,
  } = useApp()
  const [aiScanning, setAiScanning] = useState(false)
  const [monthIdx, setMonthIdx] = useState(5)
  const [selected, setSelected] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | AttendanceMark>('all')
  const loading = useSimulatedLoad(monthIdx, 560)
  const readOnly = !role.views.includes('attendance') || role.id === 'parent'

  // Command palette → “Mark whole class present” (fired once this view mounts).
  useEffect(() => {
    const handler = () => {
      bulkAttendance('present')
      pushToast({
        tone: 'success',
        title: 'Whole class marked present',
        description: 'All 24 students of XII-B set to present.',
      })
    }
    document.addEventListener('svm:bulk-present', handler)
    return () => document.removeEventListener('svm:bulk-present', handler)
  }, [bulkAttendance, pushToast])

  const month = MONTHS[monthIdx]
  const byDate = useMemo(() => Object.fromEntries(ATTENDANCE_HISTORY.map((d) => [d.date, d])), [])
  const monthPrefix = `2026-${String(month.id + 1).padStart(2, '0')}`

  const monthStats = useMemo(() => {
    const days = ATTENDANCE_HISTORY.filter((d) => d.date.startsWith(monthPrefix) && !d.holiday)
    const present = days.reduce((a, d) => a + d.present, 0)
    const late = days.reduce((a, d) => a + d.late, 0)
    const absent = days.reduce((a, d) => a + d.absent, 0)
    const total = present + late + absent
    return {
      days: days.length,
      present,
      late,
      absent,
      rate: total ? ((present + late) / total) * 100 : 0,
      worst: days
        .slice()
        .sort((a, b) => a.present / (a.present + a.late + a.absent) - b.present / (b.present + b.late + b.absent))[0],
    }
  }, [monthPrefix])

  const selectedDay = selected ? byDate[selected] : null

  const counts = useMemo(() => {
    const values = Object.values(attendance)
    return {
      present: values.filter((v) => v === 'present').length,
      late: values.filter((v) => v === 'late').length,
      absent: values.filter((v) => v === 'absent').length,
    }
  }, [attendance])

  const rate = ((counts.present + counts.late) / STUDENTS.length) * 100

  const visibleStudents = useMemo(
    () =>
      STUDENTS.filter((s) => {
        const matchesQuery = s.name.toLowerCase().includes(query.trim().toLowerCase())
        const matchesFilter = filter === 'all' || attendance[s.id] === filter
        return matchesQuery && matchesFilter
      }),
    [attendance, filter, query],
  )

  const belowNorm = STUDENTS.filter((s) => s.attendancePct < 75)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>
            <CalendarDays className="h-3.5 w-3.5" /> Attendance intelligence
          </Eyebrow>
          <h1 className="mt-2.5 text-[clamp(1.6rem,3vw,2.15rem)] leading-tight font-extrabold tracking-[-0.04em] text-ink-900 dark:text-white">
            Heatmap & daily register
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500 dark:text-ink-400">
            Six months of section XII-B history, alongside today’s live register.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            icon={<Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />}
            onClick={() => setBiometricModalOpen(true)}
          >
            RFID Gate Terminal
          </Button>
          <Pill tone={rate >= 90 ? 'emerald' : rate >= 80 ? 'amber' : 'rose'} dot>
            Today at {rate.toFixed(1)}%
          </Pill>
          <Pill tone="rose">{belowNorm.length} below MPBSE 75%</Pill>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Section average',
            value: `${monthStats.rate.toFixed(1)}%`,
            sub: `${monthStats.days} working days in ${month.label.split(' ')[0]}`,
            icon: Thermometer,
            tone: 'brand' as Tone,
          },
          {
            label: 'Present marks',
            value: monthStats.present.toLocaleString('en-IN'),
            sub: 'Across the month',
            icon: Users,
            tone: 'emerald' as Tone,
          },
          {
            label: 'Late arrivals',
            value: monthStats.late.toString(),
            sub: 'After the 08:15 bell',
            icon: Clock3,
            tone: 'amber' as Tone,
          },
          {
            label: 'Absences',
            value: monthStats.absent.toString(),
            sub: 'Unexplained only',
            icon: UserX,
            tone: 'rose' as Tone,
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="surface lift rounded-3xl p-4.5 hover:border-brand-300/60 dark:hover:border-brand-500/30"
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  'grid h-8.5 w-8.5 place-items-center rounded-xl',
                  s.tone === 'brand'
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300'
                    : s.tone === 'emerald'
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300'
                      : s.tone === 'amber'
                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
                )}
              >
                <s.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3.5 text-[11.5px] font-semibold text-ink-500 dark:text-ink-400">{s.label}</p>
            <p className="mt-0.5 text-[22px] leading-none font-extrabold tracking-[-0.04em] tabular text-ink-900 dark:text-white">
              {s.value}
            </p>
            <p className="mt-1.5 text-[11px] text-ink-400">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* AI Attendance Insights & Dropout Warning Banner */}
      <div className="rounded-2xl border border-purple-200/80 bg-gradient-to-r from-purple-50/80 via-white to-pink-50/60 p-4 shadow-xs dark:border-purple-500/20 dark:from-purple-950/30 dark:via-ink-900 dark:to-pink-950/20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
              <Sparkles className="h-4.5 w-4.5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-ink-900 dark:text-white">
                  AI Attendance Pattern Radar · Early Dropout Prevention
                </span>
                <Pill tone="rose" className="text-[10px] py-0.5">
                  {belowNorm.length} Students At Risk
                </Pill>
              </div>
              <p className="mt-0.5 text-[12px] leading-relaxed text-ink-600 dark:text-ink-300">
                Machine learning identified 3 students with Monday absenteeism patterns falling below the 75% CBSE norm.
                Proactive WhatsApp alerts can be broadcast with 1-click.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              loading={aiScanning}
              icon={<Sparkles className="h-3.5 w-3.5 text-purple-600" />}
              onClick={() => {
                setAiScanning(true)
                setTimeout(() => {
                  setAiScanning(false)
                  pushToast({
                    tone: 'success',
                    title: 'AI Scan complete',
                    description: 'No new attendance anomalies detected for Section XII-B.',
                  })
                }, 1000)
              }}
            >
              Scan Patterns
            </Button>
            <Button
              size="sm"
              variant="primary"
              icon={<Send className="h-3.5 w-3.5" />}
              className="bg-purple-600 hover:bg-purple-700 shadow-sm text-white"
              onClick={() => {
                setWhatsAppInvoice({
                  id: 'INV-ATTN-BULK',
                  studentId: 's-bulk',
                  studentName: 'Aarav Sharma & 2 others',
                  classId: 'Class XII-B',
                  term: 'Term 2 (Attendance Notice)',
                  heads: [{ label: 'Tuition', amount: 42500 }],
                  amount: 42500,
                  dueDate: '2026-09-20',
                  status: 'overdue',
                })
                setWhatsAppModalOpen(true)
              }}
            >
              WhatsApp At-Risk Parents
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        {/* Heatmap */}
        <Card className="p-5 sm:p-6">
          <CardHeader
            compact
            title="Monthly attendance heatmap"
            subtitle="Section XII-B · colour intensity maps to daily attendance rate"
            right={
              <div className="flex items-center gap-1">
                <IconButton
                  label="Previous month"
                  onClick={() => setMonthIdx((m) => Math.max(0, m - 1))}
                  disabled={monthIdx === 0}
                  className="h-9 w-9 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </IconButton>
                <span className="w-[104px] text-center text-[12.5px] font-bold text-ink-800 dark:text-ink-100">
                  {month.label.split(' ')[0]}
                </span>
                <IconButton
                  label="Next month"
                  onClick={() => setMonthIdx((m) => Math.min(MONTHS.length - 1, m + 1))}
                  disabled={monthIdx === MONTHS.length - 1}
                  className="h-9 w-9 disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </IconButton>
              </div>
            }
          />

          {loading ? (
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="skeleton aspect-square rounded-xl" />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={month.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-2">
                  {DOW.map((d) => (
                    <span
                      key={d}
                      className="text-center text-[10.5px] font-bold tracking-[0.08em] text-ink-400 uppercase"
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {Array.from({ length: month.startDow }).map((_, i) => (
                    <span key={`pad-${i}`} />
                  ))}
                  {Array.from({ length: month.days }).map((_, i) => {
                    const day = i + 1
                    const iso = `${monthPrefix}-${String(day).padStart(2, '0')}`
                    const rec = byDate[iso]
                    const holiday = !rec || rec.holiday
                    const total = rec ? rec.present + rec.late + rec.absent : 0
                    const dayRate = total ? ((rec!.present + rec!.late) / total) * 100 : 0
                    const isSelected = selected === iso
                    const isToday = iso === '2026-09-16'
                    return (
                      <motion.button
                        key={iso}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.008, duration: 0.28 }}
                        whileHover={holiday ? undefined : { scale: 1.06, zIndex: 5 }}
                        whileTap={holiday ? undefined : { scale: 0.94 }}
                        onClick={() => !holiday && setSelected(isSelected ? null : iso)}
                        title={
                          holiday
                            ? `${formatDate(iso)} · ${rec?.note ?? 'Holiday'}`
                            : `${formatDate(iso)} · ${dayRate.toFixed(1)}% present`
                        }
                        className={cn(
                          'relative grid aspect-square place-items-center rounded-xl text-[11.5px] font-bold tabular transition-colors',
                          heatClass(dayRate, holiday),
                          isSelected &&
                            'ring-2 ring-ink-900 ring-offset-2 ring-offset-white dark:ring-white dark:ring-offset-ink-900',
                          !holiday && 'cursor-pointer',
                        )}
                      >
                        {day}
                        {isToday ? (
                          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-white dark:ring-ink-900" />
                        ) : null}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Legend */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink-200/70 pt-4 dark:border-white/8">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-ink-400">Low</span>
              {['bg-rose-500/85', 'bg-orange-400/80', 'bg-amber-400/80', 'bg-emerald-500/75', 'bg-emerald-600/90'].map(
                (c) => (
                  <span key={c} className={cn('h-4 w-6 rounded-md', c)} />
                ),
              )}
              <span className="text-[11px] font-bold text-ink-400">High</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-ink-400">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-ink-100 dark:bg-white/[0.05]" /> Holiday
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-500" /> Today
              </span>
            </div>
          </div>

          <AnimatePresence>
            {selectedDay && !selectedDay.holiday ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-brand-200/80 bg-brand-50/70 p-4 dark:border-brand-500/25 dark:bg-brand-500/10">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold tracking-[-0.01em] text-brand-900 dark:text-brand-100">
                      {formatDate(selectedDay.date, {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="mt-0.5 text-[11.5px] font-medium text-brand-700/80 dark:text-brand-200/80">
                      {selectedDay.present} present · {selectedDay.late} late · {selectedDay.absent} absent of{' '}
                      {STUDENTS.length}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill tone="emerald" dot>
                      {(((selectedDay.present + selectedDay.late) / STUDENTS.length) * 100).toFixed(1)}% rate
                    </Pill>
                    <Pill tone="amber">{selectedDay.late} late</Pill>
                    <Pill tone="rose">{selectedDay.absent} absent</Pill>
                    <IconButton label="Close day detail" onClick={() => setSelected(null)} className="h-8 w-8">
                      <X className="h-3.5 w-3.5" />
                    </IconButton>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </Card>

        {/* Live register */}
        <Card className="flex flex-col p-5 sm:p-6">
          <CardHeader
            compact
            title="Live register · Class XII-B"
            subtitle={
              readOnly ? 'Read-only — outside your assigned scope' : 'Tap a state to mark; changes sync instantly'
            }
            right={
              <Pill tone={rate >= 90 ? 'emerald' : 'amber'} dot>
                {counts.present + counts.late}/{STUDENTS.length}
              </Pill>
            }
          />

          <div className="mb-3 h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              animate={{ width: `${rate}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="relative min-w-[150px] flex-1">
              <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search student…"
                className="h-9.5 pl-9 text-[12.5px]"
              />
            </div>
            <Segmented
              size="sm"
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: 'All' },
                { value: 'present', label: `${counts.present}` },
                { value: 'late', label: `${counts.late}` },
                { value: 'absent', label: `${counts.absent}` },
              ]}
            />
          </div>

          {role.views.includes('attendance') && role.id !== 'parent' ? (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                icon={<CheckCheck className="h-3.5 w-3.5" />}
                onClick={() => {
                  bulkAttendance('present')
                  pushToast({
                    tone: 'success',
                    title: 'All 24 marked present',
                    description: 'Class XII-B register submitted to the exam cell.',
                  })
                }}
              >
                Mark all present
              </Button>
              <Button
                size="sm"
                variant="ghost"
                icon={<RotateCcw className="h-3.5 w-3.5" />}
                onClick={() => {
                  attendanceReset()
                  pushToast({
                    tone: 'info',
                    title: 'Register reset',
                    description: 'Reverted to the seeded morning state.',
                  })
                }}
              >
                Reset
              </Button>
            </div>
          ) : null}

          {loading ? (
            <SkeletonList rows={6} />
          ) : visibleStudents.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
              <Filter className="h-8 w-8 text-ink-300 dark:text-ink-600" />
              <p className="mt-3 text-[13.5px] font-bold text-ink-800 dark:text-ink-100">No students match</p>
              <p className="mt-1 text-[12px] text-ink-500 dark:text-ink-400">
                Try a different name or clear the {filter} filter.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setQuery('')
                  setFilter('all')
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="max-h-[430px] min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
              {visibleStudents.map((s, i) => {
                const mark = attendance[s.id]
                return (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    className="flex items-center gap-3 rounded-2xl border border-ink-200/60 bg-white/60 px-3 py-2.5 transition-colors hover:border-ink-300 dark:border-white/8 dark:bg-white/[0.02] dark:hover:border-white/16"
                  >
                    <Avatar name={s.name} tone={s.tint} size={32} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
                        {s.name}
                      </p>
                      <p className="truncate text-[10.5px] text-ink-400">
                        Roll {s.roll} · {s.house} house · {s.attendancePct}% YTD
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-0.5 rounded-xl border border-ink-200/80 bg-ink-50/80 p-0.5 dark:border-white/10 dark:bg-white/[0.04]">
                      {(['present', 'late', 'absent'] as AttendanceMark[]).map((m) => {
                        const active = mark === m
                        return (
                          <button
                            key={m}
                            disabled={readOnly}
                            onClick={() => setAttendanceMark(s.id, m)}
                            title={`Mark ${s.name} ${m}`}
                            className={cn(
                              'press ring-focus relative h-7 w-7 rounded-lg text-[10px] font-bold uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50',
                              active
                                ? m === 'present'
                                  ? 'bg-emerald-500 text-white'
                                  : m === 'late'
                                    ? 'bg-amber-500 text-ink-900'
                                    : 'bg-rose-500 text-white'
                                : 'text-ink-400 hover:bg-white hover:text-ink-700 dark:hover:bg-white/10 dark:hover:text-white',
                            )}
                          >
                            {m[0].toUpperCase()}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-ink-200/70 pt-3.5 dark:border-white/8">
            <p className="text-[11px] font-semibold text-ink-400">
              Showing {visibleStudents.length} of {STUDENTS.length} students
            </p>
            <div className="flex items-center gap-2">
              <Pill tone={MARK_TONE.present} dot>
                {counts.present} P
              </Pill>
              <Pill tone={MARK_TONE.late} dot>
                {counts.late} L
              </Pill>
              <Pill tone={MARK_TONE.absent} dot>
                {counts.absent} A
              </Pill>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <CardHeader
          compact
          title="Chronic absenteeism watchlist"
          subtitle="Students below the MPBSE 75% promotion threshold · cumulative to date"
          right={
            <Pill tone="rose" icon={<TrendingDown className="h-3 w-3" />}>
              {belowNorm.length} flagged
            </Pill>
          }
        />
        {loading ? (
          <SkeletonChart height="h-[140px]" bars={0} />
        ) : belowNorm.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-ink-500">Nobody is below the threshold. Excellent term.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {belowNorm.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-rose-200/70 bg-rose-50/60 p-3.5 dark:border-rose-500/25 dark:bg-rose-500/10"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={s.name} tone={s.tint} size={34} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-bold text-ink-900 dark:text-white">{s.name}</p>
                    <p className="text-[11px] text-ink-500 dark:text-ink-400">Guardian · {s.guardian}</p>
                  </div>
                  <span className="text-[15px] font-extrabold tabular text-rose-600 dark:text-rose-400">
                    {s.attendancePct}%
                  </span>
                </div>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-rose-200/70 dark:bg-rose-500/20">
                  <motion.div
                    className="h-full rounded-full bg-rose-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${s.attendancePct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.06 }}
                  />
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      pushToast({
                        tone: 'warning',
                        title: `Guardian notified · ${s.guardian}`,
                        description: `SMS + email sent regarding ${s.name}’s ${s.attendancePct}% attendance.`,
                      })
                    }
                  >
                    Notify guardian
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
