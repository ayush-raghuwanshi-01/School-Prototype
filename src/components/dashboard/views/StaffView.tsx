import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgeCheck,
  CalendarCheck2,
  CalendarX2,
  CheckCheck,
  ClipboardList,
  Clock3,
  Inbox,
  Phone,
  Search,
  Shuffle,
  UserCheck,
  UserMinus,
  Users,
} from 'lucide-react'
import { Card, Eyebrow } from '../../ui/Card'
import { Pill, type Tone } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { Avatar, Input, Segmented } from '../../ui/Form'
import { SkeletonList } from '../../ui/Skeleton'
import { DataBar, PanelCard } from '../Panels'
import { useApp, useSimulatedLoad } from '../../../state/store'
import { DUTY_STAFF } from '../../../data/school'
import { cn } from '../../../lib/utils'

type DutyMark = 'present' | 'leave' | 'od'

const MARK_META: Record<DutyMark, { label: string; tone: Tone; active: string }> = {
  present: { label: 'Present', tone: 'emerald', active: 'bg-emerald-500 text-white' },
  leave: { label: 'On leave', tone: 'rose', active: 'bg-rose-500 text-white' },
  od: { label: 'On duty', tone: 'amber', active: 'bg-amber-500 text-ink-900' },
}

export function StaffView() {
  const { staffDuty, setStaffDuty, substitutions, confirmSubstitution, pushToast, role } = useApp()
  const [query, setQuery] = useState('')
  const [wing, setWing] = useState<string>('All wings')
  const [markFilter, setMarkFilter] = useState<'all' | DutyMark>('all')
  const loading = useSimulatedLoad(wing + markFilter, 520)
  const readOnly = role.id === 'parent'

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return DUTY_STAFF.filter((d) => {
      const matchQuery = !q || d.name.toLowerCase().includes(q) || d.role.toLowerCase().includes(q)
      const matchWing = wing === 'All wings' || d.wing === wing
      const mark = staffDuty[d.id] ?? 'present'
      const matchMark = markFilter === 'all' || mark === markFilter
      return matchQuery && matchWing && matchMark
    })
  }, [markFilter, query, staffDuty, wing])

  const counts = useMemo(() => {
    const values = Object.values(staffDuty)
    return {
      present: values.filter((v) => v === 'present').length,
      leave: values.filter((v) => v === 'leave').length,
      od: values.filter((v) => v === 'od').length,
    }
  }, [staffDuty])

  const onLeave = DUTY_STAFF.filter((d) => (staffDuty[d.id] ?? 'present') !== 'present')
  const unconfirmed = substitutions.filter((s) => !s.confirmed)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>
            <Users className="h-3.5 w-3.5" /> Staff & duty management
          </Eyebrow>
          <h1 className="mt-2.5 text-[clamp(1.6rem,3vw,2.15rem)] leading-tight font-extrabold tracking-[-0.04em] text-ink-900 dark:text-white">
            Duty roster & period cover
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500 dark:text-ink-400">
            Mark staff attendance, cover absent teachers and keep every period supervised.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Pill tone={counts.leave ? 'amber' : 'emerald'} dot>
            {counts.present}/{DUTY_STAFF.length} on duty
          </Pill>
          <Pill tone={unconfirmed.length ? 'rose' : 'emerald'}>
            {unconfirmed.length ? `${unconfirmed.length} periods need cover` : 'All periods covered'}
          </Pill>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Present today',
            value: String(counts.present),
            sub: `Across ${DUTY_STAFF.length} rostered staff`,
            tone: 'emerald' as Tone,
            icon: UserCheck,
          },
          {
            label: 'On sanctioned leave',
            value: String(counts.leave),
            sub: 'Cover arranged automatically',
            tone: 'rose' as Tone,
            icon: UserMinus,
          },
          {
            label: 'On official duty',
            value: String(counts.od),
            sub: 'Board verification / training',
            tone: 'amber' as Tone,
            icon: BadgeCheck,
          },
          {
            label: 'Periods to cover',
            value: String(unconfirmed.length),
            sub: 'Substitution engine ready',
            tone: 'brand' as Tone,
            icon: Shuffle,
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="surface lift rounded-3xl p-5 hover:border-brand-300/60 dark:hover:border-brand-500/30"
          >
            <span
              className={cn(
                'grid h-9 w-9 place-items-center rounded-xl',
                kpi.tone === 'brand' && 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
                kpi.tone === 'emerald' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
                kpi.tone === 'amber' && 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
                kpi.tone === 'rose' && 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
              )}
            >
              <kpi.icon className="h-4.5 w-4.5" />
            </span>
            <p className="mt-3.5 text-[11.5px] font-semibold text-ink-500 dark:text-ink-400">{kpi.label}</p>
            <p className="mt-1 text-[21px] leading-none font-extrabold tracking-[-0.04em] tabular text-ink-900 dark:text-white">
              {kpi.value}
            </p>
            <p className="mt-2 text-[11px] text-ink-400">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Card className="flex flex-col p-5">
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[180px] flex-1">
              <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search staff by name or subject…"
                className="pl-9"
              />
            </div>
            <Segmented
              size="sm"
              value={markFilter}
              onChange={setMarkFilter}
              options={[
                { value: 'all', label: `All ${DUTY_STAFF.length}` },
                { value: 'present', label: `${counts.present}` },
                { value: 'leave', label: `${counts.leave}` },
                { value: 'od', label: `${counts.od}` },
              ]}
            />
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            {['All wings', 'Primary', 'Middle school', 'High school', 'Senior secondary'].map((w) => (
              <button
                key={w}
                onClick={() => setWing(w)}
                className={cn(
                  'press rounded-xl border px-3 py-1.5 text-[11.5px] font-bold transition-colors',
                  wing === w
                    ? 'border-ink-900 bg-ink-900 text-white dark:border-brand-600 dark:bg-brand-600'
                    : 'border-ink-200/80 text-ink-600 hover:border-ink-300 dark:border-white/10 dark:text-ink-300',
                )}
              >
                {w}
              </button>
            ))}
          </div>

          {loading ? (
            <SkeletonList rows={6} />
          ) : rows.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
              <Inbox className="h-7 w-7 text-ink-300 dark:text-ink-600" />
              <p className="mt-2.5 text-[13.5px] font-bold text-ink-800 dark:text-ink-100">
                No staff match this filter
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => {
                  setQuery('')
                  setWing('All wings')
                  setMarkFilter('all')
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
              {rows.map((person, i) => {
                const mark = staffDuty[person.id] ?? 'present'
                return (
                  <motion.div
                    key={person.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.025, 0.3) }}
                    className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink-200/70 bg-white/60 px-3.5 py-3 transition-colors hover:border-ink-300 dark:border-white/8 dark:bg-white/[0.02] dark:hover:border-white/16"
                  >
                    <Avatar name={person.name} size={36} tone={i % 6} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
                        {person.name}
                      </p>
                      <p className="truncate text-[10.5px] text-ink-400">
                        {person.role} · {person.wing} · {person.periodsToday} periods
                      </p>
                    </div>

                    <a
                      href={`tel:${person.phone.replace(/\s/g, '')}`}
                      onClick={(e) => e.preventDefault()}
                      className="press hidden h-8 w-8 shrink-0 place-items-center rounded-lg border border-ink-200/80 text-ink-500 transition-colors hover:border-brand-400 hover:text-brand-600 sm:grid dark:border-white/10 dark:text-ink-300"
                      aria-label={`Call ${person.name}`}
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </a>

                    <div className="flex shrink-0 items-center gap-0.5 rounded-xl border border-ink-200/80 bg-ink-50/80 p-0.5 dark:border-white/10 dark:bg-white/[0.04]">
                      {(['present', 'leave', 'od'] as DutyMark[]).map((m) => {
                        const active = mark === m
                        return (
                          <button
                            key={m}
                            disabled={readOnly}
                            onClick={() => setStaffDuty(person.id, m)}
                            className={cn(
                              'press ring-focus h-7 rounded-lg px-2 text-[10.5px] font-bold whitespace-nowrap transition-colors disabled:opacity-50',
                              active
                                ? MARK_META[m].active
                                : 'text-ink-400 hover:bg-white hover:text-ink-700 dark:hover:bg-white/10 dark:hover:text-white',
                            )}
                          >
                            {MARK_META[m].label}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-ink-200/70 pt-3.5 dark:border-white/8">
            <p className="text-[11px] font-semibold text-ink-400">
              Showing {rows.length} of {DUTY_STAFF.length} rostered staff
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                icon={<CheckCheck className="h-3.5 w-3.5" />}
                disabled={readOnly}
                onClick={() => {
                  DUTY_STAFF.forEach((d) => setStaffDuty(d.id, 'present'))
                  pushToast({
                    tone: 'success',
                    title: 'Whole staff marked present',
                    description: 'Duty register submitted for 16 Sep.',
                  })
                }}
              >
                Mark all present
              </Button>
              <Button
                size="sm"
                icon={<CalendarCheck2 className="h-3.5 w-3.5" />}
                onClick={() =>
                  pushToast({
                    tone: 'success',
                    title: 'Monthly duty register exported',
                    description: 'September attendance register (PDF) sent to the office.',
                  })
                }
              >
                Export register
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <PanelCard
            title="Substitution engine"
            subtitle={
              unconfirmed.length ? `${unconfirmed.length} classes still uncovered` : 'Every period has a teacher'
            }
            icon={<Shuffle className="h-4 w-4" />}
          >
            <div className="space-y-2.5">
              <AnimatePresence initial={false}>
                {substitutions.map((sub) => (
                  <motion.div
                    key={sub.id}
                    layout
                    exit={{ opacity: 0, x: 20 }}
                    className={cn(
                      'rounded-2xl border p-3.5 transition-colors',
                      sub.confirmed
                        ? 'border-emerald-200/80 bg-emerald-50/60 dark:border-emerald-500/25 dark:bg-emerald-500/10'
                        : 'border-amber-200/80 bg-amber-50/60 dark:border-amber-500/25 dark:bg-amber-500/10',
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10.5px] font-bold text-ink-500 dark:text-ink-400">
                        {sub.slot}
                      </span>
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
                    <p className="mt-1.5 text-[12.5px] font-bold text-ink-900 dark:text-white">
                      {sub.className} · {sub.subject}
                    </p>
                    <p className="text-[11px] text-ink-500 dark:text-ink-400">
                      {sub.absent} absent ({sub.reason})
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-ink-700 dark:text-ink-200">
                      Substitute: <span className="font-bold">{sub.substitute}</span>
                    </p>
                    {!sub.confirmed && !readOnly ? (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            confirmSubstitution(sub.id)
                            pushToast({
                              tone: 'success',
                              title: `Cover confirmed for ${sub.className}`,
                              description: `${sub.substitute} notified on the staff app.`,
                            })
                          }}
                        >
                          Confirm cover
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const pool = DUTY_STAFF.filter(
                              (d) => (staffDuty[d.id] ?? 'present') === 'present' && d.name !== sub.absent,
                            )
                            const pick = pool[Math.floor(Math.random() * pool.length)]
                            confirmSubstitution(sub.id, pick.name)
                            pushToast({
                              tone: 'info',
                              title: `${pick.name} assigned`,
                              description: `${sub.className} ${sub.slot} · free period detected.`,
                            })
                          }}
                        >
                          Auto-assign
                        </Button>
                      </div>
                    ) : null}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </PanelCard>

          <PanelCard
            title="Workload balance"
            subtitle="Periods allocated per teacher this week"
            icon={<Clock3 className="h-4 w-4" />}
          >
            <div className="space-y-3.5">
              {[
                { label: 'Heaviest load', value: 32, max: 32, hint: 'Railway exam centre' },
                { label: 'Average load', value: 24, max: 32, hint: '24 periods' },
                { label: 'Lightest load', value: 18, max: 32, hint: '18 periods' },
              ].map((row) => (
                <DataBar
                  key={row.label}
                  label={row.label}
                  value={row.value}
                  max={row.max}
                  tone={row.label === 'Heaviest load' ? 'rose' : row.label === 'Average load' ? 'brand' : 'emerald'}
                  hint={row.hint}
                />
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-ink-200/70 bg-ink-50/70 p-3.5 dark:border-white/8 dark:bg-white/[0.03]">
              <p className="text-[11px] leading-relaxed font-medium text-ink-600 dark:text-ink-300">
                Four teachers are above the 30-period norm. Rebalancing two periods each would bring the whole wing
                within the RTE ceiling.
              </p>
            </div>
          </PanelCard>

          <PanelCard
            title="Approved leave today"
            subtitle="Notifications already sent to cover teachers"
            icon={<CalendarX2 className="h-4 w-4" />}
          >
            {onLeave.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-emerald-300/70 bg-emerald-50/50 px-4 py-6 text-center text-[11.5px] font-semibold text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
                Full attendance — nobody on leave today.
              </p>
            ) : (
              <div className="space-y-2.5">
                {onLeave.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center gap-3 rounded-2xl border border-ink-200/70 px-3.5 py-2.5 dark:border-white/8"
                  >
                    <Avatar name={person.name} size={32} tone={4} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-bold text-ink-900 dark:text-white">{person.name}</p>
                      <p className="truncate text-[10.5px] text-ink-500 dark:text-ink-400">{person.role}</p>
                    </div>
                    <Pill tone={MARK_META[staffDuty[person.id] ?? 'present'].tone}>
                      {MARK_META[staffDuty[person.id] ?? 'present'].label}
                    </Pill>
                  </div>
                ))}
              </div>
            )}
          </PanelCard>

          <PanelCard
            title="Department strength"
            subtitle="Sanctioned vs working staff"
            icon={<ClipboardList className="h-4 w-4" />}
          >
            <div className="space-y-3.5">
              {[
                { label: 'Hindi & Sanskrit', value: 14, max: 14 },
                { label: 'Mathematics', value: 11, max: 12 },
                { label: 'Science', value: 12, max: 13 },
                { label: 'Social Science', value: 9, max: 10 },
                { label: 'English', value: 8, max: 9 },
                { label: 'Physical Education', value: 4, max: 6 },
              ].map((row) => (
                <DataBar
                  key={row.label}
                  label={row.label}
                  value={row.value}
                  max={row.max}
                  tone={row.value === row.max ? 'emerald' : 'amber'}
                  hint={`${row.value}/${row.max}`}
                />
              ))}
            </div>
            <p className="mt-3.5 text-[11px] leading-relaxed text-ink-400">
              Two Physical Education posts and one Mathematics post are vacant. Recruitment advertisement published on
              12 September.
            </p>
          </PanelCard>
        </div>
      </div>

      <p className="pb-14 text-[11px] text-ink-400">
        Duty register locked at 4 pm daily · corrections require the Principal’s approval and are audit-logged
      </p>
    </div>
  )
}
