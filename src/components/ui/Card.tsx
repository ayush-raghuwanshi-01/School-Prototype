import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function Card({ className, interactive, ...rest }: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        'surface lift relative rounded-3xl backdrop-blur-xl',
        interactive && 'lift-hover cursor-pointer hover:border-brand-300/70 dark:hover:border-brand-500/40',
        className,
      )}
      {...rest}
    />
  )
}

export function CardHeader({
  title,
  subtitle,
  right,
  className,
  compact,
}: {
  title: ReactNode
  subtitle?: ReactNode
  right?: ReactNode
  className?: string
  compact?: boolean
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4', compact ? 'mb-3' : 'mb-5', className)}>
      <div className="min-w-0">
        <h3 className="truncate text-[15px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-[12.5px] text-ink-500 dark:text-ink-400">{subtitle}</p> : null}
      </div>
      {right ? <div className="flex shrink-0 items-center gap-2">{right}</div> : null}
    </div>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-500 dark:text-ink-400',
        className,
      )}
    >
      {children}
    </span>
  )
}
