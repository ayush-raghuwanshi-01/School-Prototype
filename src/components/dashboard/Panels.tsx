import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, Star } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Card } from '../ui/Card'
import { Pill, type Tone } from '../ui/Badge'
import type { Approval, Notice, Task, TaskPriority } from '../../data/school'

/* ------------------------------------------------------------------ *
 * Small shared building blocks used across the console module panels.
 * ------------------------------------------------------------------ */

export function PanelCard({
  title,
  subtitle,
  icon,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string
  subtitle?: string
  icon?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <Card className={cn('flex flex-col p-5', className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          {icon ? (
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-500 dark:bg-white/8 dark:text-ink-300">
              {icon}
            </span>
          ) : null}
          <div className="min-w-0">
            <h3 className="truncate text-[14.5px] font-bold tracking-[-0.015em] text-ink-900 dark:text-white">
              {title}
            </h3>
            {subtitle ? (
              <p className="mt-0.5 text-[11.5px] leading-snug text-ink-500 dark:text-ink-400">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {action ? <div className="flex shrink-0 items-center gap-1.5">{action}</div> : null}
      </div>
      <div className={cn('min-w-0 flex-1', bodyClassName)}>{children}</div>
    </Card>
  )
}

export function PriorityPill({ priority }: { priority: TaskPriority | Approval['priority'] }) {
  const map: Record<string, Tone> = { high: 'rose', normal: 'brand', medium: 'amber', low: 'slate' }
  return (
    <Pill tone={map[priority] ?? 'slate'} dot className="capitalize">
      {priority}
    </Pill>
  )
}

export function TaskRow({
  task,
  onToggle,
  onDelete,
  index = 0,
}: {
  task: Task
  onToggle: () => void
  onDelete: () => void
  index?: number
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.03, 0.2), ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group flex items-start gap-3 rounded-2xl border px-3.5 py-3 transition-colors',
        task.done
          ? 'border-ink-200/60 bg-ink-50/50 dark:border-white/6 dark:bg-white/[0.015]'
          : 'border-ink-200/70 bg-white/70 hover:border-brand-300/70 dark:border-white/8 dark:bg-white/[0.03] dark:hover:border-brand-500/35',
      )}
    >
      <button
        onClick={onToggle}
        aria-label={task.done ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as done`}
        className={cn(
          'press ring-focus mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-all duration-200',
          task.done
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-ink-300 hover:border-brand-500 dark:border-white/20 dark:hover:border-brand-400',
        )}
      >
        {task.done ? <Check className="h-3 w-3" strokeWidth={3.5} /> : null}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-[12.5px] leading-snug font-semibold tracking-[-0.01em] transition-colors',
            task.done ? 'text-ink-400 line-through dark:text-ink-500' : 'text-ink-900 dark:text-white',
          )}
        >
          {task.title}
        </p>
        {task.detail ? (
          <p className="mt-0.5 text-[11px] leading-relaxed text-ink-500 dark:text-ink-400">{task.detail}</p>
        ) : null}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10.5px] font-semibold text-ink-400">
          <span className="inline-flex items-center gap-1">
            <span className={cn('h-1.5 w-1.5 rounded-full', task.done ? 'bg-ink-300' : 'bg-brand-500')} />
            {task.due}
          </span>
          <span>· {task.assignee}</span>
          <span>· {task.category}</span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <PriorityPill priority={task.priority} />
        <button
          onClick={onDelete}
          className="press text-[10.5px] font-bold text-ink-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-rose-500 focus:opacity-100"
        >
          Remove
        </button>
      </div>
    </motion.div>
  )
}

export function RatingStars({ rating, size = 3.5 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
          className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-ink-300 dark:text-ink-600'}
        />
      ))}
    </span>
  )
}

export function SentimentPill({ sentiment }: { sentiment: 'positive' | 'neutral' | 'concern' }) {
  const map = {
    positive: { tone: 'emerald' as Tone, label: 'Positive' },
    neutral: { tone: 'slate' as Tone, label: 'Neutral' },
    concern: { tone: 'amber' as Tone, label: 'Needs action' },
  }
  return (
    <Pill tone={map[sentiment].tone} dot>
      {map[sentiment].label}
    </Pill>
  )
}

export const NOTICE_TONE: Record<Notice['priority'], Tone> = {
  urgent: 'rose',
  normal: 'brand',
  info: 'slate',
}

export function SectionLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="press inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11.5px] font-bold text-brand-600 transition-colors hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10"
    >
      {label}
      <ArrowUpRight className="h-3 w-3" />
    </button>
  )
}

export function DataBar({
  label,
  value,
  max,
  tone = 'brand',
  hint,
}: {
  label: string
  value: number
  max: number
  tone?: Tone
  hint?: string
}) {
  const pctValue = max ? (value / max) * 100 : 0
  const colors: Record<string, string> = {
    brand: 'bg-brand-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    violet: 'bg-violet-accent-600',
    cyan: 'bg-cyan-500',
    slate: 'bg-ink-400',
  }
  return (
    <div>
      <div className="flex items-center justify-between text-[11.5px]">
        <span className="font-semibold text-ink-600 dark:text-ink-300">{label}</span>
        <span className="font-bold tabular text-ink-900 dark:text-white">{hint ?? `${pctValue.toFixed(1)}%`}</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
        <motion.div
          className={cn('h-full rounded-full', colors[tone] ?? colors.brand)}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, pctValue)}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}
