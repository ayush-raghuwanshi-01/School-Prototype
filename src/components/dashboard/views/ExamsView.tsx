import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  Award,
  CalendarRange,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileSpreadsheet,
  Percent,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  Wand2,
} from 'lucide-react'
import { Card, CardHeader, Eyebrow } from '../../ui/Card'
import { Pill, type Tone } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { Avatar } from '../../ui/Form'
import { SkeletonTable } from '../../ui/Skeleton'
import { AXIS_STYLE, ChartFrame, ChartTooltip } from '../ChartKit'
import { EXAMS, STUDENTS, SUBJECTS, type Subject } from '../../../data/school'
import { useApp, useSimulatedLoad } from '../../../state/store'
import { average, cn, gradeFor, mulberry32 } from '../../../lib/utils'

const STATUS_TONE: Record<'ongoing' | 'completed' | 'scheduled', Tone> = {
  ongoing: 'emerald',
  completed: 'slate',
  scheduled: 'brand',
}

const GRADE_TONE: Record<string, string> = {
  A1: 'bg-emerald-500',
  A2: 'bg-emerald-400',
  B1: 'bg-brand-500',
  B2: 'bg-brand-400',
  C1: 'bg-amber-400',
  C2: 'bg-orange-400',
  D: 'bg-rose-500',
}

function scoreCellClass(score: number) {
  if (score >= 91) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/12 dark:text-emerald-300'
  if (score >= 81) return 'bg-emerald-50/70 text-emerald-700 dark:bg-emerald-500/8 dark:text-emerald-300'
  if (score >= 71) return 'bg-brand-50 text-brand-700 dark:bg-brand-500/12 dark:text-brand-300'
  if (score >= 61) return 'bg-ink-100 text-ink-700 dark:bg-white/8 dark:text-ink-200'
  if (score >= 51) return 'bg-amber-50 text-amber-700 dark:bg-amber-500/12 dark:text-amber-300'
  return 'bg-rose-50 text-rose-700 dark:bg-rose-500/12 dark:text-rose-300'
}

