import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, ArrowDownRight, ArrowUpRight, Pause, Play, Radio, Sparkles, TrendingUp } from 'lucide-react'
import { cn, mulberry32 } from '../../lib/utils'
import { Pill } from '../ui/Badge'

type MetricKey = 'attendance' | 'fees' | 'results'

interface MetricDef {
  key: MetricKey
  label: string
  unit: string
  value: number
  delta: number
  series: number[]
  bars: { label: string; value: number }[]
  note: string
  tone: 'brand' | 'emerald' | 'violet'
}

const rnd = mulberry32(31415)

const METRICS: Record<MetricKey, MetricDef> = {
  attendance: {
    key: 'attendance',
    label: 'Live attendance',
    unit: '%',
    value: 94.2,
    delta: 1.8,
    series: [88, 91, 87, 93, 92, 95, 94, 96, 93, 94, 95, 94.2],
    bars: [
      { label: 'Primary', value: 96 },
      { label: 'Middle', value: 94 },
      { label: 'Secondary', value: 93 },
      { label: 'Senior', value: 91 },
    ],
    note: '1,284 of 1,363 students marked present today',
    tone: 'brand',
  },
  fees: {
    key: 'fees',
    label: 'Term-2 collection',
    unit: ' L',
    value: 158.9,
    delta: 12.4,
    series: [74, 96, 113, 129, 141, 159],
    bars: [
      { label: 'Primary', value: 97 },
      { label: 'Middle', value: 94 },
      { label: 'Secondary', value: 89 },
      { label: 'Senior', value: 86 },
    ],
    note: '₹158.9 Lakh collected against a ₹140 L target',
    tone: 'emerald',
  },
  results: {
    key: 'results',
    label: 'Board average',
    unit: '%',
    value: 91.4,
    delta: 4.2,
    series: [78, 81, 84, 86, 88, 90, 91.4],
    bars: [
      { label: 'Science', value: 93 },
      { label: 'Commerce', value: 91 },
      { label: 'Humanities', value: 90 },
      { label: 'Grade X', value: 89 },
    ],
    note: 'MPBSE Class XII 2025 · 34 students above 90%',
    tone: 'violet',
  },
}

const TONE_TEXT: Record<MetricDef['tone'], string> = {
  brand: 'text-brand-600 dark:text-brand-300',
  emerald: 'text-emerald-600 dark:text-emerald-300',
  violet: 'text-violet-accent-600 dark:text-violet-accent-400',
}

const TONE_STROKE: Record<MetricDef['tone'], string> = {
  brand: '#2563EB',
  emerald: '#10B981',
  violet: '#7C3AED',
}

