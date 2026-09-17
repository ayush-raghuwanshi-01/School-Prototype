import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  GraduationCap,
  Camera,
  Newspaper,
  Phone,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
  Footprints,
  Share2,
} from 'lucide-react'
import { Card, Eyebrow } from '../../ui/Card'
import { Pill, type Tone } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { Avatar, ProgressBar, Segmented } from '../../ui/Form'
import { SkeletonList } from '../../ui/Skeleton'
import { STAGES, useApp } from '../../../state/store'
import type { Applicant } from '../../../data/school'
import { cn, formatDate } from '../../../lib/utils'

const STAGE_TONE: Record<Applicant['stage'], Tone> = {
  Enquiry: 'slate',
  Assessment: 'brand',
  Interview: 'violet',
  Offer: 'amber',
  Enrolled: 'emerald',
}

const SOURCE_ICON: Record<Applicant['source'], typeof Camera> = {
  Website: GraduationCap,
  Referral: Share2,
  'Walk-in': Footprints,
  Instagram: Camera,
  Newspaper: Newspaper,
}

export function AdmissionsView() {
  const { applicants, moveApplicant, pushToast } = useApp()
  const [stageFilter, setStageFilter] = useState<'all' | Applicant['stage']>('all')
  const [selected, setSelected] = useState<Applicant | null>(applicants[0] ?? null)
  const [loading] = useState(false)

  const grouped = useMemo(
    () => STAGES.map((stage) => ({ stage, items: applicants.filter((a) => a.stage === stage) })),
    [applicants],
  )

  const visible = useMemo(
    () => (stageFilter === 'all' ? applicants : applicants.filter((a) => a.stage === stageFilter)),
    [applicants, stageFilter],
  )

  const advance = (a: Applicant) => {
    const idx = STAGES.indexOf(a.stage)
    if (idx >= STAGES.length - 1) {
      pushToast({
        tone: 'info',
        title: `${a.childName} is already enrolled`,
        description: 'No further pipeline stages.',
      })
      return
    }
    const next = STAGES[idx + 1]
    moveApplicant(a.id, next)
    pushToast({
      tone: 'success',
      title: `${a.childName} moved to ${next}`,
      description: `${a.gradeApplied} · guardian ${a.guardian} notified automatically.`,
    })
  }

  const conversion = (applicants.filter((a) => a.stage === 'Enrolled').length / applicants.length) * 100

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>
            <UserPlus className="h-3.5 w-3.5" /> Growth & admissions
          </Eyebrow>
          <h1 className="mt-2.5 text-[clamp(1.6rem,3vw,2.15rem)] leading-tight font-extrabold tracking-[-0.04em] text-ink-900 dark:text-white">
            Admissions pipeline
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500 dark:text-ink-400">
            {applicants.length} live applications · {conversion.toFixed(1)}% conversion to enrolment this cycle.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Pill tone="violet" icon={<Sparkles className="h-3 w-3" />}>
            Avg response 3h 40m
          </Pill>
          <Button
            size="sm"
            icon={<CalendarDays className="h-3.5 w-3.5" />}
            onClick={() =>
              pushToast({
                tone: 'info',
                title: 'Assessment slots published',
                description: 'Saturday 20 Sep · 42 slots · parents invited by SMS.',
              })
            }
          >
            Publish slots
          </Button>
        </div>
      </div>

      {/* Funnel */}
      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {grouped.map((g, i) => (
          <motion.button
            key={g.stage}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStageFilter(stageFilter === g.stage ? 'all' : g.stage)}
            className={cn(
              'surface lift rounded-3xl p-4 text-left',
              stageFilter === g.stage
                ? 'border-brand-400/80 ring-2 ring-brand-500/20 dark:border-brand-500/40'
                : 'hover:border-brand-300/60 dark:hover:border-brand-500/30',
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-[0.12em] text-ink-400 uppercase">{g.stage}</span>
              <Pill tone={STAGE_TONE[g.stage]}>{g.items.length}</Pill>
            </div>
            <p className="mt-3 text-[24px] leading-none font-extrabold tracking-[-0.04em] tabular text-ink-900 dark:text-white">
              {g.items.length}
            </p>
            <ProgressBar
              value={(g.items.length / Math.max(...grouped.map((x) => x.items.length || 1))) * 100}
              tone={STAGE_TONE[g.stage] === 'slate' ? 'slate' : (STAGE_TONE[g.stage] as Tone)}
              className="mt-3"
            />
          </motion.button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <Card className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-[15px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">Applications</h3>
              <p className="text-[12px] text-ink-500 dark:text-ink-400">
                {stageFilter === 'all' ? 'All stages' : `Filtered: ${stageFilter}`} · newest first
              </p>
            </div>
            <Segmented
              size="sm"
              value={stageFilter}
              onChange={setStageFilter}
              options={[{ value: 'all', label: 'All' }, ...STAGES.map((s) => ({ value: s, label: s }))]}
            />
          </div>

          {loading ? (
            <SkeletonList rows={7} />
          ) : visible.length === 0 ? (
            <div className="py-12 text-center">
              <Filter className="mx-auto h-8 w-8 text-ink-300 dark:text-ink-600" />
              <p className="mt-3 text-[13.5px] font-bold text-ink-800 dark:text-ink-100">Nothing at this stage</p>
              <p className="mt-1 text-[12px] text-ink-500 dark:text-ink-400">
                Move a candidate forward from another stage.
              </p>
              <Button size="sm" variant="outline" className="mt-4" onClick={() => setStageFilter('all')}>
                Show all stages
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {visible.map((a, i) => {
                  const Icon = SOURCE_ICON[a.source]
                  return (
                    <motion.div
                      key={a.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -18 }}
                      transition={{ delay: Math.min(i * 0.03, 0.25) }}
                      onClick={() => setSelected(a)}
                      className={cn(
                        'group flex cursor-pointer flex-wrap items-center gap-3 rounded-2xl border px-4 py-3 transition-colors',
                        selected?.id === a.id
                          ? 'border-brand-400/70 bg-brand-50/60 dark:border-brand-500/40 dark:bg-brand-500/10'
                          : 'border-ink-200/70 bg-white/60 hover:border-ink-300 dark:border-white/8 dark:bg-white/[0.02] dark:hover:border-white/16',
                      )}
                    >
                      <Avatar name={a.childName} tone={i % 6} size={36} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
                          {a.childName}
                        </p>
                        <p className="truncate text-[11px] text-ink-500 dark:text-ink-400">
                          {a.gradeApplied} · {a.guardian} · {a.city}
                        </p>
                      </div>
                      <span className="hidden items-center gap-1.5 text-[11px] font-semibold text-ink-400 sm:flex">
                        <Icon className="h-3.5 w-3.5" />
                        {a.source}
                      </span>
                      <span className="hidden font-mono text-[10.5px] text-ink-400 md:block">
                        {formatDate(a.appliedOn, { day: '2-digit', month: 'short' })}
                      </span>
                      <Pill tone={STAGE_TONE[a.stage]} dot>
                        {a.stage}
                      </Pill>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          advance(a)
                        }}
                        className="press inline-flex h-8 items-center gap-1 rounded-lg bg-ink-900 px-2.5 text-[11px] font-bold text-white opacity-0 transition-all group-hover:opacity-100 focus:opacity-100 dark:bg-brand-600"
                      >
                        Advance
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </Card>

        {/* Detail */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar name={selected.childName} tone={3} size={54} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[16px] font-extrabold tracking-[-0.02em] text-ink-900 dark:text-white">
                        {selected.childName}
                      </p>
                      <p className="text-[12px] text-ink-500 dark:text-ink-400">
                        {selected.gradeApplied} · {selected.city}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Pill tone={STAGE_TONE[selected.stage]} dot>
                          {selected.stage}
                        </Pill>
                        <Pill tone="brand">Assessment {selected.score}%</Pill>
                        <Pill tone="slate">{selected.source}</Pill>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { k: 'Guardian', v: selected.guardian },
                      { k: 'Applied on', v: formatDate(selected.appliedOn) },
                      { k: 'Contact', v: '+91 98110 ••219' },
                      { k: 'Reference', v: `VG-ADM-${4100 + Number(selected.id.replace(/\D/g, '')) * 3}` },
                    ].map((row) => (
                      <div key={row.k} className="rounded-2xl border border-ink-200/80 px-3.5 py-3 dark:border-white/8">
                        <p className="text-[10.5px] font-bold tracking-[0.12em] text-ink-400 uppercase">{row.k}</p>
                        <p className="mt-1 truncate text-[12.5px] font-bold text-ink-900 dark:text-white">{row.v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Stage stepper */}
                  <div className="mt-4">
                    <p className="text-[11px] font-bold tracking-[0.14em] text-ink-400 uppercase">Pipeline stage</p>
                    <div className="mt-3 flex items-center gap-1.5">
                      {STAGES.map((s, i) => {
                        const currentIdx = STAGES.indexOf(selected.stage)
                        const done = i <= currentIdx
                        return (
                          <button
                            key={s}
                            onClick={() => {
                              moveApplicant(selected.id, s)
                              setSelected({ ...selected, stage: s })
                              pushToast({
                                tone: 'info',
                                title: `Stage set to ${s}`,
                                description: `${selected.childName} · audit entry recorded.`,
                              })
                            }}
                            className="press group flex-1"
                            title={`Set stage to ${s}`}
                          >
                            <span
                              className={cn(
                                'block h-1.5 rounded-full transition-colors',
                                done
                                  ? 'bg-brand-600'
                                  : 'bg-ink-200 group-hover:bg-ink-300 dark:bg-white/12 dark:group-hover:bg-white/25',
                              )}
                            />
                            <span
                              className={cn(
                                'mt-1.5 block truncate text-[9.5px] font-bold',
                                done ? 'text-brand-700 dark:text-brand-300' : 'text-ink-400',
                              )}
                            >
                              {s}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      icon={<ArrowRight className="h-3.5 w-3.5" />}
                      onClick={() => {
                        advance(selected)
                        const idx = STAGES.indexOf(selected.stage)
                        if (idx < STAGES.length - 1) setSelected({ ...selected, stage: STAGES[idx + 1] })
                      }}
                    >
                      Advance stage
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      icon={<Phone className="h-3.5 w-3.5" />}
                      onClick={() =>
                        pushToast({
                          tone: 'success',
                          title: `Calling ${selected.guardian}`,
                          description: 'Dialler opened · interaction will be auto-logged.',
                        })
                      }
                    >
                      Call guardian
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<ChevronLeft className="h-3.5 w-3.5" />}
                      onClick={() => {
                        const idx = STAGES.indexOf(selected.stage)
                        if (idx === 0) return
                        moveApplicant(selected.id, STAGES[idx - 1])
                        setSelected({ ...selected, stage: STAGES[idx - 1] })
                      }}
                    >
                      Move back
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <Card className="p-5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-violet-accent-600 text-white">
                <TrendingUp className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[13px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
                  Source performance
                </p>
                <p className="text-[11.5px] text-ink-500 dark:text-ink-400">Cost per enrolment and quality score</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Website', value: 38, quality: 88, tone: 'brand' as Tone },
                { label: 'Referral (existing parents)', value: 27, quality: 94, tone: 'emerald' as Tone },
                { label: 'Instagram', value: 18, quality: 79, tone: 'violet' as Tone },
                { label: 'Walk-in', value: 11, quality: 72, tone: 'amber' as Tone },
                { label: 'Newspaper insert', value: 6, quality: 64, tone: 'rose' as Tone },
              ].map((s, i) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="font-semibold text-ink-600 dark:text-ink-300">{s.label}</span>
                    <span className="font-bold tabular text-ink-900 dark:text-white">{s.value}%</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <ProgressBar value={s.value * 2.4} tone={s.tone} className="flex-1" />
                    <span className="w-14 shrink-0 text-right text-[10.5px] font-semibold text-ink-400">
                      Q {s.quality}
                    </span>
                  </div>
                  <motion.span
                    className="sr-only"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-ink-200/70 bg-ink-50/70 p-3.5 dark:border-white/8 dark:bg-white/[0.03]">
              <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
              <p className="text-[11.5px] leading-relaxed font-medium text-ink-600 dark:text-ink-300">
                Referral applications convert 2.4× better than paid channels. Consider doubling the sibling referral
                incentive (currently ₹15,000 fee credit).
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
