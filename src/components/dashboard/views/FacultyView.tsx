import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, BookOpen, Building2, Mail, Search, Star, UserSquare2, Users } from 'lucide-react'
import { Card, Eyebrow } from '../../ui/Card'
import { Pill } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { Avatar, Input, ProgressBar, Segmented } from '../../ui/Form'
import { EmptyState, SkeletonList } from '../../ui/Skeleton'
import { FACULTY, TIMETABLE, TIMETABLE_DAYS, TIMETABLE_SLOTS, type Faculty } from '../../../data/school'
import { useApp, useSimulatedLoad } from '../../../state/store'
import { cn } from '../../../lib/utils'

export function FacultyView() {
  const { pushToast } = useApp()
  const [query, setQuery] = useState('')
  const [wing, setWing] = useState<'all' | 'senior' | 'primary'>('all')
  const [selected, setSelected] = useState<Faculty>(FACULTY[0])
  const loading = useSimulatedLoad(wing, 480)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FACULTY.filter((f) => {
      const matchesQuery = !q || f.name.toLowerCase().includes(q) || f.subject.toLowerCase().includes(q)
      const matchesWing =
        wing === 'all' ||
        (wing === 'senior' &&
          !f.classes.includes('All') &&
          !f.classes.some((c) => c.startsWith('I') && c.length === 3)) ||
        (wing === 'primary' &&
          (f.classes.includes('All') ||
            f.classes.some((c) => /^(I|II|III|IV|V)-/.test(c)) ||
            f.classes.some((c) => c.startsWith('VI'))))
      return matchesQuery && matchesWing
    })
  }, [query, wing])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>
            <UserSquare2 className="h-3.5 w-3.5" /> Faculty & staff
          </Eyebrow>
          <h1 className="mt-2.5 text-[clamp(1.6rem,3vw,2.15rem)] leading-tight font-extrabold tracking-[-0.04em] text-ink-900 dark:text-white">
            Faculty directory
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500 dark:text-ink-400">
            138 teaching staff · 12 departments · average tenure 9.4 years.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Segmented
            value={wing}
            onChange={setWing}
            options={[
              { value: 'all', label: 'Everyone' },
              { value: 'senior', label: 'Senior wing' },
              { value: 'primary', label: 'Primary & middle' },
            ]}
          />
          <Pill tone="emerald" dot>
            0 unfilled periods today
          </Pill>
        </div>
      </div>

      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, subject or department…"
            className="pl-9"
          />
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
        <div className="space-y-3">
          {loading ? (
            <SkeletonList rows={6} />
          ) : rows.length === 0 ? (
            <Card>
              <EmptyState
                icon={<Users className="h-6 w-6" />}
                title="No faculty matched"
                description={`Nothing found for “${query}”. Try a subject name like “Physics” or “Accountancy”.`}
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setQuery('')
                      setWing('all')
                    }}
                  >
                    Reset
                  </Button>
                }
              />
            </Card>
          ) : (
            rows.map((f, i) => (
              <motion.button
                key={f.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.35) }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelected(f)}
                className={cn(
                  'surface lift flex w-full items-center gap-4 rounded-3xl p-4 text-left',
                  selected.id === f.id
                    ? 'border-brand-400/80 ring-2 ring-brand-500/20 dark:border-brand-500/40'
                    : 'hover:border-brand-300/60 dark:hover:border-brand-500/30',
                )}
              >
                <Avatar name={f.name} tone={i % 6} size={46} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-bold tracking-[-0.02em] text-ink-900 dark:text-white">{f.name}</p>
                    <Pill tone="brand">{f.subject}</Pill>
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-ink-500 dark:text-ink-400">
                    {f.designation} · {f.experience} yrs experience · Room {f.room}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {f.classes.map((c) => (
                      <span
                        key={c}
                        className="rounded-lg border border-ink-200/80 bg-ink-50 px-2 py-0.5 font-mono text-[10.5px] font-semibold text-ink-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-ink-300"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="inline-flex items-center gap-1 text-[13px] font-extrabold text-ink-900 dark:text-white">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {f.rating.toFixed(1)}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-ink-400">parent rating</p>
                </div>
              </motion.button>
            ))
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-start gap-4">
              <Avatar name={selected.name} tone={2} size={56} />
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-extrabold tracking-[-0.02em] text-ink-900 dark:text-white">
                  {selected.name}
                </p>
                <p className="text-[12px] text-ink-500 dark:text-ink-400">
                  {selected.designation} · {selected.subject}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Pill tone="violet">{selected.experience} years</Pill>
                  <Pill tone="emerald" dot>
                    On duty
                  </Pill>
                  <Pill tone="amber" icon={<Star className="h-3 w-3" />}>
                    {selected.rating.toFixed(1)}
                  </Pill>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { k: 'Room / lab', v: selected.room, icon: Building2 },
                { k: 'Classes', v: selected.classes.join(', '), icon: BookOpen },
                { k: 'Papers set · term', v: `${2 + (selected.experience % 3)}`, icon: Award },
                { k: 'Periods / week', v: `${18 + (selected.experience % 6)}`, icon: Users },
              ].map((row) => (
                <div key={row.k} className="rounded-2xl border border-ink-200/80 px-3.5 py-3 dark:border-white/8">
                  <p className="inline-flex items-center gap-1.5 text-[10.5px] font-bold tracking-[0.1em] text-ink-400 uppercase">
                    <row.icon className="h-3 w-3" /> {row.k}
                  </p>
                  <p className="mt-1 truncate text-[12.5px] font-bold text-ink-900 dark:text-white">{row.v}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11.5px] font-semibold text-ink-500 dark:text-ink-400">
                  <span>Syllabus completion · Term 2</span>
                  <span className="tabular text-ink-800 dark:text-ink-100">{62 + (selected.experience % 30)}%</span>
                </div>
                <ProgressBar value={62 + (selected.experience % 30)} tone="brand" className="mt-1.5" />
              </div>
              <div>
                <div className="flex items-center justify-between text-[11.5px] font-semibold text-ink-500 dark:text-ink-400">
                  <span>Average section score</span>
                  <span className="tabular text-ink-800 dark:text-ink-100">{68 + (selected.experience % 22)}%</span>
                </div>
                <ProgressBar value={68 + (selected.experience % 22)} tone="emerald" className="mt-1.5" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                icon={<Mail className="h-3.5 w-3.5" />}
                onClick={() =>
                  pushToast({
                    tone: 'success',
                    title: 'Email drafted',
                    description: `To ${selected.email} · subject line pre-filled from the last thread.`,
                  })
                }
              >
                Email
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  pushToast({
                    tone: 'info',
                    title: 'Appraisal cycle opened',
                    description: `${selected.name} · self-assessment form sent, due 30 September.`,
                  })
                }
              >
                Start appraisal
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <p className="text-[11px] font-bold tracking-[0.14em] text-ink-400 uppercase">
              Weekly timetable · Class XII-B
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-[11px]">
                <thead>
                  <tr>
                    <th className="px-1.5 py-1.5 text-left text-[10px] font-bold tracking-[0.1em] text-ink-400 uppercase">
                      Day
                    </th>
                    {TIMETABLE_SLOTS.map((s) => (
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
                      {TIMETABLE[day].map((slot, i) => {
                        const isMine = slot.toLowerCase().includes(selected.subject.toLowerCase().slice(0, 5))
                        const isBreak = slot.startsWith('—')
                        return (
                          <td key={`${day}-${i}`} className="px-0.5 py-1">
                            <span
                              className={cn(
                                'block truncate rounded-lg px-1.5 py-1 text-center text-[9.5px] font-semibold',
                                isBreak
                                  ? 'bg-transparent text-ink-300 dark:text-ink-600'
                                  : isMine
                                    ? 'bg-brand-600 text-white'
                                    : 'bg-ink-100 text-ink-600 dark:bg-white/8 dark:text-ink-300',
                              )}
                              title={slot}
                            >
                              {slot}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
