import { motion } from 'framer-motion'
import { MessageCircle, ArrowUp, Sparkles, LogIn } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PortalNav } from './PortalNav'
import { Hero } from './Hero'
import { RivertonEthosSection } from './RivertonEthosSection'
import { LeadershipSection } from './LeadershipSection'
import { ProgramsSection } from './ProgramsSection'
import { CampusSection } from './CampusSection'
import { BhopalTransitSection } from './BhopalTransitSection'
import { Testimonials } from './Testimonials'
import { PricingSection } from './PricingSection'
import { DemoBookingSection } from './DemoBookingSection'
import { AdmissionsSection } from './AdmissionsSection'
import { PortalFooter } from './PortalFooter'
import { CelebrationBurst } from '../ui/CelebrationBurst'
import { LoginModal } from '../auth/LoginModal'
import { useApp } from '../../state/store'

export function PublicPortal() {
  const { pushToast, setRoute, startTour, celebrationPayload, clearCelebration } = useApp()
  const [showTop, setShowTop] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

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
      className="relative min-h-screen bg-white text-slate-900"
    >
      <PortalNav />
      <main>
        <Hero />
        <RivertonEthosSection />
        <LeadershipSection />
        <ProgramsSection />
        <CampusSection />
        <BhopalTransitSection />
        <Testimonials />
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
          className={`press grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white/95 text-slate-600 shadow-lg backdrop-blur-xl ${showTop ? '' : 'pointer-events-none'}`}
        >
          <ArrowUp className="h-4.5 w-4.5" />
        </motion.button>

        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setLoginOpen(true)}
          className="ring-focus flex h-11 items-center gap-2 rounded-2xl bg-emerald-700 px-3.5 text-[12.5px] font-bold text-white shadow-md hover:bg-emerald-800"
        >
          <LogIn className="h-4 w-4" />
          Role Login
        </motion.button>

        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.94 }}
          onClick={() =>
            pushToast({
              tone: 'info',
              title: 'Admissions helpline · Bhopal',
              description: 'Riverton Valley admissions desk will call you back within 10 minutes.',
            })
          }
          className="ring-focus flex h-11 items-center gap-2 rounded-2xl bg-slate-900 px-3.5 text-[12.5px] font-bold text-white shadow-md"
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
          className="ring-focus flex h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-700 px-3.5 text-[12.5px] font-bold text-white shadow-md"
        >
          <Sparkles className="h-4 w-4 animate-pulse" />
          Take the Tour
        </motion.button>
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <CelebrationBurst payload={celebrationPayload} onComplete={clearCelebration} />
    </motion.div>
  )
}
