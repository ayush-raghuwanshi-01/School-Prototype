import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, BadgeCheck, Info, ShieldAlert, X } from 'lucide-react'
import { useApp, type Toast } from '../../state/store'
import { cn } from '../../lib/utils'

const TONE_MAP: Record<Toast['tone'], { icon: typeof Info; wrap: string; chip: string }> = {
  success: {
    icon: BadgeCheck,
    wrap: 'border-emerald-200/80 dark:border-emerald-400/25',
    chip: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
  },
  info: {
    icon: Info,
    wrap: 'border-brand-200/80 dark:border-brand-400/25',
    chip: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
  },
  warning: {
    icon: AlertTriangle,
    wrap: 'border-amber-200/80 dark:border-amber-400/25',
    chip: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
  },
  error: {
    icon: ShieldAlert,
    wrap: 'border-rose-200/80 dark:border-rose-400/25',
    chip: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
  },
}

export function ToastHost() {
  const { toasts, dismissToast } = useApp()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[120] flex flex-col items-center gap-2.5 p-4 pb-24 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:items-start sm:p-0">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const cfg = TONE_MAP[toast.tone]
          const Icon = cfg.icon
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 22, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 26, scale: 0.96, transition: { duration: 0.18 } }}
              transition={{ type: 'spring', stiffness: 460, damping: 32 }}
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border bg-white/95 p-3.5 shadow-[0_24px_60px_-24px_rgb(15_23_42_/_0.45)] backdrop-blur-xl dark:bg-ink-900/95',
                cfg.wrap,
              )}
            >
              <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', cfg.chip)}>
                <Icon className="h-4.5 w-4.5" />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[13.5px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-400">
                    {toast.description}
                  </p>
                ) : null}
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="press -mt-0.5 -mr-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