export function ExamsView() {
  const { marks, setMark, resetMarks, pushToast, role } = useApp()
  const [subjectId, setSubjectId] = useState<string>('all')
  const [simulating, setSimulating] = useState(false)
  const loading = useSimulatedLoad(subjectId, 620)
  const readOnly = role.id === 'parent'

  const scored = useMemo(() => {
    const subjectRows = STUDENTS.map((s) => {
      const values = SUBJECTS.map((sub) => marks[`${s.id}:${sub.id}`] ?? 0)
      const total = values.reduce((a, b) => a + b, 0)
      const percent = total / SUBJECTS.length
      return { student: s, values, total, percent }
    })
    const subjectAverages = SUBJECTS.map((sub) => ({
      subject: sub,
      avg: average(STUDENTS.map((s) => marks[`${s.id}:${sub.id}`] ?? 0)),
    }))
    const percents = subjectRows.map((r) => r.percent)
    const distribution = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D'].map((g) => ({
      grade: g as ReturnType<typeof gradeFor>,
      count: percents.filter((p) => gradeFor(p) === g).length,
    }))
    return {
      rows: subjectRows,
      subjectAverages,
      classAverage: average(percents),
      highest: Math.max(...percents),
      lowest: Math.min(...percents),
      passCount: percents.filter((p) => p >= 33).length,
      distinction: percents.filter((p) => p >= 75).length,
      distribution,
      topper: subjectRows.slice().sort((a, b) => b.percent - a.percent)[0],
      atRisk: subjectRows.filter((r) => r.percent < 50),
    }
  }, [marks])

  const chartData = useMemo(
    () =>
      scored.subjectAverages.map((s) => ({
        name: s.subject.name.split(' ')[0],
        average: Number(s.avg.toFixed(1)),
      })),
    [scored.subjectAverages],
  )

  const simulate = () => {
    setSimulating(true)
    const rnd = mulberry32(Math.floor(Math.random() * 9999))
    let i = 0
    const total = STUDENTS.length * SUBJECTS.length
    const interval = window.setInterval(() => {
      for (let k = 0; k < 6 && i < total; k += 1, i += 1) {
        const student = STUDENTS[Math.floor(i / SUBJECTS.length)]
        const subject = SUBJECTS[i % SUBJECTS.length]
        const base = 58 + (rnd() * 40 - 12)
        setMark(student.id, subject.id, Math.round(Math.max(31, Math.min(99, base))))
      }
      if (i >= total) {
        window.clearInterval(interval)
        setSimulating(false)
        pushToast({
          tone: 'success',
          title: 'Marks entry simulated',
          description: `${total} cells populated · class average now ${scored.classAverage.toFixed(1)}%`,
        })
      }
    }, 40)
  }

  const columns: Subject[] = subjectId === 'all' ? SUBJECTS : SUBJECTS.filter((s) => s.id === subjectId)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>
            <ClipboardCheck className="h-3.5 w-3.5" /> Assessment module
          </Eyebrow>
          <h1 className="mt-2.5 text-[clamp(1.6rem,3vw,2.15rem)] leading-tight font-extrabold tracking-[-0.04em] text-ink-900 dark:text-white">
            Exam schedule & marks entry
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500 dark:text-ink-400">
            Class XII-B · Mid-Term Examination in progress · enter marks and the class analytics recompute live.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Pill tone="emerald" dot>
            {scored.passCount}/{STUDENTS.length} passing
          </Pill>
          <Pill tone="violet">{scored.distinction} distinctions</Pill>
        </div>
      </div>

      {/* Exam schedule */}
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Card className="p-5">
          <CardHeader
            compact
            title="Examination calendar"
            subtitle="Session 2026–27 · Class XII-B"
            right={<CalendarRange className="h-4 w-4 text-ink-400" />}
          />
          <div className="space-y-2">
            {EXAMS.map((exam, i) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn(
                  'group flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3 transition-colors',
                  exam.status === 'ongoing'
                    ? 'border-emerald-300/80 bg-emerald-50/70 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                    : 'border-ink-200/70 bg-white/60 hover:border-ink-300 dark:border-white/8 dark:bg-white/[0.02] dark:hover:border-white/16',
                )}
              >
                <span
                  className={cn(
                    'grid h-9 w-9 shrink-0 place-items-center rounded-xl',
                    exam.status === 'ongoing'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-ink-100 text-ink-500 dark:bg-white/8 dark:text-ink-300',
                  )}
                >
                  {exam.status === 'ongoing' ? <Clock className="h-4 w-4" /> : <FileSpreadsheet className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
                    {exam.name}
                  </p>
                  <p className="text-[11.5px] text-ink-500 dark:text-ink-400">
                    {new Date(exam.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} –{' '}
                    {new Date(exam.endDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    · {exam.papers} papers
                  </p>
                </div>
                <Pill tone={STATUS_TONE[exam.status]} dot className="capitalize">
                  {exam.status}
                </Pill>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <CardHeader
            compact
            title="Class analytics"
            subtitle="Live recompute on every keypress"
            right={<Sparkles className="h-4 w-4 text-brand-500" />}
          />
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: 'Class average',
                value: `${scored.classAverage.toFixed(1)}%`,
                tone: 'brand' as Tone,
                icon: Percent,
              },
              { label: 'Highest', value: `${scored.highest.toFixed(1)}%`, tone: 'emerald' as Tone, icon: Award },
              { label: 'Lowest', value: `${scored.lowest.toFixed(1)}%`, tone: 'rose' as Tone, icon: Target },
              {
                label: 'Grade A1 / A2',
                value: `${scored.distribution[0].count + scored.distribution[1].count}`,
                tone: 'violet' as Tone,
                icon: TrendingUp,
              },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-ink-200/70 bg-ink-50/60 p-3.5 dark:border-white/8 dark:bg-white/[0.03]"
              >
                <div className="flex items-center gap-2">
                  <s.icon
                    className={cn(
                      'h-3.5 w-3.5',
                      s.tone === 'brand'
                        ? 'text-brand-600 dark:text-brand-400'
                        : s.tone === 'emerald'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : s.tone === 'rose'
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-violet-accent-600 dark:text-violet-accent-400',
                    )}
                  />
                  <p className="text-[10.5px] font-bold tracking-[0.1em] text-ink-400 uppercase">{s.label}</p>
                </div>
                <p className="mt-2 text-[20px] leading-none font-extrabold tracking-[-0.04em] tabular text-ink-900 dark:text-white">
                  {s.value}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-bold tracking-[0.12em] text-ink-400 uppercase">Grade distribution</p>
            <div className="mt-2.5 flex h-3 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
              {scored.distribution.map((d) => (
                <motion.span
                  key={d.grade}
                  className={cn('h-full', GRADE_TONE[d.grade])}
                  animate={{ width: `${(d.count / STUDENTS.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  title={`${d.grade}: ${d.count} students`}
                />
              ))}
            </div>
            <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
              {scored.distribution.map((d) => (
                <span
                  key={d.grade}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-500 dark:text-ink-400"
                >
                  <span className={cn('h-2 w-2 rounded-full', GRADE_TONE[d.grade])} />
                  {d.grade} · {d.count}
                </span>
              ))}
            </div>
          </div>

          <ChartFrame className="mt-5 h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="currentColor" strokeOpacity={0.16} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={AXIS_STYLE} tickMargin={8} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={AXIS_STYLE} width={40} />
                <Tooltip
                  cursor={{ fill: 'currentColor', fillOpacity: 0.06 }}
                  content={<ChartTooltip suffix="%" formatter={(v) => `${v.toFixed(1)}% avg`} />}
                />
                <Bar
                  dataKey="average"
                  name="Subject average"
                  radius={[6, 6, 3, 3]}
                  maxBarSize={40}
                  animationDuration={700}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        entry.average >= 80
                          ? '#10B981'
                          : entry.average >= 70
                            ? '#2563EB'
                            : entry.average >= 60
                              ? '#F59E0B'
                              : '#F43F5E'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Card>
      </div>

      {/* Marks matrix */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200/70 p-4 dark:border-white/8">
          <div>
            <h3 className="text-[15px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
              Marks entry matrix
            </h3>
            <p className="text-[12px] text-ink-500 dark:text-ink-400">
              Maximum marks 100 per paper · {readOnly ? 'read-only for your role' : 'click a cell and type a score'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-ink-200/80 bg-ink-100/70 p-1 scrollbar-none dark:border-white/10 dark:bg-white/[0.04]">
              <button
                onClick={() => setSubjectId('all')}
                className={cn(
                  'press relative shrink-0 rounded-xl px-3 py-1.5 text-[12px] font-bold transition-colors',
                  subjectId === 'all'
                    ? 'text-white'
                    : 'text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white',
                )}
              >
                {subjectId === 'all' ? (
                  <motion.span
                    layoutId="subject-pill"
                    className="absolute inset-0 rounded-xl bg-ink-900 dark:bg-brand-600"
                    transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                  />
                ) : null}
                <span className="relative z-10">All subjects</span>
              </button>
              {SUBJECTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSubjectId(s.id)}
                  className={cn(
                    'press relative shrink-0 rounded-xl px-3 py-1.5 text-[12px] font-bold transition-colors',
                    subjectId === s.id
                      ? 'text-white'
                      : 'text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white',
                  )}
                >
                  {subjectId === s.id ? (
                    <motion.span
                      layoutId="subject-pill"
                      className="absolute inset-0 rounded-xl bg-ink-900 dark:bg-brand-600"
                      transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                    />
                  ) : null}
                  <span className="relative z-10">{s.name}</span>
                </button>
              ))}
            </div>
            <Button
              size="sm"
              variant="outline"
              icon={<RotateCcw className="h-3.5 w-3.5" />}
              disabled={readOnly}
              onClick={() => {
                resetMarks()
                pushToast({
                  tone: 'info',
                  title: 'Marks reset',
                  description: 'Reverted to the seeded mid-term dataset.',
                })
              }}
            >
              Reset
            </Button>
            <Button
              size="sm"
              icon={<Wand2 className="h-3.5 w-3.5" />}
              loading={simulating}
              disabled={readOnly}
              onClick={simulate}
            >
              {simulating ? 'Simulating…' : 'Simulate entry'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-4">
            <SkeletonTable rows={8} cols={6} />
          </div>
        ) : (
          <div className="max-h-[560px] overflow-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-20">
                <tr className="border-b border-ink-200/70 bg-white/95 backdrop-blur-xl dark:border-white/8 dark:bg-ink-900/95">
                  <th className="sticky left-0 z-30 min-w-[220px] bg-white/95 px-4 py-3 text-left text-[10.5px] font-bold tracking-[0.12em] text-ink-400 uppercase backdrop-blur-xl dark:bg-ink-900/95">
                    Student
                  </th>
                  {columns.map((sub) => (
                    <th key={sub.id} className="px-2 py-2 text-center">
                      <span className="block text-[11.5px] font-bold tracking-[-0.01em] text-ink-700 dark:text-ink-200">
                        {sub.name}
                      </span>
                      <span className="block font-mono text-[10px] font-medium text-ink-400">
                        {sub.code} · {sub.teacher.split(' ').slice(-1)[0]}
                      </span>
                    </th>
                  ))}
                  <th className="px-3 py-3 text-center text-[10.5px] font-bold tracking-[0.12em] text-ink-400 uppercase">
                    Total
                  </th>
                  <th className="px-3 py-3 text-center text-[10.5px] font-bold tracking-[0.12em] text-ink-400 uppercase">
                    Agg. %
                  </th>
                  <th className="px-3 py-3 text-center text-[10.5px] font-bold tracking-[0.12em] text-ink-400 uppercase">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody>
                {scored.rows.map((row, ri) => {
                  const grade = gradeFor(row.percent)
                  return (
                    <motion.tr
                      key={row.student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(ri * 0.02, 0.3) }}
                      className="border-b border-ink-100 transition-colors last:border-0 hover:bg-ink-50/70 dark:border-white/5 dark:hover:bg-white/[0.03]"
                    >
                      <td className="sticky left-0 z-10 bg-white/95 px-4 py-2 backdrop-blur-xl dark:bg-ink-900/95">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={row.student.name} tone={row.student.tint} size={30} />
                          <div className="min-w-0">
                            <p className="truncate text-[12px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
                              {row.student.name}
                            </p>
                            <p className="font-mono text-[10px] text-ink-400">Roll {row.student.roll}</p>
                          </div>
                        </div>
                      </td>
                      {columns.map((sub) => {
                        const score = marks[`${row.student.id}:${sub.id}`] ?? 0
                        return (
                          <td key={sub.id} className="px-1.5 py-1.5 text-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={score}
                              readOnly={readOnly}
                              onChange={(e) => setMark(row.student.id, sub.id, Number(e.target.value))}
                              className={cn(
                                'ring-focus h-9 w-14 rounded-xl border border-transparent text-center text-[12.5px] font-bold tabular transition-all',
                                'hover:border-ink-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25 dark:hover:border-white/20',
                                scoreCellClass(score),
                                readOnly && 'cursor-not-allowed',
                              )}
                              aria-label={`${row.student.name} ${sub.name} marks`}
                            />
                          </td>
                        )
                      })}
                      <td className="px-3 py-2 text-center">
                        <motion.span
                          key={row.total}
                          initial={{ scale: 1.12, color: '#2563EB' }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="inline-block text-[12.5px] font-extrabold tabular text-ink-900 dark:text-white"
                        >
                          {row.total}
                        </motion.span>
                        <span className="text-[10.5px] text-ink-400">/{columns.length * 100}</span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className="text-[12.5px] font-bold tabular text-ink-700 dark:text-ink-200">
                          {row.percent.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <AnimatePresence mode="popLayout">
                          <motion.span
                            key={grade}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                              'inline-grid h-7 w-9 place-items-center rounded-lg text-[11.5px] font-extrabold text-white',
                              GRADE_TONE[grade],
                            )}
                          >
                            {grade}
                          </motion.span>
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
              <tfoot className="sticky bottom-0 z-20">
                <tr className="border-t border-ink-200 bg-ink-50/95 backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/95">
                  <td className="sticky left-0 z-30 bg-ink-50/95 px-4 py-3 text-[11px] font-bold tracking-[0.1em] text-ink-500 uppercase backdrop-blur-xl dark:bg-ink-900/95">
                    Subject average
                  </td>
                  {columns.map((sub) => {
                    const avg = scored.subjectAverages.find((s) => s.subject.id === sub.id)?.avg ?? 0
                    return (
                      <td key={sub.id} className="px-2 py-3 text-center">
                        <motion.span
                          key={avg}
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          className={cn(
                            'inline-block rounded-lg px-2 py-1 text-[12px] font-extrabold tabular',
                            scoreCellClass(avg),
                          )}
                        >
                          {avg.toFixed(1)}
                        </motion.span>
                      </td>
                    )
                  })}
                  <td className="px-3 py-3 text-center text-[12px] font-extrabold tabular text-ink-900 dark:text-white">
                    {(scored.classAverage * columns.length).toFixed(0)}
                  </td>
                  <td className="px-3 py-3 text-center text-[12px] font-extrabold tabular text-brand-700 dark:text-brand-300">
                    {scored.classAverage.toFixed(1)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={cn(
                        'inline-grid h-7 w-9 place-items-center rounded-lg text-[11.5px] font-extrabold text-white',
                        GRADE_TONE[gradeFor(scored.classAverage)],
                      )}
                    >
                      {gradeFor(scored.classAverage)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-200/70 px-4 py-3.5 dark:border-white/8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-500 dark:text-ink-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {STUDENTS.length} students · {SUBJECTS.length}{' '}
              papers · {(STUDENTS.length * SUBJECTS.length).toLocaleString('en-IN')} cells
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-500 dark:text-ink-400">
              <Award className="h-3.5 w-3.5 text-amber-500" /> Topper: {scored.topper?.student.name} (
              {scored.topper?.percent.toFixed(1)}%)
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {scored.atRisk.length > 0 ? (
              <Pill tone="rose" dot>
                {scored.atRisk.length} below 50% — review needed
              </Pill>
            ) : (
              <Pill tone="emerald" dot>
                No student below 50%
              </Pill>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                pushToast({
                  tone: 'success',
                  title: 'Marks submitted for moderation',
                  description: `Class XII-B · ${SUBJECTS.length} papers · awaiting principal sign-off.`,
                })
              }
            >
              Submit for moderation
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
