import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ChevronRight, ChevronLeft, X } from 'lucide-react'
import { Button } from '../ui/Button'
import type { ViewKey } from '../../state/store'

export interface TourStep {
  id: string
  title: string
  subtitle: string
  pitchHook: string
  keyStat: string
  view: ViewKey
  actionTrigger?: 'open-biometric' | 'open-report-card' | 'open-whatsapp'
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'step-hook',
    title: 'The 60-Second Hook: Executive ROI & Live Pulse',
    subtitle: 'Unified Command Centre for the School Principal',
    pitchHook:
      'Eliminates morning paper registers and gives the principal a live executive dashboard. Demonstrates quantified time savings (18.5 hrs/week) and real-time campus activity ticker.',
    keyStat: '18.5 hrs saved weekly · 100% pulse visibility',
    view: 'overview',
  },
  {
    id: 'step-ai-attendance',
    title: 'AI Attendance Radar: Preventing Student Dropouts',
    subtitle: 'Automated early warning system before marks slip',
    pitchHook:
      'Automatically flags students with declining attendance patterns (e.g. chronic Monday absenteeism) before they fall below the 75% CBSE mandatory exam threshold.',
    keyStat: '3 early flags today · 1-click WhatsApp intervention',
    view: 'attendance',
  },
  {
    id: 'step-whatsapp-fees',
    title: 'Smart Fee Recovery Assistant via WhatsApp API',
    subtitle: 'Gentle, branded reminders with instant UPI pay links',
    pitchHook:
      'Recovers outstanding fees 35% faster without awkward staff phone calls. Parents receive a personalized WhatsApp bill with an instant UPI link that issues digital receipts on tap.',
    keyStat: '₹6.8 Lakh recovered faster · Zero payment friction',
    view: 'fees',
    actionTrigger: 'open-whatsapp',
  },
  {
    id: 'step-biometric',
    title: 'SmartGate RFID & Facial Biometric Attendance',
    subtitle: 'Hardware integration that reassures every parent',
    pitchHook:
      'Eliminates proxy attendance. The exact second a student taps their smart ID card at the gate, parents receive an automated WhatsApp confirmation with arrival timestamp.',
    keyStat: '14ms hardware sync · Real-time gate safety',
    view: 'overview',
    actionTrigger: 'open-biometric',
  },
  {
    id: 'step-report-card',
    title: 'Official Board Report Card & AI Teacher Remarks',
    subtitle: 'Pixel-perfect, print-ready CBSE / State Board grade sheets',
    pitchHook:
      'This single screen closes deals. Instead of spending weeks manually tabulating marks, generate authentic board-compliant grade cards with AI-suggested personalized teacher remarks.',
    keyStat: '0 manual calculation errors · 1-click print PDF',
    view: 'exams',
    actionTrigger: 'open-report-card',
  },
  {
    id: 'step-parent-portal',
    title: 'Parent Engagement Portal & Direct Teacher Chat',
    subtitle: 'Drastically reduces front-office phone calls',
    pitchHook:
      'Gives parents 360° transparency on fees, daily attendance, homework, and secure direct messaging with class teachers — completely eliminating chaotic WhatsApp parent groups.',
    keyStat: '82% fewer front desk calls · 99.4% parent satisfaction',
    view: 'child',
  },
]

export function GuidedTour({
  active,
  stepIndex,
  onNext,
  onPrev,
  onClose,
  onJumpTo,
}: {
  active: boolean
  stepIndex: number
  onNext: () => void
  onPrev: () => void
  onClose: () => void
  onJumpTo: (idx: number) => void
}) {
  const currentStep = TOUR_STEPS[stepIndex] || TOUR_STEPS[0]

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, onNext, onPrev, onClose])

  if (!active) return null

  return (
    <div className="fixed inset-x-0 bottom-4 z-[95] mx-auto max-w-4xl px-4 pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className="overflow-hidden rounded-2xl border-2 border-brand-500/80 bg-white/95 shadow-[0_20px_60px_-15px_rgba(37,99,235,0.35)] backdrop-blur-2xl dark:border-brand-500/60 dark:bg-ink-950/95"
      >
        {/* Top Header Strip */}
        <div className="flex items-center justify-between border-b border-ink-100 bg-gradient-to-r from-brand-600 to-violet-accent-600 px-4 py-2.5 text-white">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-white/20">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-[12px] font-black tracking-wide uppercase">
              Sales Pitch Walkthrough · Step {stepIndex + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-md bg-black/25 px-2 py-0.5 font-mono text-[11px] font-bold">
              {currentStep.keyStat}
            </span>
            <button
              onClick={onClose}
              aria-label="Exit tour"
              className="press grid h-6 w-6 place-items-center rounded-md text-white/80 hover:bg-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-[17px] font-extrabold tracking-tight text-ink-900 dark:text-white">
                {currentStep.title}
              </h3>
              <p className="mt-0.5 text-[12px] font-bold text-brand-600 dark:text-brand-400">{currentStep.subtitle}</p>
              <div className="mt-2.5 rounded-xl border border-brand-200/80 bg-brand-50/70 p-3 text-[12.5px] leading-relaxed text-ink-800 dark:border-brand-500/20 dark:bg-brand-950/30 dark:text-ink-200">
                <span className="font-bold text-brand-900 dark:text-brand-300">Why Principals Buy: </span>
                {currentStep.pitchHook}
              </div>
            </div>
          </div>

          {/* Quick Scene Buttons (Presenter Shortcut HUD) */}
          <div className="mt-4 border-t border-ink-100 pt-3 dark:border-white/8">
            <div className="flex items-center justify-between">
              <p className="text-[10.5px] font-bold tracking-wider uppercase text-ink-400">Presenter Jump Shortcuts:</p>
              <span className="text-[10px] text-ink-400 hidden sm:inline">Use ← → keys to navigate</span>
            </div>
            <div className="mt-1.5 flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
              {TOUR_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => onJumpTo(idx)}
                  className={`press shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                    idx === stepIndex
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-ink-100 text-ink-600 hover:bg-brand-50 hover:text-brand-700 dark:bg-white/5 dark:text-ink-300 dark:hover:bg-brand-500/10'
                  }`}
                >
                  {idx + 1}. {step.title.split(':')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3 dark:border-white/8">
            <Button
              variant="outline"
              size="sm"
              disabled={stepIndex === 0}
              onClick={onPrev}
              icon={<ChevronLeft className="h-3.5 w-3.5" />}
            >
              Previous
            </Button>

            <div className="flex items-center gap-1.5">
              {TOUR_STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === stepIndex ? 'w-6 bg-brand-600' : 'w-1.5 bg-ink-200 dark:bg-white/20'
                  }`}
                />
              ))}
            </div>

            {stepIndex < TOUR_STEPS.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={onNext}
                icon={<ChevronRight className="h-3.5 w-3.5" />}
                className="bg-brand-600 hover:bg-brand-700"
              >
                Next Feature
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={onClose} className="bg-emerald-600 hover:bg-emerald-700">
                Finish Walkthrough
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
