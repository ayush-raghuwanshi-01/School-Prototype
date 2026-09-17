import { motion } from 'framer-motion'
import {
  BadgeIndianRupee,
  Bell,
  BookOpen,
  Bus,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Download,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { Card, CardHeader, Eyebrow } from '../../ui/Card'
import { Pill, type Tone } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { Avatar, ProgressBar } from '../../ui/Form'
import { StatStrip } from '../MetricCard'
import { SUBJECTS, TIMETABLE, TIMETABLE_DAYS, TIMETABLE_SLOTS } from '../../../data/school'
import { useApp } from '../../../state/store'
import { cn, gradeFor, inr } from '../../../lib/utils'

const WARD = {
  name: 'Aarav Mehta',
  roll: 1,
  classId: 'XII-B',
  house: 'Ganga',
  guardian: 'Rakesh Mehta',
  attendance: 96.4,
  cgpa: 9.42,
}

const SUBJECT_SCORES = SUBJECTS.map((s, i) => ({ ...s, score: [94, 88, 97, 91, 86, 92][i] ?? 88 }))

const TIMELINE = [
  {
    id: 't1',
    title: 'Mid-term Physics paper completed',
    detail: 'Scored 94/100 · highest in section',
    at: 'Today, 11:20 am',
    tone: 'emerald' as Tone,
  },
  {
    id: 't2',
    title: 'Term-2 fee receipt issued',
    detail: '₹1,24,000 via UPI · RCPT/26/8241',
    at: 'Yesterday, 4:02 pm',
    tone: 'brand' as Tone,
  },
  {
    id: 't3',
    title: 'Basketball selection confirmed',
    detail: 'District squad · practice Tue & Thu 4 pm',
    at: '12 Sep, 9:15 am',
    tone: 'violet' as Tone,
  },
  {
    id: 't4',
    title: 'Parent-teacher meeting scheduled',
    detail: 'Saturday 20 Sep · 10:30 am · Slot A-14',
    at: '10 Sep, 6:40 pm',
    tone: 'amber' as Tone,
  },
]

export function ChildView() {
  const {
    pushToast,
    invoices,
    setChatModalOpen,
    setReportCardModalOpen,
    setReportCardStudent,
    setReportCardRemark,
    triggerCelebration,
  } = useApp()
  const invoice = invoices.find((i) => i.studentName === 'Aarav Mehta')
  const aggregate = SUBJECT_SCORES.reduce((a, b) => a + b.score, 0) / SUBJECT_SCORES.length

  const handleOpenReportCard = () => {
    setReportCardStudent({
      name: WARD.name,
      roll: WARD.roll,
      classId: WARD.classId,
      admissionNo: 'SVM-2018-0429',
      guardian: WARD.guardian,
      attendancePct: WARD.attendance,
      house: WARD.house,
    })
    setReportCardRemark(
      'Aarav demonstrates outstanding conceptual rigor in analytical disciplines, regularly topping mathematics and physics modules. Highly respectful, cooperative, and an active contributor to campus STEM initiatives. Promoted with High Distinction.',
    )
    setReportCardModalOpen(true)
    triggerCelebration({ message: 'Mid-Term Progress Card Ready!' })
    pushToast({
      tone: 'success',
      title: 'Progress card opened',
      description: 'Official board-compliant grade sheet rendered for print/PDF export.',
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>
            <Sparkles className="h-3.5 w-3.5" /> Family view
          </Eyebrow>
          <h1 className="mt-2.5 text-[clamp(1.6rem,3vw,2.15rem)] leading-tight font-extrabold tracking-[-0.04em] text-ink-900 dark:text-white">
            Good afternoon, {WARD.guardian.split(' ')[0]}.
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500 dark:text-ink-400">
            Here is how {WARD.name.split(' ')[0]} is tracking this term. Everything below is read-only and synced live.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Pill tone="emerald" dot>
            Fees settled
          </Pill>
          <Button
            size="sm"
            variant="outline"
            icon={<Download className="h-3.5 w-3.5" />}
            onClick={handleOpenReportCard}
          >
            Download report card
          </Button>
          <Button
            size="sm"
            variant="primary"
            icon={<MessageSquare className="h-3.5 w-3.5" />}
            onClick={() => setChatModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white"
          >
            Message Teacher
          </Button>
        </div>
      </div>

      {/* Hero card */}
      <Card className="overflow-hidden border-brand-200/70 p-0 dark:border-brand-500/25">
        <div className="bg-gradient-to-br from-brand-600 via-brand-600 to-violet-accent-600 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar name={WARD.name} size={64} className="ring-4 ring-white/25" />
            <div className="min-w-0 flex-1">
              <p className="text-[20px] font-extrabold tracking-[-0.03em] text-white">{WARD.name}</p>
              <p className="text-[12.5px] text-white/75">
                Class {WARD.classId} · Roll {WARD.roll} · {WARD.house} house · Science stream
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-[11px] font-semibold text-white/70">Attendance</p>
                <p className="text-[20px] font-extrabold tabular text-white">{WARD.attendance}%</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold text-white/70">CGPA</p>
                <p className="text-[20px] font-extrabold tabular text-white">{WARD.cgpa.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-3">
          {[
            { label: 'Today’s status', value: 'Present · 08:07 am', tone: 'emerald' as Tone, icon: CalendarCheck2 },
            { label: 'Next examination', value: 'Chemistry · 18 Sep', tone: 'brand' as Tone, icon: Clock },
            { label: 'Transport', value: 'Route 7 · bus 12', tone: 'violet' as Tone, icon: Bus },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center gap-3 rounded-2xl border border-ink-200/70 px-3.5 py-3 dark:border-white/8"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-500 dark:bg-white/8 dark:text-ink-300">
                <row.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[10.5px] font-bold tracking-[0.1em] text-ink-400 uppercase">{row.label}</p>
                <p className="truncate text-[12.5px] font-bold text-ink-900 dark:text-white">{row.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
        <Card className="p-5">
          <CardHeader
            compact
            title="Subject performance · mid-term"
            subtitle="Maximum marks 100 · MPBSE grading scale"
            right={<Pill tone="emerald">{gradeFor(aggregate)}</Pill>}
          />
          <div className="space-y-3.5">
            {SUBJECT_SCORES.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="flex items-center justify-between text-[12.5px]">
                  <span className="flex items-center gap-2 font-semibold text-ink-700 dark:text-ink-200">
                    <BookOpen className="h-3.5 w-3.5 text-ink-400" />
                    {s.name}
                  </span>
                  <span className="font-bold tabular text-ink-900 dark:text-white">
                    {s.score}/100 <span className="text-ink-400">· {gradeFor(s.score)}</span>
                  </span>
                </div>
                <ProgressBar
                  value={s.score}
                  tone={s.score >= 90 ? 'emerald' : s.score >= 80 ? 'brand' : 'amber'}
                  className="mt-1.5"
                />
                <p className="mt-1 text-[10.5px] text-ink-400">{s.teacher} · section average 78.4</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between rounded-2xl bg-ink-900 p-4 text-white dark:bg-brand-600">
            <div>
              <p className="text-[11.5px] font-semibold text-white/70">Term aggregate</p>
              <p className="text-[22px] font-extrabold tabular">{aggregate.toFixed(1)}%</p>
            </div>
            <Pill tone="emerald" className="border-white/20 bg-white/15 text-white">
              Rank 2 of 24
            </Pill>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <CardHeader
              compact
              title="Fees"
              subtitle="Term 2 · session 2026-27"
              right={<BadgeIndianRupee className="h-4 w-4 text-emerald-500" />}
            />
            <div className="rounded-2xl border border-ink-200/70 p-4 dark:border-white/8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.12em] text-ink-400 uppercase">
                    {invoice?.term ?? 'Term 2 · 2026-27'}
                  </p>
                  <p className="mt-1 text-[22px] font-extrabold tracking-[-0.04em] tabular text-ink-900 dark:text-white">
                    {inr(invoice?.amount ?? 124000)}
                  </p>
                  <p className="text-[11.5px] text-ink-500 dark:text-ink-400">
                    Paid {invoice?.paidOn ?? '2026-09-08'} · {invoice?.method ?? 'UPI'}
                  </p>
                </div>
                <Pill tone="emerald" dot>
                  Settled
                </Pill>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50/80 px-3 py-2 dark:bg-emerald-500/10">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-200">
                  Receipt {invoice?.receiptNo ?? 'RCPT/26/8241'} issued
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  pushToast({ tone: 'info', title: 'Receipt downloaded', description: 'RCPT/26/8241 · PDF · 1 page' })
                }
              >
                Receipt PDF
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  pushToast({
                    tone: 'info',
                    title: 'Statement requested',
                    description: 'Consolidated statement for the session will be emailed.',
                  })
                }
              >
                Full statement
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <CardHeader
              compact
              title="This week"
              subtitle="Class XII-B timetable"
              right={<Bell className="h-4 w-4 text-brand-500" />}
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-[11px]">
                <thead>
                  <tr>
                    <th className="px-1.5 py-1.5 text-left text-[10px] font-bold tracking-[0.1em] text-ink-400 uppercase">
                      Day
                    </th>
                    {TIMETABLE_SLOTS.slice(0, 6).map((s) => (
                      <th key={s} className="px-1 py-1.5 text-center font-mono text-[9.5px] font-semibold text-ink-400">
                        {s}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIMETABLE_DAYS.map((day) => (
                    <tr key={day} className="border-t border-ink-100 dark:border-white/5">
                      <td className="px-1.5 py-1.5 text-[11px] font-bold text-ink-700 dark:text-ink-200">{day}</td>
                      {TIMETABLE[day].slice(0, 6).map((slot, i) => (
                        <td key={`${day}-${i}`} className="px-0.5 py-1">
                          <span
                            className={cn(
                              'block truncate rounded-lg px-1.5 py-1 text-center text-[9.5px] font-semibold',
                              slot.startsWith('—')
                                ? 'text-ink-300 dark:text-ink-600'
                                : 'bg-ink-100 text-ink-600 dark:bg-white/8 dark:text-ink-300',
                            )}
                            title={slot}
                          >
                            {slot}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card className="p-5">
          <CardHeader
            compact
            title="Recent updates"
            subtitle="Everything the school shared with you"
            right={<TrendingUp className="h-4 w-4 text-violet-accent-500" />}
          />
          <div className="relative space-y-4 pl-1.5">
            <span className="absolute top-2 bottom-4 left-[7px] w-px bg-ink-200 dark:bg-white/10" />
            {TIMELINE.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="relative flex gap-3.5"
              >
                <span
                  className={cn(
                    'relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-white dark:ring-ink-900',
                    t.tone === 'emerald'
                      ? 'bg-emerald-500'
                      : t.tone === 'brand'
                        ? 'bg-brand-600'
                        : t.tone === 'violet'
                          ? 'bg-violet-accent-600'
                          : 'bg-amber-500',
                  )}
                />
                <div>
                  <p className="text-[12.5px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">{t.title}</p>
                  <p className="text-[11.5px] text-ink-500 dark:text-ink-400">{t.detail}</p>
                  <p className="mt-0.5 font-mono text-[10.5px] text-ink-400">{t.at}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <CardHeader
            compact
            title="Reach the school"
            subtitle="Response guaranteed within one working day"
            right={<MessageSquare className="h-4 w-4 text-brand-500" />}
          />
          <div className="grid gap-2.5 sm:grid-cols-2">
            {[
              {
                label: 'Class teacher',
                value: 'Dr. Shalini Verma',
                sub: 'Physics · Room B-204',
                tone: 'brand' as Tone,
              },
              {
                label: 'Front office',
                value: '+91 124 402 8800',
                sub: 'Mon–Sat, 8 am – 4:30 pm',
                tone: 'emerald' as Tone,
              },
              { label: 'Fee helpdesk', value: 'accounts@svmbhopal…', sub: 'Priya Menon', tone: 'amber' as Tone },
              {
                label: 'Transport cell',
                value: 'Route 7 control',
                sub: 'Live tracking in app',
                tone: 'violet' as Tone,
              },
            ].map((c, i) => (
              <motion.button
                key={c.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (c.label === 'Class teacher') {
                    setChatModalOpen(true)
                  } else {
                    pushToast({
                      tone: 'success',
                      title: `Opening helpdesk · ${c.label}`,
                      description: `${c.value} typically replies within 2 hours.`,
                    })
                  }
                }}
                className="surface lift rounded-2xl p-3.5 text-left hover:border-brand-300/70 dark:hover:border-brand-500/30"
              >
                <p className="text-[10.5px] font-bold tracking-[0.1em] text-ink-400 uppercase">{c.label}</p>
                <p className="mt-1 truncate text-[12.5px] font-bold text-ink-900 dark:text-white">{c.value}</p>
                <p className="truncate text-[11px] text-ink-500 dark:text-ink-400">{c.sub}</p>
              </motion.button>
            ))}
          </div>
          <Button
            className="mt-4 w-full"
            onClick={() =>
              pushToast({
                tone: 'success',
                title: 'Leave application drafted',
                description: 'Ready to submit for 22–23 September.',
              })
            }
          >
            Apply for leave
          </Button>
        </Card>
      </div>

      <StatStrip
        items={[
          {
            label: 'Attendance this term',
            value: `${WARD.attendance}%`,
            tone: 'emerald',
            sub: 'Above the 75% MPBSE norm',
          },
          { label: 'Assignments submitted', value: '41 / 42', tone: 'brand', sub: '1 pending · Chemistry lab record' },
          { label: 'Co-curricular', value: 'Basketball · MUN', tone: 'violet', sub: 'District squad selected' },
          { label: 'Mentor meetings', value: '6 of 6', tone: 'amber', sub: 'Monthly cadence maintained' },
        ]}
      />
    </div>
  )
}
