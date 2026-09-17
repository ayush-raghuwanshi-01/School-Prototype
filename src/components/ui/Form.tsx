import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn, initials } from '../../lib/utils'
import { TONES, type Tone } from './Badge'

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 flex items-center justify-between">
        <span className="text-[12.5px] font-bold tracking-[-0.01em] text-ink-700 dark:text-ink-200">{label}</span>
        {hint ? <span className="text-[11px] text-ink-400 dark:text-ink-500">{hint}</span> : null}
      </span>
      {children}
    </label>
  )
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'ring-focus h-11 w-full rounded-xl border border-ink-200 bg-white px-3.5 text-sm font-medium text-ink-900 shadow-sm transition-all',
        'placeholder:font-normal placeholder:text-ink-400 hover:border-ink-300',
        'dark:border-white/12 dark:bg-white/[0.05] dark:text-white dark:placeholder:text-ink-500 dark:hover:border-white/20',
        'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
        className,
      )}
      {...rest}
    />
  )
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'ring-focus h-11 w-full appearance-none rounded-xl border border-ink-200 bg-white bg-[length:16px] bg-[right_0.85rem_center] bg-no-repeat px-3.5 pr-10 text-sm font-medium text-ink-900 shadow-sm transition-all',
        'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%2364748b%27 stroke-width=%272%27%3E%3Cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")]',
        'hover:border-ink-300 dark:border-white/12 dark:bg-white/[0.05] dark:text-white dark:hover:border-white/20',
        'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  )
}

export function Avatar({
  name,
  size = 36,
  tone = 0,
  ring,
  className,
}: {
  name: string
  size?: number
  tone?: number
  ring?: boolean
  className?: string
}) {
  const palettes = [
    'from-brand-500 to-brand-700',
    'from-violet-accent-500 to-violet-accent-700',
    'from-emerald-500 to-emerald-700',
    'from-amber-400 to-orange-600',
    'from-cyan-500 to-sky-700',
    'from-rose-500 to-pink-700',
  ]
  return (
    <span
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.34) }}
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-bold tracking-[-0.02em] text-white select-none',
        palettes[tone % palettes.length],
        ring && 'ring-2 ring-white dark:ring-ink-900',
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
  size = 'md',
}: {
  options: { value: T; label: string; icon?: ReactNode; badge?: ReactNode }[]
  value: T
  onChange: (v: T) => void
  className?: string
  size?: 'sm' | 'md'
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-2xl border border-ink-200/80 bg-ink-100/70 p-1 dark:border-white/10 dark:bg-white/[0.04]',
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'press ring-focus relative rounded-xl font-semibold tracking-[-0.01em] transition-colors duration-200',
              size === 'sm' ? 'h-8 px-3 text-[12.5px]' : 'h-9.5 px-3.5 text-[13px]',
              active ? 'text-white' : 'text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white',
            )}
          >
            {active ? (
              <motion.span
                layoutId={`segmented-${options.map((o) => o.value).join('')}`}
                className="absolute inset-0 rounded-xl bg-ink-900 shadow-sm dark:bg-brand-600"
                transition={{ type: 'spring', stiffness: 480, damping: 34 }}
              />
            ) : null}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {opt.icon}
              {opt.label}
              {opt.badge}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function ProgressBar({
  value,
  tone = 'brand',
  className,
  showLabel,
}: {
  value: number
  tone?: Tone
  className?: string
  showLabel?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
        <motion.div
          className={cn('absolute inset-y-0 left-0 rounded-full', TONES[tone].dot)}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      {showLabel ? (
        <span className="w-10 shrink-0 text-right text-[11.5px] font-bold tabular text-ink-600 dark:text-ink-300">
          {Math.round(value)}%
        </span>
      ) : null}
    </div>
  )
}

export function Switch({
  checked,
  onChange,
  label,
  size = 'md',
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  size?: 'sm' | 'md'
}) {
  const dims =
    size === 'sm'
      ? { w: 'h-5.5 w-10', k: 'h-4 w-4', x: checked ? 20 : 3 }
      : { w: 'h-6.5 w-12', k: 'h-5 w-5', x: checked ? 25 : 3 }
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label ?? 'Toggle'}
      onClick={() => onChange(!checked)}
      className={cn(
        'press ring-focus relative shrink-0 rounded-full border transition-colors duration-300',
        dims.w,
        checked ? 'border-brand-600 bg-brand-600' : 'border-ink-300 bg-ink-200 dark:border-white/15 dark:bg-white/12',
      )}
    >
      <motion.span
        className={cn('absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm', dims.k)}
        animate={{ left: dims.x }}
        transition={{ type: 'spring', stiffness: 600, damping: 36 }}
      />
    </button>
  )
}
