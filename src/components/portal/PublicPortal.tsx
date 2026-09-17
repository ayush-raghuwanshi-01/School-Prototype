import { motion } from 'framer-motion'
import { MessageCircle, ArrowUp, Sparkles, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PortalNav } from './PortalNav'
import { Hero } from './Hero'
import { ProgramsSection } from './ProgramsSection'
import { CampusSection } from './CampusSection'
import { Testimonials } from './Testimonials'
import { PricingSection } from './PricingSection'
import { DemoBookingSection } from './DemoBookingSection'
import { AdmissionsSection } from './AdmissionsSection'
import { PortalFooter } from './PortalFooter'
import { CelebrationBurst } from '../ui/CelebrationBurst'
import { useApp } from '../../state/store'

export function PublicPortal() {
  const { pushToast, setRoute, startTour, celebrationPayload, clearCelebration } = useApp()
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.div
      key="portal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="relative min-h-screen"
    >
      <PortalNav />
      <main>
        <Hero />
        <ProgramsSection />
        <Testimonials />
        <CampusSection />
        <PricingSection onBookDemo={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} />
        <DemoBookingSection />
        <AdmissionsSection />
      </main>
      <PortalFooter />

      {/* Floating CTA & helpers */}
      <div className="fixed right-4 bottom-4 z-[70] flex flex-col items-end gap-2.5 sm:right-6 sm:bottom-6">
        <motion.button
          initial={false}
          animate={{ opacity: showTop ? 1 : 0, scale: showTop ? 1 : 0.8, y: showTop ? 0 : 10 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className={`press grid h-11 w-11 place-items-center rounded-2xl border border-ink-200/80 bg-white/90 text-ink-600 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/90 dark:text-ink-300 ${showTop ? '' : 'pointer-events-none'}`}
        >
          <ArrowUp className="h-4.5 w-4.5" />
        </motion.button>

        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.94 }}
          onClick={() =>
            pushToast({
              tone: 'info',
              title: 'Admissions helpline',
              description: 'Riya from the admissions desk will call you back within 10 minutes.',
            })
          }
          className="ring-focus flex h-12 items-center gap-2 rounded-2xl bg-ink-900 px-4 text-[13px] font-bold text-white shadow-[0_18px_44px_-20px_rgb(15_23_42_/_0.9)] dark:bg-brand-600"
        >
          <MessageCircle className="h-4 w-4" />
          Talk to admissions
        </motion.button>

        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => {
            setRoute('dashboard')
            startTour()
          }}
          className="ring-focus flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-violet-accent-600 px-4 text-[13px] font-bold text-white shadow-[0_18px_44px_-20px_rgb(37_99_235_/_0.9)]"
        >
          <Sparkles className="h-4 w-4 animate-pulse" />
          Take the Tour
        </motion.button>

        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
          className="ring-focus hidden sm:flex h-12 items-center gap-2 rounded-2xl bg-emerald-700 px-4 text-[13px] font-bold text-white shadow-[0_18px_44px_-20px_rgb(16_185_129_/_0.9)]"
        >
          <Calendar className="h-4 w-4" />
          Book School Demo
        </motion.button>
      </div>

      <CelebrationBurst payload={celebrationPayload} onComplete={clearCelebration} />
    </motion.div>
  )
}
