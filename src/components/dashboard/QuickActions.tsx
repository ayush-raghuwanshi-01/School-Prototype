import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeIndianRupee, CalendarCheck2, FileDown, Megaphone, Plus, Sparkles, UserPlus, X } from 'lucide-react'
import { useApp } from '../../state/store'
import { cn } from '../../lib/utils'

interface Action {
  id: string
  label: string
  hint: string
  icon: typeof Plus
  tone: string
}

const ACTIONS: Action[] = [
  {
    id: 'payment',
    label: 'Record a payment',
    hint: 'Fee receipt in 4 fields',
    icon: BadgeIndianRupee,
    tone: 'bg-emerald-500',
  },
  {
    id: 'attendance',
    label: 'Mark attendance',
    hint: 'Class XII-B roster',
    icon: CalendarCheck2,
    tone: 'bg-brand-600',
  },
  {
    id: 'enquiry',
    label: 'Log an enquiry',
    hint: 'Admissions desk',
    icon: UserPlus,
    tone: 'bg-violet-accent-600',
  },
  {
    id: 'circular',
    label: 'Publish circular',
    hint: 'Push + email + app',
    icon: Megaphone,
    tone: 'bg-amber-500',
  },
  {
    id: 'report',
    label: 'Export term report',
    hint: 'PDF · 18 pages',
    icon: FileDown,
    tone: 'bg-ink-700',
  },
]

export function QuickActions() {
  const { setView, pushToast, role } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const run = (action: Action) => {
    setOpen(false)
    switch (action.id) {
      case 'payment':
        setView('fees')
        window.setTimeout(() => document.dispatchEvent(new CustomEvent('svm:open-payment')), 180)
        break
      case 'attendance':
        setView('attendance')
        break
      case 'enquiry':
        setView('admissions')
        window.setTimeout(
          () =>
            pushToast({
              tone: 'success',
              title: 'Enquiry form opened',
              description: 'Public enquiry link copied to clipboard for walk-ins.',
            }),
          200,
        )
        break
      case 'circular':
        pushToast({
          tone: 'success',
          title: 'Circular published',
          description: '“Half-Yearly date sheet” pushed to 1,363 parents and 138 staff.',
        })
        break
      default:
        pushToast({
          tone: 'info',
          title: 'Report generating',
          description: 'Term-2 consolidated report · you will be notified on completion.',
        })
    }
  }

  return (
    <div ref={ref} className="fixed right-4 bottom-4 z-[75] sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 bottom-[68px] w-[19rem] overflow-hidden rounded-3xl border border-ink-200/80 bg-white/97 p-1.5 shadow-[0_36px_90px_-32px_rgb(15_23_42_/_0.6)] backdrop-blur-2xl dark:border-white/12 dark:bg-ink-900/97"
          >
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-[10.5px] font-bold tracking-[0.16em] text-ink-400 uppercase">Quick actions</p>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-brand-600 dark:text-brand-400">
                <Sparkles className="h-3 w-3" /> {role.label}
              </span>
            </div>
            {ACTIONS.map((action, i) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.045 }}
                onClick={() => run(action)}
                className="press flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-ink-50 dark:hover:bg-white/[0.06]"
              >
                <span className={cn('grid h-8.5 w-8.5 shrink-0 place-items-center rounded-xl text-white', action.tone)}>
                  <action.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
                    {action.label}
                  </span>
                  <span className="block truncate text-[11px] text-ink-500 dark:text-ink-400">{action.hint}</span>
                </span>
              </motion.button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.93 }}
        className="ring-focus relative grid h-14 w-14 place-items-center rounded-2xl bg-ink-900 text-white shadow-[0_20px_46px_-18px_rgb(15_23_42_/_0.9)] dark:bg-brand-600 dark:shadow-[0_20px_46px_-16px_rgb(37_99_235_/_0.85)]"
        aria-label="Quick actions"
      >
        {!open ? <span className="absolute inset-0 animate-pulse-ring rounded-2xl" /> : null}
        <motion.span animate={{ rotate: open ? 135 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 26 }}>
          {open ? <X className="h-5.5 w-5.5" /> : <Plus className="h-5.5 w-5.5" />}
        </motion.span>
      </motion.button>
    </div>
  )
}
