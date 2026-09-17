import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Card } from '../ui/Card'
import type { Tone } from '../ui/Badge'
import { TONES } from '../ui/Badge'

export function MetricCard({
  label,
  value,
  unit,
  delta,
  deltaLabel,
  icon: Icon,
  tone = 'brand',
  spark,
  footnote,
  index = 0,
  onClick,
}: {
  label: string
  value: string
  unit?: string
  delta?: number
  deltaLabel?: string
  icon: LucideIcon
  tone?: Tone
  spark?: number[]
  footnote?: string
  index?: number
  onClick?: () => void
}) {
  const TrendIcon = delta === undefined ? Minus : delta > 0 ? ArrowUpRight : delta < 0 ? ArrowDownRight : Minus
  const trendTone =
    delta === undefined || delta === 0
      ? 'text-ink-400'
      : delta > 0
        ? 'text-emerald-600 dark:text-emerald-400'
        : 'text-rose-600 dark:text-rose-400'
  const t = TONES[tone]

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={onClick ? { y: -4 } : undefined}
    >
      <Card
        interactive={Boolean(onClick)}
        onClick={onClick}
        className={cn('group overflow-hidden p-5', onClick && 'cursor-pointer')}
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className={cn(
              'grid h-9 w-9 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110',
              t.soft,
              t.text,
            )}
          >
            <Icon className="h-4.5 w-4.5" />
          </span>
          {delta !== undefined ? (
            <span className={cn('inline-flex items-center gap-0.5 text-[11.5px] font-bold', trendTone)}>
              <TrendIcon className="h-3.5 w-3.5" />
              {Math.abs(delta).toFixed(1)}%
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold tracking-[0.02em] text-ink-500 dark:text-ink-400">
              {label}
            </p>
            <p className="mt-1 flex items-baseline gap-1">
              <span className="text-[26px] leading-none font-extrabold tracking-[-0.04em] tabular text-ink-900 dark:text-white">
                {value}
              </span>
              {unit ? <span className={cn('text-[13px] font-bold', t.text)}>{unit}</span> : null}
            </p>
          </div>

          {spark ? (
            <svg viewBox="0 0 80 32" className="h-8 w-20 shrink-0 overflow-visible">
              {(() => {
                const min = Math.min(...spark)
                const max = Math.max(...spark)
                const span = max - min || 1
                const d = spark
                  .map(
                    (v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (spark.length - 1)) * 80} ${28 - ((v - min) / span) * 24}`,
                  )
                  .join(' ')
                const stroke =
                  tone === 'brand'
                    ? '#2563EB'
                    : tone === 'violet'
                      ? '#7C3AED'
                      : tone === 'emerald'
                        ? '#10B981'
                        : tone === 'amber'
                          ? '#F59E0B'
                          : tone === 'rose'
                            ? '#F43F5E'
                            : '#0891B2'
                return (
                  <>
                    <motion.path
                      d={d}
                      fill="none"
                      stroke={stroke}
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.2 + index * 0.07 }}
                    />
                    <circle cx="80" cy={28 - ((spark[spark.length - 1] - min) / span) * 24} r="2.6" fill={stroke} />
                  </>
                )
              })()}
            </svg>
          ) : null}
        </div>

        {deltaLabel || footnote ? (
          <p className="mt-2.5 text-[11.5px] font-medium text-ink-400 dark:text-ink-500">{deltaLabel ?? footnote}</p>
        ) : null}
      </Card>
    </motion.div>
  )
}

export function StatStrip({ items }: { items: { label: string; value: string; tone?: Tone; sub?: string }[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-ink-200/80 bg-ink-200/70 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10 dark:bg-white/10">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="bg-white px-4 py-3.5 dark:bg-ink-900"
        >
          <p className="text-[11px] font-bold tracking-[0.1em] text-ink-400 uppercase">{item.label}</p>
          <p
            className={cn(
              'mt-1 text-[19px] leading-none font-extrabold tracking-[-0.03em] tabular',
              item.tone ? TONES[item.tone].text : 'text-ink-900 dark:text-white',
            )}
          >
            {item.value}
          </p>
          {item.sub ? <p className="mt-1 text-[11px] text-ink-400">{item.sub}</p> : null}
        </motion.div>
      ))}
    </div>
  )
}
