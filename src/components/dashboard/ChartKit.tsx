import { cn } from '../../lib/utils'

interface TooltipEntry {
  dataKey?: string | number
  name?: string | number
  value?: number | string
  color?: string
}

/** Recharts passes these props into a custom tooltip component. */
interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
  suffix?: string
  prefix?: string
  formatter?: (v: number) => string
}

export function ChartTooltip({ active, payload, label, suffix = '', prefix = '', formatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-2xl border border-ink-200/80 bg-white/97 px-3.5 py-2.5 shadow-[0_22px_50px_-24px_rgb(15_23_42_/_0.5)] backdrop-blur-xl dark:border-white/12 dark:bg-ink-900/97">
      {label !== undefined ? (
        <p className="mb-1.5 text-[11px] font-bold tracking-[0.12em] text-ink-400 uppercase">{String(label)}</p>
      ) : null}
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={String(entry.dataKey)} className="flex items-center gap-2.5">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: entry.color ?? '#2563EB' }} />
            <span className="flex-1 text-[11.5px] font-semibold text-ink-500 capitalize dark:text-ink-400">
              {String(entry.name)}
            </span>
            <span className="text-[12.5px] font-bold tabular text-ink-900 dark:text-white">
              {formatter
                ? formatter(Number(entry.value))
                : `${prefix}${Number(entry.value).toLocaleString('en-IN')}${suffix}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export const AXIS_STYLE = {
  fontSize: 11,
  fontWeight: 600,
  fill: 'currentColor',
} as const

export function ChartFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('text-ink-400 dark:text-ink-500', className)}>{children}</div>
}

export function DonutLegend({ items }: { items: { label: string; value: number; color: string; sub?: string }[] }) {
  const total = items.reduce((a, b) => a + b.value, 0) || 1
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.color }} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12.5px] font-semibold text-ink-700 dark:text-ink-200">
              {item.label}
            </span>
            {item.sub ? <span className="block text-[11px] text-ink-400">{item.sub}</span> : null}
          </span>
          <span className="shrink-0 text-right">
            <span className="block text-[12.5px] font-bold tabular text-ink-900 dark:text-white">
              {((item.value / total) * 100).toFixed(1)}%
            </span>
            <span className="block text-[10.5px] text-ink-400 tabular">{item.value.toLocaleString('en-IN')}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
