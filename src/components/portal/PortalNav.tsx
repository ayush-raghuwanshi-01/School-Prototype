import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { ArrowUpRight, GraduationCap, LayoutDashboard, LogIn, Menu, Moon, Phone, Sun, X } from 'lucide-react'
import { useApp } from '../../state/store'
import { cn } from '../../lib/utils'
import { SCHOOL } from '../../data/school'
import { Button } from '../ui/Button'
import { LoginModal } from '../auth/LoginModal'

const LINKS = [
  { id: 'academics', label: 'Academics' },
  { id: 'ethos', label: 'Ethos' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'programs', label: 'Programs' },
  { id: 'campus', label: 'Campus' },
  { id: 'transit', label: 'Transit' },
  { id: 'voices', label: 'Voices' },
  { id: 'admissions', label: 'Admissions' },
]

export function PortalNav() {
  const { setRoute, theme, toggleTheme, pushToast } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [active, setActive] = useState('academics')
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => setScrolled(latest > 24))

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter((el): el is HTMLElement => Boolean(el))
    if (!sections.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0.05, 0.25, 0.5] },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const go = (id: string) => {
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* Utility strip — Riverton Valley School Bhopal Official CBSE Info */}
      <AnimatePresence>
        {!scrolled ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-50 overflow-hidden border-b border-emerald-900/20 bg-emerald-900 text-emerald-100"
          >
            <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-4 px-5 text-[11.5px] font-medium sm:px-8">
              <span className="hidden items-center gap-2 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Admissions open {SCHOOL.session} · CBSE Affiliation No. 1031461 · Bilkhiriya, Bhopal
              </span>
              <span className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3 w-3" /> +91 78699 66422
                </span>
                <span className="hidden text-emerald-200/80 md:inline">15-Acre Nature Campus, Bhopal</span>
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-none sticky top-0 z-[60] flex justify-center px-3 pt-3 sm:pt-4">
        <motion.nav
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'pointer-events-auto flex w-full max-w-6xl items-center gap-2 rounded-2xl border px-2.5 py-2 transition-all duration-500',
            scrolled
              ? 'glass border-slate-200/90 bg-white/95 shadow-[0_18px_50px_-28px_rgb(15_23_42_/_0.2)]'
              : 'border-slate-200/60 bg-white/90 backdrop-blur-md shadow-xs',
          )}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="press ring-focus group flex items-center gap-2.5 rounded-xl px-2 py-1.5"
          >
            <span className="relative grid h-8.5 w-8.5 place-items-center rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-sm">
              <GraduationCap className="h-4.5 w-4.5" />
            </span>
            <span className="text-left leading-none">
              <span className="block text-[14.5px] font-extrabold tracking-[-0.03em] text-slate-900">
                Riverton Valley
              </span>
              <span className="block text-[9.5px] font-bold tracking-[0.22em] text-emerald-700 uppercase">
                School · Bhopal
              </span>
            </span>
          </button>

          <div className="mx-auto hidden items-center gap-0.5 lg:flex">
            {LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => go(link.id)}
                className={cn(
                  'press ring-focus relative rounded-xl px-3 py-1.5 text-[12.5px] font-semibold tracking-[-0.01em] transition-colors',
                  active === link.id ? 'text-emerald-800 font-bold' : 'text-slate-600 hover:text-slate-900',
                )}
              >
                {active === link.id ? (
                  <motion.span
                    layoutId="portal-nav-active"
                    className="absolute inset-0 rounded-xl bg-emerald-50 border border-emerald-100"
                    transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                  />
                ) : null}
                <span className="relative z-10">{link.label}</span>
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            {/* Dedicated Role Login Modal Trigger (Student, Admin, Teacher) */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setLoginOpen(true)}
              className="border-emerald-600/70 text-emerald-800 hover:bg-emerald-50 font-bold"
              icon={<LogIn className="h-3.5 w-3.5 text-emerald-700" />}
            >
              Sign In
            </Button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle colour theme"
              className="press ring-focus grid h-9 w-9 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -70, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 70, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.22 }}
                >
                  {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
                </motion.span>
              </AnimatePresence>
            </button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setRoute('dashboard')
                pushToast({
                  tone: 'info',
                  title: 'Management console',
                  description: 'Signed in as Administrator · whole institution',
                })
              }}
              className="hidden sm:inline-flex"
              icon={<LayoutDashboard className="h-3.5 w-3.5" />}
            >
              Dashboard
            </Button>

            <Button
              size="sm"
              onClick={() => go('admissions')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white"
              icon={<ArrowUpRight className="h-3.5 w-3.5" />}
            >
              Apply
            </Button>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open navigation menu"
              className="press ring-focus grid h-9 w-9 place-items-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
            >
              {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div
              className="fixed inset-0 z-[55] bg-slate-900/40 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-3 top-[74px] z-[58] overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-2xl backdrop-blur-xl lg:hidden"
            >
              {LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                  onClick={() => go(link.id)}
                  className="press flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-[14px] font-semibold text-slate-800 transition-colors hover:bg-slate-100"
                >
                  {link.label}
                  <ArrowUpRight className="h-4 w-4 text-slate-400" />
                </motion.button>
              ))}

              <div className="mt-2 space-y-2 border-t border-slate-200 pt-3">
                <Button
                  className="w-full bg-emerald-700 text-white hover:bg-emerald-800"
                  icon={<LogIn className="h-4 w-4" />}
                  onClick={() => {
                    setMobileOpen(false)
                    setLoginOpen(true)
                  }}
                >
                  Sign in (Student · Teacher · Admin)
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  icon={<LayoutDashboard className="h-4 w-4" />}
                  onClick={() => {
                    setMobileOpen(false)
                    setRoute('dashboard')
                  }}
                >
                  Open management console
                </Button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      {/* Unified Login Modal for Student, Admin, Teacher */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  )
}