function Sparkline({ series, tone, live }: { series: number[]; tone: MetricDef['tone']; live: boolean }) {
  const path = useMemo(() => {
    const w = 320
    const h = 96
    const min = Math.min(...series) * 0.94
    const max = Math.max(...series) * 1.03
    const span = max - min || 1
    const pts = series.map((v, i) => {
      const x = (i / (series.length - 1)) * w
      const y = h - ((v - min) / span) * h
      return [x, y] as const
    })
    let d = `M ${pts[0][0]} ${pts[0][1]}`
    for (let i = 1; i < pts.length; i += 1) {
      const [x0, y0] = pts[i - 1]
      const [x1, y1] = pts[i]
      const cx = (x0 + x1) / 2
      d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`
    }
    const area = `${d} L ${w} ${h} L 0 ${h} Z`
    return { d, area, last: pts[pts.length - 1] }
  }, [series])

  return (
    <svg viewBox="0 0 320 96" preserveAspectRatio="none" className="h-24 w-full overflow-visible">
      <defs>
        <linearGradient id={`fill-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TONE_STROKE[tone]} stopOpacity="0.28" />
          <stop offset="100%" stopColor={TONE_STROKE[tone]} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={path.area}
        fill={`url(#fill-${tone})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.path
        d={path.d}
        fill="none"
        stroke={TONE_STROKE[tone]}
        strokeWidth="2.4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cx={path.last[0]}
        cy={path.last[1]}
        r="4.5"
        fill={TONE_STROKE[tone]}
        stroke="white"
        strokeWidth="2.5"
        animate={live ? { r: [4.5, 6, 4.5] } : { r: 4.5 }}
        transition={live ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
      />
    </svg>
  )
}

export function LiveShowcase() {
  const [metric, setMetric] = useState<MetricKey>('attendance')
  const [live, setLive] = useState(true)
  const [tick, setTick] = useState(0)
  const timer = useRef<number | null>(null)
  const def = METRICS[metric]

  const liveValue = useMemo(() => {
    const drift = (rnd() - 0.42) * (metric === 'fees' ? 0.9 : 0.5)
    return Math.max(0, def.value + drift * (tick === 0 ? 0 : 1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, metric, def.value])

  useEffect(() => {
    if (!live) {
      if (timer.current) window.clearInterval(timer.current)
      return
    }
    timer.current = window.setInterval(() => setTick((t) => t + 1), 2600)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [live])

  const display = live ? liveValue : def.value

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Glow frame */}
      <div className="absolute -inset-4 rounded-[2.2rem] bg-gradient-to-br from-brand-500/22 via-violet-accent-500/16 to-transparent blur-2xl" />

      <div className="surface relative overflow-hidden rounded-[1.9rem] p-5 shadow-[0_36px_90px_-46px_rgb(15_23_42_/_0.55)] backdrop-blur-2xl sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-ink-900 text-white dark:bg-brand-600">
              <Activity className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-[13.5px] font-bold tracking-[-0.015em] text-ink-900 dark:text-white">Campus Pulse</p>
              <p className="text-[11px] text-ink-500 dark:text-ink-400">SVM School ERP · live feed</p>
            </div>
          </div>
          <button
            onClick={() => setLive((v) => !v)}
            className={cn(
              'press inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-bold transition-colors',
              live
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-500/15 dark:text-emerald-300'
                : 'border-ink-200 bg-ink-50 text-ink-500 dark:border-white/12 dark:bg-white/5 dark:text-ink-300',
            )}
          >
            {live ? (
              <>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                LIVE
                <Pause className="h-3 w-3" />
              </>
            ) : (
              <>
                PAUSED
                <Play className="h-3 w-3" />
              </>
            )}
          </button>
        </div>

        {/* Metric switcher */}
        <div className="mt-5 flex gap-1 rounded-2xl border border-ink-200/80 bg-ink-100/60 p-1 dark:border-white/10 dark:bg-white/[0.04]">
          {(Object.keys(METRICS) as MetricKey[]).map((key) => {
            const active = key === metric
            return (
              <button
                key={key}
                onClick={() => setMetric(key)}
                className={cn(
                  'press relative flex-1 rounded-xl px-2 py-2 text-[11.5px] font-bold tracking-[-0.01em] transition-colors',
                  active ? 'text-white' : 'text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-white',
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="showcase-metric"
                    className="absolute inset-0 rounded-xl bg-ink-900 dark:bg-brand-600"
                    transition={{ type: 'spring', stiffness: 480, damping: 34 }}
                  />
                ) : null}
                <span className="relative z-10">{METRICS[key].label.split(' ').slice(-1)[0]}</span>
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={metric}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold tracking-[0.16em] text-ink-400 uppercase">{def.label}</p>
                <p className="mt-1 flex items-baseline gap-1 text-ink-900 dark:text-white">
                  <span className="text-[42px] leading-none font-extrabold tracking-[-0.045em] tabular">
                    {display.toFixed(metric === 'fees' ? 1 : metric === 'attendance' ? 1 : 1)}
                  </span>
                  <span className={cn('text-[20px] font-bold', TONE_TEXT[def.tone])}>{def.unit}</span>
                </p>
              </div>
              <Pill
                tone={def.delta >= 0 ? 'emerald' : 'rose'}
                icon={def.delta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              >
                {def.delta >= 0 ? '+' : ''}
                {def.delta}% YoY
              </Pill>
            </div>

            <div className="mt-2 -mx-1">
              <Sparkline series={def.series} tone={def.tone} live={live} />
            </div>

            <div className="mt-3 space-y-2.5">
              {def.bars.map((bar, i) => (
                <div key={bar.label} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-[11.5px] font-semibold text-ink-500 dark:text-ink-400">
                    {bar.label}
                  </span>
                  <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
                    <motion.span
                      className={cn(
                        'absolute inset-y-0 left-0 rounded-full',
                        def.tone === 'brand'
                          ? 'bg-brand-600'
                          : def.tone === 'emerald'
                            ? 'bg-emerald-500'
                            : 'bg-violet-accent-600',
                      )}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                  <span className="w-9 shrink-0 text-right text-[11.5px] font-bold tabular text-ink-700 dark:text-ink-200">
                    {bar.value}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-ink-200/70 bg-ink-50/70 p-3 dark:border-white/8 dark:bg-white/[0.03]">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-300" />
          <p className="text-[12px] leading-relaxed font-medium text-ink-600 dark:text-ink-300">{def.note}</p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-dashed border-ink-200 pt-3.5 dark:border-white/10">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-400">
            <Radio className="h-3 w-3" /> Synced{' '}
            {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" /> 14 views in console
          </span>
        </div>
      </div>
    </motion.div>
  )
}
