import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import type { FeeStatus } from '../../data/school'

export type Tone = 'brand' | 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'slate'

export const TONES: Record<Tone, { chip: string; dot: string; solid: string; soft: string; text: string }> = {
  brand: {
    chip: 'bg-brand-50 text-brand-700 border-brand-200/80 dark:bg-brand-500/15 dark:text-brand-200 dark:border-brand-400/25',
    dot: 'bg-brand-600',
    solid: 'bg-brand-600 text-white',
    soft: 'bg-brand-50 dark:bg-brand-500/12',
    text: 'text-brand-700 dark:text-brand-300',
  },
  violet: {
    chip: 'bg-violet-accent-50 text-violet-accent-700 border-violet-accent-100 dark:bg-violet-accent-500/15 dark:text-violet-accent-400 dark:border-violet-accent-400/25',
    dot: 'bg-violet-accent-600',
    solid: 'bg-violet-accent-600 text-white',
    soft: 'bg-violet-accent-50 dark:bg-violet-accent-500/12',
    text: 'text-violet-accent-700 dark:text-violet-accent-400',
  },
  emerald: {
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-400/25',
    dot: 'bg-emerald-500',
    solid: 'bg-emerald-600 text-white',
    soft: 'bg-emerald-50 dark:bg-emerald-500/12',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  amber: {
    chip: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-400/25',
    dot: 'bg-amber-500',
    solid: 'bg-amber-500 text-ink-900',
    soft: 'bg-amber-50 dark:bg-amber-500/12',
    text: 'text-amber-700 dark:text-amber-300',
  },
  rose: {
    chip: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-400/25',
    dot: 'bg-rose-500',
    solid: 'bg-rose-600 text-white',
    soft: 'bg-rose-50 dark:bg-rose-500/12',
    text: 'text-rose-700 dark:text-rose-300',
  },
  cyan: {
    chip: 'bg-cyan-50 text-cyan-700 border-cyan-200/80 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-400/25',
    dot: 'bg-cyan-500',
    solid: 'bg-cyan-600 text-white',
    soft: 'bg-cyan-50 dark:bg-cyan-500/12',
    text: 'text-cyan-700 dark:text-cyan-300',
  },
  slate: {
    chip: 'bg-ink-100 text-ink-700 border-ink-200 dark:bg-white/8 dark:text-ink-200 dark:border-white/12',
    dot: 'bg-ink-400',
    solid: 'bg-ink-800 text-white',
    soft: 'bg-ink-100 dark:bg-white/8',
    text: 'text-ink-600 dark:text-ink-300',
  },
}

export function Pill({
  children,
  tone = 'slate',
  className,
  dot,
  icon,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
  dot?: boolean
  icon?: ReactNode
}) {
  const t = TONES[tone]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-bold tracking-[0.01em] whitespace-nowrap',
        t.chip,
        className,
      )}
    >
      {dot ? <span className={cn('h-1.5 w-1.5 rounded-full', t.dot)} /> : null}
      {icon}
      {children}
    </span>
  )
}

export function FeePill({ status, className }: { status: FeeStatus; className?: string }) {
  const map: Record<FeeStatus, { tone: Tone; label: string }> = {
    paid: { tone: 'emerald', label: 'Paid' },
    pending: { tone: 'amber', label: 'Pending' },
    overdue: { tone: 'rose', label: 'Overdue' },
  }
  const { tone, label } = map[status]
  return (
    <Pill tone={tone} dot className={cn('uppercase tracking-[0.08em]', className)}>
      {label}
    </Pill>
  )
}
