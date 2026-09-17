import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div style={style} className={cn('skeleton rounded-lg', className)} />
}

export function SkeletonLine({ w = 'w-full', h = 'h-3' }: { w?: string; h?: string }) {
  return <Skeleton className={cn(w, h, 'rounded-full')} />
}

export function SkeletonStatGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-8 rounded-xl" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
          <Skeleton className="mt-5 h-7 w-28 rounded-lg" />
          <Skeleton className="mt-2.5 h-3 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonChart({ height = 'h-[300px]', bars = 7 }: { height?: string; bars?: number }) {
  return (
    <div className={cn('surface flex flex-col justify-end gap-3 rounded-3xl p-6', height)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="mt-4 flex flex-1 items-end gap-3">
        {Array.from({ length: bars }).map((_, i) => (
          <Skeleton key={i} className="flex-1 rounded-t-xl" style={{ height: `${34 + ((i * 37) % 58)}%` }} />
        ))}
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="surface overflow-hidden rounded-3xl">
      <div className="border-b border-ink-200/70 px-5 py-4 dark:border-white/8">
        <Skeleton className="h-3.5 w-44 rounded-full" />
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex items-center gap-4 border-b border-ink-100 px-5 py-4 last:border-0 dark:border-white/5"
        >
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          {Array.from({ length: cols }).map((__, c) => (
            <Skeleton key={c} className={cn('h-3 rounded-full', c === 0 ? 'w-40' : 'w-20')} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonList({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: rows }).map((__, i) => (
        <div key={i} className="surface flex items-center gap-4 rounded-2xl px-4 py-3.5">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-40 rounded-full" />
            <Skeleton className="h-2.5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-ink-200/80 bg-ink-50 text-ink-400 dark:border-white/10 dark:bg-white/5 dark:text-ink-300">
        {icon}
      </div>
      <p className="text-[15px] font-bold text-ink-900 dark:text-white">{title}</p>
      <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
