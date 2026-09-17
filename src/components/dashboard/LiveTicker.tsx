import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pause, Play, Radio } from 'lucide-react'

export interface TickerItem {
  id: string
  time: string
  text: string
  category: 'attendance' | 'fee' | 'ai' | 'transport' | 'academic'
  badge: string
}

const DEFAULT_ITEMS: TickerItem[] = [
  {
    id: 't-1',
    time: 'Just now',
    text: 'Aarav Sharma (Class XII-B) punched in via Gate 1 RFID scanner',
    category: 'attendance',
    badge: 'RFID Gate 1',
  },
  {
    id: 't-2',
    time: '1m ago',
    text: 'Fee payment received ₹15,000 for Ananya Patel (Class X-A) via UPI · Auto-receipt #RCPT-8249',
    category: 'fee',
    badge: 'UPI Collection',
  },
  {
    id: 't-3',
    time: '2m ago',
    text: 'AI Attendance Radar: Flagged 3 students with declining Monday attendance patterns in Class IX-C',
    category: 'ai',
    badge: 'AI Radar',
  },
  {
    id: 't-4',
    time: '3m ago',
    text: 'Automated WhatsApp fee reminder delivered to 14 overdue accounts (Read status: 86%)',
    category: 'fee',
    badge: 'WhatsApp Bot',
  },
  {
    id: 't-5',
    time: '4m ago',
    text: 'School Bus Route 07 safely arrived on campus · 32 GPS geo-checkins logged',
    category: 'transport',
    badge: 'Live GPS',
  },
  {
    id: 't-6',
    time: '5m ago',
    text: 'Dr. Shalini Verma entered Physics Practical marks for 28 students of Section XII-B',
    category: 'academic',
    badge: 'Marks Entry',
  },
  {
    id: 't-7',
    time: '6m ago',
    text: 'New admission application submitted for Class XI (Science) · Scholar ID provisional #ADM-2026-104',
    category: 'academic',
    badge: 'Admissions',
  },
]

export function LiveTicker({ onOpenBiometric }: { onOpenBiometric?: () => void }) {
  const [items] = useState<TickerItem[]>(DEFAULT_ITEMS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [paused, items.length])

  const active = items[currentIndex]

  const categoryColor = {
    attendance: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
    fee: 'bg-brand-500/10 text-brand-600 border-brand-500/20 dark:text-brand-400',
    ai: 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400',
    transport: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
    academic: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400',
  }[active.category]

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="group flex flex-wrap items-center gap-2.5 rounded-2xl border border-ink-200/80 bg-white/90 px-3.5 py-2 shadow-xs backdrop-blur-xl transition-all dark:border-white/10 dark:bg-ink-900/90"
    >
      {/* Live Badge */}
      <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-500/15 px-2 py-1 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        <span className="font-mono text-[10px] font-black tracking-wider uppercase">Live Activity</span>
      </div>

      {/* Ticker Stream */}
      <div className="relative min-w-0 flex-1 overflow-hidden h-6 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-[12.5px] truncate"
          >
            <span
              className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${categoryColor}`}
            >
              {active.badge}
            </span>
            <span className="truncate font-medium text-ink-800 dark:text-ink-100">{active.text}</span>
            <span className="shrink-0 font-mono text-[10.5px] text-ink-400">· {active.time}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex shrink-0 items-center gap-1.5 pl-2 border-l border-ink-200/60 dark:border-white/10">
        {onOpenBiometric && (
          <button
            onClick={onOpenBiometric}
            title="Simulate RFID Card Tap"
            className="press flex items-center gap-1 rounded-lg bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand-600 hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-300 dark:hover:bg-brand-500/25"
          >
            <Radio className="h-3 w-3 animate-pulse" />
            <span>Simulate RFID Tap</span>
          </button>
        )}
        <button
          onClick={() => setPaused(!paused)}
          aria-label={paused ? 'Resume activity ticker' : 'Pause activity ticker'}
          className="press grid h-6 w-6 place-items-center rounded-md text-ink-400 hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-white/10 dark:hover:text-white"
        >
          {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
        </button>
      </div>
    </div>
  )
}
