import { useState } from 'react'
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
  scholarNo: 'RVS-2024-0429',
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

interface Assignment {
  id: string
  subject: string
  title: string
  due: string
  status: 'Submitted' | 'Pending'
  teacher: string
}

export function ChildView() {
  const {
    role,
    pushToast,
    invoices,
    setChatModalOpen,
    setReportCardModalOpen,
    setReportCardStudent,
    setReportCardRemark,
    triggerCelebration,
  } = useApp()

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'as1',
      subject: 'Physics',
      title: 'Wave Optics: Huygens Principle Derivation & Practice Problems',
      due: 'Tomorrow, 08:15 AM',
      status: 'Submitted',
      teacher: 'Dr. Shalini Verma',
    },
    {
      id: 'as2',
      subject: 'Chemistry',
      title: 'Electrochemistry Titration Lab Journal Entry & Graphs',
      due: 'Friday, 11:15 AM',
      status: 'Pending',
      teacher: 'Dr. Rohit Saxena',
    },
    {
      id: 'as3',
      subject: 'Mathematics',
      title: 'Definite Integrals: Exercise 7.8 (Questions 1 to 15)',
      due: '19 Sep, 09:10 AM',
      status: 'Submitted',
      teacher: 'Anil Deshpande',
    },
    {
      id: 'as4',
      subject: 'Computer Science',
      title: 'Python-MySQL Connectivity: Class Roster Module Script',
      due: '21 Sep, 02:00 PM',
      status: 'Pending',
      teacher: 'Amitabh Sen',
    },
    {
      id: 'as5',
      subject: 'English Core',
      title: 'Speech Draft on "Digital Literacy in Secondary Education"',
      due: '22 Sep, 12:10 PM',
      status: 'Submitted',
      teacher: 'Anand Chaturvedi',
    },
  ])

  const invoice = invoices.find((i) => i.studentName === 'Aarav Mehta')
  const aggregate = SUBJECT_SCORES.reduce((a, b) => a + b.score, 0) / SUBJECT_SCORES.length
  const isStudent = role.id === 'student'

  const toggleAssignment = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus = a.status === 'Submitted' ? 'Pending' : 'Submitted'
          if (nextStatus === 'Submitted') {
            triggerCelebration({ message: 'Assignment Submitted!' })
            pushToast({
              tone: 'success',
              title: `Assignment marked as Submitted`,
              description: `${a.subject}: ${a.title} · Sent to ${a.teacher}`,
            })
          } else {
            pushToast({
              tone: 'info',
              title: 'Assignment marked as Pending',
              description: 'Remember to submit before the deadline.',
            })
          }
          return { ...a, status: nextStatus }
        }
        return a
      }),
    )
  }

  const handleOpenReportCard = () => {
    setReportCardStudent({
      name: WARD.name,
      roll: WARD.roll,
      classId: WARD.classId,
      admissionNo: WARD.scholarNo,
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
      description: 'Official CBSE board-compliant grade sheet rendered for print/PDF export.',
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow className="text-emerald-800 bg-emerald-50 border-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />{' '}
            {isStudent ? 'Scholar Portal · Class XII-B' : 'Family view'}
          </Eyebrow>
          <h1 className="mt-2.5 text-[clamp(1.6rem,3vw,2.15rem)] leading-tight font-extrabold tracking-[-0.04em] text-slate-900">
            Good afternoon, {isStudent ? 'Aarav' : WARD.guardian.split(' ')[0]}.
          </h1>
          <p className="mt-1 text-[13.5px] text-slate-500">
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
            className="bg-emerald-700 hover:bg-emerald-800 text-white"
          >
            Message Teacher
          </Button>
        </div>
      </div>

      {/* Hero card */}
      <Card className="overflow-hidden border-emerald-200/80 p-0 shadow-sm">
        <div className="bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar name={WARD.name} size={64} className="ring-4 ring-white/25" />
            <div className="min-w-0 flex-1">
              <p className="text-[20px] font-extrabold tracking-[-0.03em] text-white">{WARD.name}</p>
              <p className="text-[12.5px] text-emerald-100">
                Class {WARD.classId} · Roll {WARD.roll} · Scholar {WARD.scholarNo} · {WARD.house} house · Science PCM
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <p className="text-[11px] font-semibold text-emerald-200">Attendance</p>
                <p className="text-[20px] font-extrabold tabular text-white">{WARD.attendance}%</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold text-emerald-200">CGPA</p>
                <p className="text-[20px] font-extrabold tabular text-white">{WARD.cgpa.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-3 bg-white">
          {[
            {
              label: 'Today’s status',
              value: 'Present · 08:07 am (Gate RFID 01)',
              tone: 'emerald' as Tone,
              icon: CalendarCheck2,
            },
            { label: 'Next examination', value: 'Physics Optics · 18 Sep', tone: 'brand' as Tone, icon: Clock },
            { label: 'Transport', value: 'Route 3 · Arera Colony (Bus 15)', tone: 'violet' as Tone, icon: Bus },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3.5 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700">
                <row.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[10.5px] font-bold tracking-[0.1em] text-slate-400 uppercase">{row.label}</p>
                <p className="truncate text-[12.5px] font-bold text-slate-900">{row.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Student Daily Assignments & Homework Dispatcher (Working Prototype Feature) */}
      <Card className="p-5 border-slate-200 shadow-sm bg-white">
        <CardHeader
          compact
          title="Daily Assignments & Practical Journal Tracker"
          subtitle="CBSE Class XII-B Science · Click any assignment to submit or review status"
          right={
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-extrabold text-emerald-800 border border-emerald-200">
              {assignments.filter((a) => a.status === 'Submitted').length} of {assignments.length} Completed
            </span>
          }
        />
        <div className="space-y-2.5 mt-2">
          {assignments.map((item) => {
            const isDone = item.status === 'Submitted'
            return (
              <div
                key={item.id}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all ${
                  isDone
                    ? 'border-emerald-200 bg-emerald-50/40'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleAssignment(item.id)}
                    className={`mt-0.5 grid h-6 w-6 place-items-center rounded-lg border transition-all ${
                      isDone
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white hover:border-emerald-500'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="h-4 w-4" />}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                        {item.subject}
                      </span>
                      <span className={`text-[13px] font-bold ${isDone ? 'text-slate-800' : 'text-slate-900'}`}>
                        {item.title}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Assigned by <strong className="text-slate-700">{item.teacher}</strong> · Due: {item.due}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAssignment(item.id)}
                    className={`press rounded-xl px-3 py-1.5 text-[11px] font-bold transition-colors ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs'
                    }`}
                  >
                    {isDone ? 'Submitted ✓' : 'Mark as Submitted'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
        <Card className="p-5 border-slate-200 bg-white">
          <CardHeader
            compact
            title="Subject performance · mid-term"
            subtitle="Maximum marks 100 · CBSE grading scale"
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
                  <span className="flex items-center gap-2 font-semibold text-slate-700">
                    <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                    {s.name}
                  </span>
                  <span className="font-bold tabular text-slate-900">
                    {s.score}/100 <span className="text-slate-400">· {gradeFor(s.score)}</span>
                  </span>
                </div>
                <ProgressBar
                  value={s.score}
                  tone={s.score >= 90 ? 'emerald' : s.score >= 80 ? 'brand' : 'amber'}
                  className="mt-1.5"
                />
                <p className="mt-1 text-[10.5px] text-slate-500">{s.teacher} · section average 78.4</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between rounded-2xl bg-emerald-900 p-4 text-white">
            <div>
              <p className="text-[11.5px] font-semibold text-emerald-200">Term aggregate</p>
              <p className="text-[22px] font-extrabold tabular">{aggregate.toFixed(1)}%</p>
            </div>
            <Pill tone="emerald" className="border-white/20 bg-white/15 text-white">
              Rank 2 of 24
            </Pill>
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5 border-slate-200 bg-white">
            <CardHeader
              compact
              title="Fees"
              subtitle="Term 2 · session 2026-27"
              right={<BadgeIndianRupee className="h-4 w-4 text-emerald-600" />}
            />
            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.12em] text-slate-400 uppercase">
                    {invoice?.term ?? 'Term 2 · 2026-27'}
                  </p>
                  <p className="mt-1 text-[22px] font-extrabold tracking-[-0.04em] tabular text-slate-900">
                    {inr(invoice?.amount ?? 124000)}
                  </p>
                  <p className="text-[11.5px] text-slate-500">
                    Paid {invoice?.paidOn ?? '2026-09-08'} · {invoice?.method ?? 'UPI'}
                  </p>
                </div>
                <Pill tone="emerald" dot>
                  Settled
                </Pill>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 border border-emerald-100">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-700" />
                <p className="text-[11px] font-semibold text-emerald-800">
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

          <Card className="p-5 border-slate-200 bg-white">
            <CardHeader
              compact
              title="This week"
              subtitle="Class XII-B timetable"
              right={<Bell className="h-4 w-4 text-emerald-600" />}
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-[11px]">
                <thead>
                  <tr>
                    <th className="px-1.5 py-1.5 text-left text-[10px] font-bold tracking-[0.1em] text-slate-400 uppercase">
                      Day
                    </th>
                    {TIMETABLE_SLOTS.slice(0, 6).map((s) => (
                      <th
                        key={s}
                        className="px-1 py-1.5 text-center font-mono text-[9.5px] font-semibold text-slate-400"
                      >
                        {s}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIMETABLE_DAYS.map((day) => (
                    <tr key={day} className="border-t border-slate-100">
                      <td className="px-1.5 py-1.5 text-[11px] font-bold text-slate-700">{day}</td>
                      {TIMETABLE[day].slice(0, 6).map((slot, i) => (
                        <td key={`${day}-${i}`} className="px-0.5 py-1">
                          <span
                            className={cn(
                              'block truncate rounded-lg px-1.5 py-1 text-center text-[9.5px] font-semibold',
                              slot.startsWith('—') ? 'text-slate-300' : 'bg-slate-100 text-slate-700',
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
        <Card className="p-5 border-slate-200 bg-white">
          <CardHeader
            compact
            title="Recent updates"
            subtitle="Everything the school shared with you"
            right={<TrendingUp className="h-4 w-4 text-emerald-600" />}
          />
          <div className="relative space-y-4 pl-1.5">
            <span className="absolute top-2 bottom-4 left-[7px] w-px bg-slate-200" />
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
                    'relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-white',
                    t.tone === 'emerald'
                      ? 'bg-emerald-500'
                      : t.tone === 'brand'
                        ? 'bg-blue-600'
                        : t.tone === 'violet'
                          ? 'bg-purple-600'
                          : 'bg-amber-500',
                  )}
                />
                <div>
                  <p className="text-[12.5px] font-bold tracking-[-0.01em] text-slate-900">{t.title}</p>
                  <p className="text-[11.5px] text-slate-500">{t.detail}</p>
                  <p className="mt-0.5 font-mono text-[10.5px] text-slate-400">{t.at}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        <Card className="p-5 border-slate-200 bg-white">
          <CardHeader
            compact
            title="Reach the school"
            subtitle="Response guaranteed within one working day"
            right={<MessageSquare className="h-4 w-4 text-emerald-600" />}
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
                value: '+91 78699 66422',
                sub: 'Bilkhiriya Campus, Bhopal',
                tone: 'emerald' as Tone,
              },
              { label: 'Fee helpdesk', value: 'accounts@rivertonvalley…', sub: 'Priya Menon', tone: 'amber' as Tone },
              {
                label: 'Transport cell',
                value: 'Route 3 (Arera/MP Nagar)',
                sub: 'Bus 15 · Live GPS tracking',
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
                className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 text-left hover:border-emerald-500 hover:bg-white transition-all shadow-2xs"
              >
                <p className="text-[10.5px] font-bold tracking-[0.1em] text-slate-400 uppercase">{c.label}</p>
                <p className="mt-1 truncate text-[12.5px] font-bold text-slate-900">{c.value}</p>
                <p className="truncate text-[11px] text-slate-500">{c.sub}</p>
              </motion.button>
            ))}
          </div>
          <Button
            className="mt-4 w-full bg-emerald-700 hover:bg-emerald-800 text-white"
            onClick={() =>
              pushToast({
                tone: 'success',
                title: 'Leave application drafted',
                description: 'Ready to submit for 22–23 September to Dr. Shalini Verma.',
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
            sub: 'Above the 75% CBSE norm',
          },
          { label: 'Assignments submitted', value: '41 / 42', tone: 'brand', sub: '1 pending · Chemistry lab record' },
          { label: 'Co-curricular', value: 'Basketball · MUN', tone: 'violet', sub: 'Bhopal Sahodaya squad' },
          { label: 'Mentor meetings', value: '6 of 6', tone: 'amber', sub: 'Monthly cadence maintained' },
        ]}
      />
    </div>
  )
}
