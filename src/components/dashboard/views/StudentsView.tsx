import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bus, ChevronRight, Grid2x2, Home, Mail, Phone, Rows3, Search, Users, UserSearch, Wallet } from 'lucide-react'
import { Card, Eyebrow } from '../../ui/Card'
import { FeePill, Pill, type Tone } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { Avatar, Input, ProgressBar, Segmented } from '../../ui/Form'
import { Drawer } from '../../ui/Overlay'
import { EmptyState, SkeletonList, SkeletonTable } from '../../ui/Skeleton'
import { STUDENTS, SUBJECTS, type Student } from '../../../data/school'
import { useApp, useSimulatedLoad } from '../../../state/store'
import { cn, gradeFor, inr } from '../../../lib/utils'

const HOUSE_TONE: Record<Student['house'], Tone> = {
  Ganga: 'brand',
  Yamuna: 'cyan',
  Kaveri: 'emerald',
  Godavari: 'violet',
}

export function StudentsView() {
  const { marks, attendance, invoices, pushToast } = useApp()
  const [query, setQuery] = useState('')
  const [layout, setLayout] = useState<'table' | 'grid'>('table')
  const [house, setHouse] = useState<'all' | Student['house']>('all')
  const [selected, setSelected] = useState<Student | null>(null)
  const loading = useSimulatedLoad(query, 480)

  useEffect(() => {
    const focus = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      const student = STUDENTS.find((s) => s.id === id)
      if (student) setSelected(student)
    }
    document.addEventListener('svm:focus-student', focus)
    return () => document.removeEventListener('svm:focus-student', focus)
  }, [])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return STUDENTS.filter((s) => {
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.guardian.toLowerCase().includes(q)
      const matchesHouse = house === 'all' || s.house === house
      return matchesQuery && matchesHouse
    })
  }, [house, query])

  const studentMarks = (s: Student) => SUBJECTS.map((sub) => marks[`${s.id}:${sub.id}`] ?? 0)

  const percent = (s: Student) => studentMarks(s).reduce((a, b) => a + b, 0) / SUBJECTS.length

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>
            <Users className="h-3.5 w-3.5" /> Student records
          </Eyebrow>
          <h1 className="mt-2.5 text-[clamp(1.6rem,3vw,2.15rem)] leading-tight font-extrabold tracking-[-0.04em] text-ink-900 dark:text-white">
            Directory · Class {STUDENTS[0].classId}-{STUDENTS[0].section}
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500 dark:text-ink-400">
            {STUDENTS.length} students enrolled · house system · transport and fee linkage.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Segmented
            value={layout}
            onChange={setLayout}
            options={[
              { value: 'table', label: 'Table', icon: <Rows3 className="h-3.5 w-3.5" /> },
              { value: 'grid', label: 'Cards', icon: <Grid2x2 className="h-3.5 w-3.5" /> },
            ]}
          />
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, admission number or guardian…"
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-ink-200/80 bg-ink-100/70 p-1 scrollbar-none dark:border-white/10 dark:bg-white/[0.04]">
            {(['all', 'Ganga', 'Yamuna', 'Kaveri', 'Godavari'] as const).map((h) => (
              <button
                key={h}
                onClick={() => setHouse(h)}
                className={cn(
                  'press relative shrink-0 rounded-xl px-3 py-1.5 text-[12px] font-bold capitalize transition-colors',
                  house === h
                    ? 'text-white'
                    : 'text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white',
                )}
              >
                {house === h ? (
                  <motion.span
                    layoutId="house-pill"
                    className="absolute inset-0 rounded-xl bg-ink-900 dark:bg-brand-600"
                    transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                  />
                ) : null}
                <span className="relative z-10">{h === 'all' ? 'All houses' : h}</span>
              </button>
            ))}
          </div>
          <Pill tone="brand">{rows.length} results</Pill>
        </div>
      </Card>

      {loading ? (
        <div className="p-1">
          {layout === 'table' ? <SkeletonTable rows={8} cols={5} /> : <SkeletonList rows={6} />}
        </div>
      ) : rows.length === 0 ? (
        <Card>
          <EmptyState
            icon={<UserSearch className="h-6 w-6" />}
            title="No students found"
            description={`Nothing matches “${query}” ${house !== 'all' ? `in ${house} house` : ''}. Try another name, admission number or clear the house filter.`}
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setQuery('')
                  setHouse('all')
                }}
              >
                Clear filters
              </Button>
            }
          />
        </Card>
      ) : layout === 'table' ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse">
              <thead>
                <tr className="border-b border-ink-200/70 bg-ink-50/60 text-left dark:border-white/8 dark:bg-white/[0.02]">
                  {['Student', 'Admission no.', 'Guardian', 'Attendance', 'Aggregate', 'Fees', ''].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-[10.5px] font-bold tracking-[0.12em] text-ink-400 uppercase whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((s, i) => {
                  const p = percent(s)
                  return (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.3) }}
                      onClick={() => setSelected(s)}
                      className="group cursor-pointer border-b border-ink-100 transition-colors last:border-0 hover:bg-brand-50/50 dark:border-white/5 dark:hover:bg-brand-500/8"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.name} tone={s.tint} size={34} />
                          <div className="min-w-0">
                            <p className="truncate text-[12.5px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
                              {s.name}
                            </p>
                            <p className="text-[10.5px] text-ink-400">
                              Roll {s.roll} · {s.house} house {s.transport ? '· bus' : ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11.5px] text-ink-500 dark:text-ink-400">
                        {s.admissionNo}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[12px] font-medium text-ink-700 dark:text-ink-200">{s.guardian}</p>
                        <p className="font-mono text-[10.5px] text-ink-400">{s.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-32">
                          <ProgressBar
                            value={s.attendancePct}
                            tone={s.attendancePct >= 90 ? 'emerald' : s.attendancePct >= 75 ? 'amber' : 'rose'}
                            showLabel
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12.5px] font-bold tabular text-ink-900 dark:text-white">
                          {p.toFixed(1)}%
                        </span>
                        <span className="ml-1.5 text-[10.5px] font-bold text-ink-400">{gradeFor(p)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <FeePill status={s.feeStatus} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <ChevronRight className="ml-auto h-4 w-4 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((s, i) => {
            const p = percent(s)
            return (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(s)}
                className="surface lift rounded-3xl p-4.5 text-left hover:border-brand-300/70 dark:hover:border-brand-500/35"
              >
                <div className="flex items-start gap-3.5">
                  <Avatar name={s.name} tone={s.tint} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-bold tracking-[-0.02em] text-ink-900 dark:text-white">
                      {s.name}
                    </p>
                    <p className="text-[11.5px] text-ink-500 dark:text-ink-400">
                      Roll {s.roll} · {s.admissionNo}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Pill tone={HOUSE_TONE[s.house]}>{s.house}</Pill>
                      <FeePill status={s.feeStatus} />
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-ink-500 dark:text-ink-400">
                      <span>Attendance YTD</span>
                      <span className="tabular text-ink-800 dark:text-ink-100">{s.attendancePct}%</span>
                    </div>
                    <ProgressBar
                      value={s.attendancePct}
                      tone={s.attendancePct >= 90 ? 'emerald' : s.attendancePct >= 75 ? 'amber' : 'rose'}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-ink-500 dark:text-ink-400">
                      <span>Aggregate · mid-term</span>
                      <span className="tabular text-ink-800 dark:text-ink-100">
                        {p.toFixed(1)}% ({gradeFor(p)})
                      </span>
                    </div>
                    <ProgressBar value={p} tone="brand" className="mt-1.5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-dashed border-ink-200 pt-3 dark:border-white/10">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-400">
                    {s.transport ? <Bus className="h-3.5 w-3.5" /> : <Home className="h-3.5 w-3.5" />}
                    {s.transport ? 'Route 7 · Sohna Road' : 'Day scholar'}
                  </span>
                  <span className="text-[11.5px] font-bold text-brand-600 dark:text-brand-400">Open record →</span>
                </div>
              </motion.button>
            )
          })}
        </div>
      )}

      <StudentDrawer
        key={selected?.id ?? 'none'}
        student={selected}
        onClose={() => setSelected(null)}
        marks={selected ? studentMarks(selected) : []}
        todayMark={selected ? attendance[selected.id] : undefined}
        dues={selected ? invoices.find((i) => i.studentId === selected.id) : undefined}
        onNudge={(s) =>
          pushToast({
            tone: 'success',
            title: `Message sent to ${s.guardian}`,
            description: `Term-2 update for ${s.name} delivered via app + SMS.`,
          })
        }
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
function StudentDrawer({
  student,
  onClose,
  marks,
  todayMark,
  dues,
  onNudge,
}: {
  student: Student | null
  onClose: () => void
  marks: number[]
  todayMark?: string
  dues?: { amount: number; status: string; dueDate: string; term: string }
  onNudge: (s: Student) => void
}) {
  // Keyed by student id from the parent, so a fresh record always starts on
  // the overview tab without a reset effect.
  const [tab, setTab] = useState<'overview' | 'academics' | 'finance'>('overview')

  if (!student) return null
  const p = marks.length ? marks.reduce((a, b) => a + b, 0) / marks.length : 0

  return (
    <Drawer
      open={Boolean(student)}
      onClose={onClose}
      title={student.name}
      subtitle={`Roll ${student.roll} · Class ${student.classId}-${student.section} · ${student.house} house`}
      width="max-w-2xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" icon={<Mail className="h-4 w-4" />} onClick={() => onNudge(student)}>
            Message guardian
          </Button>
          <Button icon={<Phone className="h-4 w-4" />} onClick={() => onNudge(student)}>
            Call {student.guardian.split(' ')[0]}
          </Button>
        </>
      }
    >
      <div className="rounded-2xl border border-ink-200/80 bg-gradient-to-br from-brand-50 to-violet-accent-50 p-4 dark:border-white/8 dark:from-brand-500/12 dark:to-violet-accent-500/12">
        <div className="flex items-center gap-4">
          <Avatar name={student.name} tone={student.tint} size={58} className="ring-2 ring-white dark:ring-ink-900" />
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-extrabold tracking-[-0.02em] text-ink-900 dark:text-white">{student.name}</p>
            <p className="text-[12px] text-ink-600 dark:text-ink-300">
              {student.guardian} · {student.phone}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone={HOUSE_TONE[student.house]}>{student.house}</Pill>
              <FeePill status={student.feeStatus} />
              {todayMark ? (
                <Pill tone="emerald" className="capitalize">
                  {todayMark} today
                </Pill>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 rounded-2xl border border-ink-200/80 bg-ink-100/70 p-1 dark:border-white/10 dark:bg-white/[0.04]">
        {(['overview', 'academics', 'finance'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'press relative flex-1 rounded-xl px-3 py-2 text-[12.5px] font-bold capitalize transition-colors',
              tab === t ? 'text-white' : 'text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white',
            )}
          >
            {tab === t ? (
              <motion.span
                layoutId="student-tab"
                className="absolute inset-0 rounded-xl bg-ink-900 dark:bg-brand-600"
                transition={{ type: 'spring', stiffness: 460, damping: 34 }}
              />
            ) : null}
            <span className="relative z-10">{t}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5"
        >
          {tab === 'overview' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { k: 'Attendance YTD', v: `${student.attendancePct}%` },
                  { k: 'Aggregate', v: `${p.toFixed(1)}% (${gradeFor(p)})` },
                  { k: 'CGPA', v: student.cgpa.toFixed(2) },
                  { k: 'Admission no.', v: student.admissionNo },
                ].map((row) => (
                  <div key={row.k} className="rounded-2xl border border-ink-200/80 px-4 py-3 dark:border-white/8">
                    <p className="text-[10.5px] font-bold tracking-[0.12em] text-ink-400 uppercase">{row.k}</p>
                    <p className="mt-1 text-[14px] font-extrabold tabular text-ink-900 dark:text-white">{row.v}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-ink-200/80 p-4 dark:border-white/8">
                <p className="text-[11px] font-bold tracking-[0.14em] text-ink-400 uppercase">
                  Attendance trend · 12 weeks
                </p>
                <div className="mt-3 flex h-24 items-end gap-1.5">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const h = 62 + ((i * 37 + student.roll * 11) % 36)
                    return (
                      <motion.span
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.03, duration: 0.4 }}
                        className={cn(
                          'flex-1 rounded-t-md',
                          h > 88 ? 'bg-emerald-500' : h > 78 ? 'bg-amber-400' : 'bg-rose-400',
                        )}
                      />
                    )
                  })}
                </div>
                <p className="mt-2 text-[11px] text-ink-400">Week 1 → Week 12 · green ≥ 88%, amber ≥ 78%, red below</p>
              </div>
            </div>
          ) : null}

          {tab === 'academics' ? (
            <div className="space-y-2">
              {SUBJECTS.map((sub, i) => {
                const score = marks[i] ?? 0
                return (
                  <div
                    key={sub.id}
                    className="flex items-center gap-3 rounded-2xl border border-ink-200/80 px-3.5 py-3 dark:border-white/8"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-ink-100 font-mono text-[10.5px] font-bold text-ink-500 dark:bg-white/8 dark:text-ink-300">
                      {sub.code}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] font-bold text-ink-900 dark:text-white">{sub.name}</p>
                      <p className="text-[10.5px] text-ink-400">{sub.teacher}</p>
                    </div>
                    <div className="w-28">
                      <ProgressBar value={score} tone={score >= 80 ? 'emerald' : score >= 60 ? 'brand' : 'amber'} />
                    </div>
                    <span className="w-12 text-right text-[13px] font-extrabold tabular text-ink-900 dark:text-white">
                      {score}/100
                    </span>
                  </div>
                )
              })}
              <div className="rounded-2xl bg-ink-900 p-3.5 text-white dark:bg-brand-600">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-white/70">Class aggregate</span>
                  <span className="text-[15px] font-extrabold tabular">
                    {p.toFixed(1)}% · {gradeFor(p)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'finance' && dues ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-ink-200/80 p-4 dark:border-white/8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.12em] text-ink-400 uppercase">{dues.term}</p>
                    <p className="mt-1 text-[22px] font-extrabold tracking-[-0.04em] tabular text-ink-900 dark:text-white">
                      {inr(dues.amount)}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-ink-500 dark:text-ink-400">Due {dues.dueDate}</p>
                  </div>
                  <FeePill status={student.feeStatus} />
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 dark:border-amber-500/25 dark:bg-amber-500/10">
                <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-[12px] leading-relaxed font-medium text-amber-900 dark:text-amber-100">
                  {student.feeStatus === 'paid'
                    ? 'Account fully settled for this term. Receipts are available in the parent portal.'
                    : `Outstanding balance of ${inr(student.dues)}. Late fee of ₹500 per month applies after the due date as per the fee policy circular dated 12 June 2026.`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => onNudge(student)}>
                  Send payment link
                </Button>
                <Button size="sm" variant="outline" onClick={() => onNudge(student)}>
                  Email statement
                </Button>
              </div>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </Drawer>
  )
}
