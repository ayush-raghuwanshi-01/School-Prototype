import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  BadgeCheck,
  Beaker,
  BookMarked,
  Briefcase,
  CalendarClock,
  CircleDollarSign,
  Download,
  FlaskConical,
  GraduationCap,
  Landmark,
  Scale,
  Users,
} from 'lucide-react'
import { PROGRAMS, type Program } from '../../data/school'
import { Button } from '../ui/Button'
import { Eyebrow } from '../ui/Card'
import { Pill, type Tone } from '../ui/Badge'
import { ProgressBar } from '../ui/Form'
import { cn, inr, inrCompact } from '../../lib/utils'
import { useApp } from '../../state/store'

type Level = Program['level']
const LEVELS: { id: Level; label: string; caption: string; icon: typeof GraduationCap }[] = [
  { id: 'Primary', label: 'Primary', caption: 'Grades I – V', icon: BookMarked },
  { id: 'Middle', label: 'Middle', caption: 'Grades VI – VIII', icon: Beaker },
  { id: 'Secondary', label: 'Secondary', caption: 'Grades IX – X', icon: FlaskConical },
  { id: 'Senior Secondary', label: 'Senior Secondary', caption: 'Grades XI – XII', icon: GraduationCap },
]

const STREAM_ICONS: Record<string, typeof GraduationCap> = {
  Science: FlaskConical,
  Commerce: CircleDollarSign,
  Humanities: Scale,
}

function ProgramCard({ program, index }: { program: Program; index: number }) {
  const { pushToast, setRoute } = useApp()
  const [expanded, setExpanded] = useState(false)
  const fill = Math.round((program.applied / (program.seats * 2.4)) * 100)
  const StreamIcon = program.stream ? STREAM_ICONS[program.stream] : LEVELS.find((l) => l.id === program.level)!.icon

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 26, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.985 }}
      transition={{ duration: 0.42, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5 }}
      className="group surface lift relative flex flex-col overflow-hidden rounded-3xl p-6 hover:border-brand-300/70 dark:hover:border-brand-500/35"
    >
      <div
        className={cn(
          'pointer-events-none absolute -top-24 -right-16 h-52 w-52 rounded-full opacity-45 blur-3xl transition-opacity duration-500 group-hover:opacity-80',
          program.accent === 'brand' && 'bg-brand-500/30',
          program.accent === 'violet' && 'bg-violet-accent-500/30',
          program.accent === 'emerald' && 'bg-emerald-500/30',
          program.accent === 'amber' && 'bg-amber-500/30',
          program.accent === 'rose' && 'bg-rose-500/30',
          program.accent === 'cyan' && 'bg-cyan-500/30',
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <span
          className={cn(
            'grid h-11 w-11 place-items-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105',
            program.accent === 'brand' && 'bg-gradient-to-br from-brand-500 to-brand-700',
            program.accent === 'violet' && 'bg-gradient-to-br from-violet-accent-500 to-violet-accent-700',
            program.accent === 'emerald' && 'bg-gradient-to-br from-emerald-500 to-emerald-700',
            program.accent === 'amber' && 'bg-gradient-to-br from-amber-400 to-orange-600',
            program.accent === 'rose' && 'bg-gradient-to-br from-rose-500 to-pink-700',
            program.accent === 'cyan' && 'bg-gradient-to-br from-cyan-500 to-sky-700',
          )}
        >
          <StreamIcon className="h-5 w-5" />
        </span>
        <div className="flex flex-col items-end gap-1.5">
          <Pill tone={program.accent as Tone} dot>
            {program.stream ?? program.level}
          </Pill>
          <span className="text-[11px] font-bold tracking-[0.06em] text-ink-400 uppercase">{program.grades}</span>
        </div>
      </div>

      <h3 className="relative mt-5 text-[21px] leading-tight font-extrabold tracking-[-0.03em] text-ink-900 dark:text-white">
        {program.stream ? `${program.stream} Stream` : `${program.level} Wing`}
      </h3>
      <p className="relative mt-2 text-[13.5px] leading-relaxed text-ink-600 dark:text-ink-300">{program.blurb}</p>

      <ul className="relative mt-4 space-y-2">
        {program.highlights.map((h, i) => (
          <motion.li
            key={h}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 + i * 0.05 }}
            className="flex items-start gap-2 text-[13px] font-medium text-ink-700 dark:text-ink-200"
          >
            <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
            {h}
          </motion.li>
        ))}
      </ul>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden"
          >
            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-dashed border-ink-200 pt-4 dark:border-white/10">
              {program.subjects.map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-ink-200/80 bg-ink-50 px-2 py-1 text-[11px] font-semibold text-ink-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-ink-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="press ring-focus relative mt-4 self-start text-[12.5px] font-bold text-brand-600 underline decoration-brand-300 decoration-2 underline-offset-4 transition-colors hover:text-brand-700 dark:text-brand-300"
      >
        {expanded ? 'Hide subject matrix' : `View all ${program.subjects.length} subjects`}
      </button>

      <div className="relative mt-5 space-y-2.5 rounded-2xl border border-ink-200/70 bg-ink-50/70 p-4 dark:border-white/8 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between text-[12px]">
          <span className="font-bold text-ink-600 dark:text-ink-300">Seat demand</span>
          <span className="font-bold text-ink-900 tabular dark:text-white">
            {program.applied} applied · {program.seats} seats
          </span>
        </div>
        <ProgressBar value={fill} tone={program.accent === 'rose' ? 'rose' : (program.accent as Tone)} />
        <div className="flex items-center justify-between pt-0.5">
          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-500 dark:text-ink-400">
            <Users className="h-3 w-3" /> Teacher ratio {program.ratio}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-ink-900 dark:text-white">
            <CalendarClock className="h-3 w-3 text-brand-600 dark:text-brand-400" /> Annual {inrCompact(program.fee)}
          </span>
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap items-center gap-2 pt-0.5">
        <Button
          size="sm"
          onClick={() => {
            setRoute('dashboard')
            pushToast({
              tone: 'success',
              title: `Application draft created`,
              description: `${program.stream ? `${program.stream} Stream` : `${program.level} Wing`} · session 2026–27`,
            })
          }}
          icon={<ArrowUpRight className="h-3.5 w-3.5" />}
        >
          Apply online
        </Button>
        <Button
          size="sm"
          variant="ghost"
          icon={<Download className="h-3.5 w-3.5" />}
          onClick={() =>
            pushToast({
              tone: 'info',
              title: 'Curriculum handbook queued',
              description: `A 48-page PDF for ${program.grades} will be emailed to you.`,
            })
          }
        >
          Handbook
        </Button>
      </div>

      <span className="relative mt-4 text-[11px] font-medium text-ink-400">
        Annual fee {inr(program.fee)} · payable in 3 termly instalments
      </span>
    </motion.article>
  )
}

