import { motion } from 'framer-motion'
import { Clock, TrendingUp, ShieldCheck, Sparkles, Smartphone, CheckCircle } from 'lucide-react'
import { Pill } from '../ui/Badge'
import { useCountUp } from '../../state/store'

export function RoiStrip() {
  const hoursSaved = useCountUp(18.5, 900)
  const recoveryAmt = useCountUp(6.8, 900)
  const parentScore = useCountUp(99.4, 900)

  const items = [
    {
      icon: Clock,
      stat: `${hoursSaved.toFixed(1)} hrs/wk`,
      label: 'Staff Time Saved',
      detail: 'Replaces paper roll calls, registers & tally sheets',
      tone: 'emerald' as const,
    },
    {
      icon: TrendingUp,
      stat: `₹${recoveryAmt.toFixed(1)} Lakh`,
      label: 'Faster Fee Recovery',
      detail: 'Automated WhatsApp payment links & receipts',
      tone: 'brand' as const,
    },
    {
      icon: Smartphone,
      stat: `${parentScore.toFixed(1)}%`,
      label: 'Parent Engagement',
      detail: 'Instant gate punch notifications & marks cards',
      tone: 'violet' as const,
    },
    {
      icon: ShieldCheck,
      stat: '100% Ready',
      label: 'Board Compliance',
      detail: 'One-click CBSE/MPBSE report cards & RTE registers',
      tone: 'amber' as const,
    },
  ]

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-200/80 bg-gradient-to-r from-brand-50/90 via-white/80 to-emerald-50/70 p-4 shadow-sm backdrop-blur-xl dark:border-brand-500/20 dark:from-brand-950/40 dark:via-ink-900/60 dark:to-emerald-950/30">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-200/50 pb-3 dark:border-white/8">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-lg bg-brand-600 text-white shadow-sm dark:bg-brand-500">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="text-[12px] font-extrabold tracking-wide uppercase text-ink-800 dark:text-white">
            Administrative ROI & Quantified Value
          </span>
          <Pill tone="emerald" dot className="text-[10px] py-0.5">
            Active School Impact
          </Pill>
        </div>
        <span className="text-[11px] font-medium text-ink-500 dark:text-ink-400">
          Audited based on 1,420 students & 42 sections
        </span>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="group relative flex items-start gap-3 rounded-xl border border-white/60 bg-white/70 p-3 transition-all hover:border-brand-300/80 hover:shadow-sm dark:border-white/5 dark:bg-white/[0.03] dark:hover:border-brand-500/40"
          >
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                item.tone === 'emerald'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                  : item.tone === 'brand'
                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300'
                    : item.tone === 'violet'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
              }`}
            >
              <item.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-black tracking-tight text-ink-900 dark:text-white">{item.stat}</span>
                <CheckCircle className="h-3 w-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] font-bold text-ink-700 dark:text-ink-200">{item.label}</p>
              <p className="mt-0.5 text-[10.5px] leading-snug text-ink-500 dark:text-ink-400">{item.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
