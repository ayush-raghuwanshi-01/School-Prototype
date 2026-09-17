import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { ArrowUpRight, GraduationCap, LayoutDashboard, Menu, Moon, Phone, Sun, X } from 'lucide-react'
import { useApp } from '../../state/store'
import { cn } from '../../lib/utils'
import { SCHOOL } from '../../data/school'
import { Button } from '../ui/Button'

const LINKS = [
  { id: 'academics', label: 'Academics' },
  { id: 'programs', label: 'Programs' },
  { id: 'campus', label: 'Campus' },
  { id: 'voices', label: 'Voices' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'demo', label: 'Book Demo' },
  { id: 'admissions', label: 'Admissions' },
]

export function PortalNav() {
  const { setRoute, theme, toggleTheme, pushToast } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
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
      {/* Utility strip — hides on scroll for a cleaner floating nav */}
      <AnimatePresence>
        {!scrolled ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-50 overflow-hidden border-b border-ink-200/70 bg-ink-900 text-ink-200 dark:border-white/8 dark:bg-ink-950"
          >
            <div className="mx-auto flex h-10 max-w-7xl items-center justify-between gap-4 px-5 text-[11.5px] font-medium sm:px-8">
              <span className="hidden items-center gap-2 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Admissions open for session {SCHOOL.session} · {SCHOOL.affiliation}
              </span>
              <span className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3 w-3" /> {SCHOOL.phone}
                </span>
                <span className="hidden text-ink-400 md:inline">{SCHOOL.campus}</span>
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
              ? 'glass border-ink-200/70 bg-white/78 shadow-[0_18px_50px_-28px_rgb(15_23_42_/_0.45)] dark:border-white/10 dark:bg-ink-900/72'
              : 'border-transparent bg-white/45 backdrop-blur-md dark:bg-white/[0.03]',
          )}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="press ring-focus group flex items-center gap-2.5 rounded-xl px-2 py-1.5"
          >
            <span className="relative grid h-8.5 w-8.5 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-violet-accent-600 text-white shadow-[0_8px_20px_-8px_rgb(37_99_235_/_0.9)]">
              <GraduationCap className="h-4.5 w-4.5" />
            </span>
            <span className="text-left leading-none">
              <span className="block text-[14.5px] font-extrabold tracking-[-0.03em] text-ink-900 dark:text-white">
                Saraswati Vidhya
              </span>
              <span className="block text-[9.5px] font-bold tracking-[0.22em] text-ink-400 uppercase">
                Mandir · Bhopal
              </span>
            </span>
          </button>

          <div className="mx-auto hidden items-center gap-0.5 lg:flex">
            {LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => go(link.id)}
                className={cn(
                  'press ring-focus relative rounded-xl px-3.5 py-2 text-[13px] font-semibold tracking-[-0.01em] transition-colors',
                  active === link.id
                    ? 'text-ink-900 dark:text-white'
                    : 'text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white',
                )}
              >
                {active === link.id ? (
                  <motion.span
                    layoutId="portal-nav-active"
                    className="absolute inset-0 rounded-xl bg-ink-100 dark:bg-white/10"
                    transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                  />
                ) : null}
                <span className="relative z-10">{link.label}</span>
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle colour theme"
              className="press ring-focus grid h-9 w-9 place-items-center rounded-xl text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-white/10 dark:hover:text-white"
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

            <Button size="sm" onClick={() => go('admissions')} icon={<ArrowUpRight className="h-3.5 w-3.5" />}>
              Apply
            </Button>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open navigation menu"
              className="press ring-focus grid h-9 w-9 place-items-center rounded-xl text-ink-600 transition-colors hover:bg-ink-100 lg:hidden dark:text-ink-300 dark:hover:bg-white/10"
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
              className="fixed inset-0 z-[55] bg-ink-950/40 backdrop-blur-sm lg:hidden"
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
              className="fixed inset-x-3 top-[74px] z-[58] overflow-hidden rounded-3xl border border-ink-200/80 bg-white/95 p-2.5 shadow-2xl backdrop-blur-xl lg:hidden dark:border-white/10 dark:bg-ink-900/95"
            >
              {LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                  onClick={() => go(link.id)}
                  className="press flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-left text-[15px] font-semibold text-ink-800 transition-colors hover:bg-ink-100 dark:text-ink-100 dark:hover:bg-white/8"
                >
                  {link.label}
                  <ArrowUpRight className="h-4 w-4 text-ink-400" />
                </motion.button>
              ))}
              <div className="mt-2 border-t border-ink-200/70 pt-2.5 dark:border-white/8">
                <Button
                  className="w-full"
                  variant="secondary"
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
    </>
  )
}