export function ProgramsSection() {
  const [level, setLevel] = useState<Level>('Primary')
  const [stream, setStream] = useState<Program['stream']>('Science')
  const visible = PROGRAMS.filter((p) => p.level === level)
  const senior = level === 'Senior Secondary'
  const cards = senior ? visible.filter((p) => p.stream === stream) : visible

  return (
    <section id="programs" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>
              <Landmark className="h-3.5 w-3.5" /> Academic Programs
            </Eyebrow>
            <h2 className="mt-4 text-[clamp(2rem,4.4vw,3.1rem)] leading-[1.02] font-extrabold tracking-[-0.04em] text-ink-900 dark:text-white">
              Fourteen years, six pathways,
              <span className="editorial italic text-brand-600 dark:text-brand-400"> one spine. </span>
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
              Every wing shares the same assessment spine and mentoring cadence. What changes is the depth of
              specialisation — and the lab you spend your afternoons in.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-ink-200/80 bg-white/70 px-4 py-3 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]">
            <Briefcase className="h-4 w-4 text-violet-accent-600" />
            <p className="text-[12px] leading-tight font-semibold text-ink-600 dark:text-ink-300">
              780 seats released
              <span className="block font-normal text-ink-400">for session 2026–27</span>
            </p>
          </div>
        </div>

        {/* Level tabs */}
        <div className="mt-10 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {LEVELS.map((l) => {
            const active = level === l.id
            return (
              <button
                key={l.id}
                onClick={() => setLevel(l.id)}
                className={cn(
                  'press ring-focus relative shrink-0 rounded-2xl border px-4 py-3 text-left transition-all duration-300',
                  active
                    ? 'border-ink-900 bg-ink-900 text-white shadow-[0_16px_40px_-22px_rgb(15_23_42_/_0.9)] dark:border-brand-600 dark:bg-brand-600'
                    : 'border-ink-200/80 bg-white/70 text-ink-700 hover:-translate-y-0.5 hover:border-ink-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-200 dark:hover:border-white/20',
                )}
              >
                <span className="flex items-center gap-2">
                  <l.icon className={cn('h-4 w-4', active ? 'text-white' : 'text-brand-600 dark:text-brand-400')} />
                  <span className="text-[13.5px] font-bold tracking-[-0.01em]">{l.label}</span>
                </span>
                <span
                  className={cn('mt-0.5 block pl-6 text-[11px] font-medium', active ? 'text-white/70' : 'text-ink-400')}
                >
                  {l.caption}
                </span>
              </button>
            )
          })}
        </div>

        {/* Stream sub-tabs for Senior Secondary */}
        <AnimatePresence initial={false}>
          {senior ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-5 flex flex-wrap items-center gap-2 pl-0.5">
                <span className="text-[11.5px] font-bold tracking-[0.14em] text-ink-400 uppercase">Streams</span>
                <div className="flex items-center gap-1 rounded-2xl border border-ink-200/80 bg-ink-100/70 p-1 dark:border-white/10 dark:bg-white/[0.04]">
                  {(['Science', 'Commerce', 'Humanities'] as const).map((s) => {
                    const active = stream === s
                    return (
                      <button
                        key={s}
                        onClick={() => setStream(s)}
                        className={cn(
                          'press relative rounded-xl px-3.5 py-1.5 text-[12.5px] font-bold transition-colors',
                          active
                            ? 'text-white'
                            : 'text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white',
                        )}
                      >
                        {active ? (
                          <motion.span
                            layoutId="stream-pill"
                            className="absolute inset-0 rounded-xl bg-violet-accent-600"
                            transition={{ type: 'spring', stiffness: 480, damping: 34 }}
                          />
                        ) : null}
                        <span className="relative z-10">{s}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {cards.map((p, i) => (
              <ProgramCard key={p.id} program={p} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
