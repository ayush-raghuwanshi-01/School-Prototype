import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  BadgeIndianRupee,
  Building2,
  CalendarCheck2,
  Check,
  ChevronDown,
  GraduationCap,
  HelpCircle,
  LogOut,
  MapPin,
  Menu,
  Moon,
  PanelsTopLeft,
  Radio,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  UserCog,
  X,
} from 'lucide-react'
import { ROLES, useApp } from '../../state/store'
import { CAMPUS_BRANCHES, type Role } from '../../data/school'
import { cn } from '../../lib/utils'
import { Pill } from '../ui/Badge'

const ROLE_ICONS: Record<Role, typeof UserCog> = {
  admin: Settings,
  principal: GraduationCap,
  teacher: PanelsTopLeft,
  accountant: BadgeIndianRupee,
  parent: ShieldCheck,
}

const TONE_RING: Record<string, string> = {
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
  violet: 'bg-violet-accent-50 text-violet-accent-700 dark:bg-violet-accent-500/15 dark:text-violet-accent-400',
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
}

const KIND_ICONS: Record<string, typeof Bell> = {
  fees: BadgeIndianRupee,
  attendance: CalendarCheck2,
  exams: PanelsTopLeft,
  admissions: UserCog,
  transport: HelpCircle,
}

/* ------------------------------------------------------------------ */
function CampusBranchSelector() {
  const { campus, setCampus } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const current = CAMPUS_BRANCHES.find((b) => b.id === campus) || CAMPUS_BRANCHES[0]

  return (
    <div ref={ref} className="relative hidden xl:block">
      <button
        onClick={() => setOpen(!open)}
        className="press flex h-10 items-center gap-2 rounded-xl border border-ink-200/80 bg-white/80 px-2.5 text-left text-ink-700 hover:border-ink-300 dark:border-white/10 dark:bg-white/[0.05] dark:text-ink-200"
      >
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
          <Building2 className="h-3.5 w-3.5" />
        </span>
        <div className="leading-none text-left">
          <span className="block text-[11px] font-bold text-ink-900 dark:text-white truncate max-w-[130px]">
            {current.name.split('(')[0]}
          </span>
          <span className="block font-mono text-[9.5px] text-ink-400">{current.studentsCount} Students</span>
        </div>
        <ChevronDown className={cn('h-3 w-3 text-ink-400 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            className="absolute left-0 z-[80] mt-2 w-72 rounded-2xl border border-ink-200/80 bg-white/98 p-1.5 shadow-xl backdrop-blur-2xl dark:border-white/12 dark:bg-ink-900/98"
          >
            <p className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-ink-400 uppercase">
              Multi-Branch Campus Switcher
            </p>
            {CAMPUS_BRANCHES.map((b) => {
              const active = b.id === campus
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setCampus(b.id)
                    setOpen(false)
                  }}
                  className={cn(
                    'press flex w-full items-start gap-2.5 rounded-xl px-3 py-2 text-left transition-colors',
                    active ? 'bg-brand-50/80 dark:bg-white/10' : 'hover:bg-ink-50 dark:hover:bg-white/5',
                  )}
                >
                  <MapPin className="h-3.5 w-3.5 mt-0.5 text-brand-600 shrink-0" />
                  <div className="min-w-0 flex-1 text-[11.5px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink-900 dark:text-white">{b.name}</span>
                      {active && <Check className="h-3 w-3 text-emerald-500" />}
                    </div>
                    <p className="text-[10px] text-ink-400">
                      {b.location} · {b.grades}
                    </p>
                    <span className="font-mono text-[9.5px] text-brand-600 dark:text-brand-400">
                      {b.studentsCount} Students · Head: {b.principal}
                    </span>
                  </div>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
function RoleSelector() {
  const { role, setRoleId } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const RoleIcon = ROLE_ICONS[role.id]

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="press ring-focus flex h-10 items-center gap-2.5 rounded-xl border border-ink-200/80 bg-white/80 pr-2.5 pl-2 transition-colors hover:border-ink-300 dark:border-white/10 dark:bg-white/[0.05] dark:hover:border-white/20"
      >
        <span className={cn('grid h-7 w-7 place-items-center rounded-lg', TONE_RING[role.accent])}>
          <RoleIcon className="h-3.5 w-3.5" />
        </span>
        <span className="hidden text-left leading-none sm:block">
          <span className="block text-[12.5px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
            {role.label}
          </span>
          <span className="block text-[10.5px] text-ink-400">{role.person}</span>
        </span>
        <ChevronDown
          className={cn('h-3.5 w-3.5 text-ink-400 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 z-[80] mt-2 w-[22rem] overflow-hidden rounded-2xl border border-ink-200/80 bg-white/97 p-1.5 shadow-[0_30px_80px_-30px_rgb(15_23_42_/_0.55)] backdrop-blur-2xl dark:border-white/12 dark:bg-ink-900/97"
          >
            <p className="px-3 py-2 text-[10.5px] font-bold tracking-[0.16em] text-ink-400 uppercase">
              Switch role · permissions apply
            </p>
            {ROLES.map((r) => {
              const Icon = ROLE_ICONS[r.id]
              const active = r.id === role.id
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    setRoleId(r.id)
                    setOpen(false)
                  }}
                  className={cn(
                    'press flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                    active ? 'bg-ink-100 dark:bg-white/8' : 'hover:bg-ink-50 dark:hover:bg-white/[0.05]',
                  )}
                >
                  <span
                    className={cn('mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg', TONE_RING[r.accent])}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[13px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
                        {r.label}
                      </span>
                      {active ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : null}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] leading-relaxed text-ink-500 dark:text-ink-400">
                      {r.description}
                    </span>
                    <span className="mt-1 block font-mono text-[10.5px] text-ink-400">
                      {r.views.length} modules · {r.scope}
                    </span>
                  </span>
                </button>
              )
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
function NotificationPanel() {
  const { notifications, unreadCount, notificationsOpen, setNotificationsOpen, markNotificationsRead, pushToast } =
    useApp()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setNotificationsOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [setNotificationsOpen])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setNotificationsOpen(!notificationsOpen)}
        aria-label="Notifications"
        className={cn(
          'press ring-focus relative grid h-10 w-10 place-items-center rounded-xl border transition-colors',
          notificationsOpen
            ? 'border-brand-300 bg-brand-50 text-brand-600 dark:border-brand-500/40 dark:bg-brand-500/15 dark:text-brand-300'
            : 'border-ink-200/80 bg-white/80 text-ink-500 hover:border-ink-300 hover:text-ink-900 dark:border-white/10 dark:bg-white/[0.05] dark:text-ink-300 dark:hover:border-white/20',
        )}
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10.5px] font-bold text-white ring-2 ring-white dark:ring-ink-950"
          >
            {unreadCount}
          </motion.span>
        ) : null}
      </button>

      <AnimatePresence>
        {notificationsOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 z-[80] mt-2 w-[24rem] overflow-hidden rounded-2xl border border-ink-200/80 bg-white/97 shadow-[0_30px_80px_-30px_rgb(15_23_42_/_0.55)] backdrop-blur-2xl dark:border-white/12 dark:bg-ink-900/97"
          >
            <div className="flex items-center justify-between border-b border-ink-200/70 px-4 py-3 dark:border-white/8">
              <div>
                <p className="text-[13.5px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">Notifications</p>
                <p className="text-[11px] text-ink-400">{unreadCount} unread · last 24 hours</p>
              </div>
              <button
                onClick={markNotificationsRead}
                className="press rounded-lg px-2 py-1 text-[11.5px] font-bold text-brand-600 transition-colors hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10"
              >
                Mark all read
              </button>
            </div>
            <div className="max-h-[340px] overflow-y-auto p-1.5">
              {notifications.map((n, i) => {
                const Icon = KIND_ICONS[n.kind] ?? Bell
                return (
                  <motion.button
                    key={n.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => {
                      setNotificationsOpen(false)
                      pushToast({ tone: 'info', title: n.title, description: n.body })
                    }}
                    className="press flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-ink-50 dark:hover:bg-white/[0.05]"
                  >
                    <span
                      className={cn(
                        'mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg',
                        n.unread
                          ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300'
                          : 'bg-ink-100 text-ink-400 dark:bg-white/6',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start gap-2">
                        <span className="flex-1 text-[12.5px] leading-snug font-bold text-ink-900 dark:text-white">
                          {n.title}
                        </span>
                        {n.unread ? <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" /> : null}
                      </span>
                      <span className="mt-0.5 block text-[11.5px] leading-relaxed text-ink-500 dark:text-ink-400">
                        {n.body}
                      </span>
                      <span className="mt-1 block font-mono text-[10.5px] text-ink-400">{n.at} ago</span>
                    </span>
                  </motion.button>
                )
              })}
            </div>
            <div className="border-t border-ink-200/70 bg-ink-50/60 px-4 py-2.5 dark:border-white/8 dark:bg-white/[0.02]">
              <button
                onClick={() => {
                  setNotificationsOpen(false)
                  pushToast({
                    tone: 'info',
                    title: 'Notification centre',
                    description: 'Full activity log opens in Reports.',
                  })
                }}
                className="press text-[11.5px] font-bold text-ink-500 transition-colors hover:text-ink-900 dark:text-ink-400 dark:hover:text-white"
              >
                View full activity log →
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
export function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { setPaletteOpen, theme, toggleTheme, setRoute, role, pushToast, startTour, setBiometricModalOpen } = useApp()
  const [mobileSearch, setMobileSearch] = useState(false)

  return (
    <header className="sticky top-0 z-[65] border-b border-ink-200/70 bg-white/80 backdrop-blur-2xl dark:border-white/8 dark:bg-ink-950/80">
      <div className="flex h-16 items-center gap-3 px-3 sm:px-5">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="press ring-focus grid h-10 w-10 place-items-center rounded-xl text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900 lg:hidden dark:text-ink-300 dark:hover:bg-white/10"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <CampusBranchSelector />

        <button
          onClick={() => setPaletteOpen(true)}
          className="press ring-focus group hidden h-10 max-w-md flex-1 items-center gap-3 rounded-xl border border-ink-200/80 bg-ink-50/80 px-3.5 text-left transition-colors hover:border-ink-300 hover:bg-white md:flex dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/20 dark:hover:bg-white/[0.07]"
        >
          <Search className="h-4 w-4 shrink-0 text-ink-400 transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-400" />
          <span className="flex-1 truncate text-[13px] font-medium text-ink-400">
            Search students, invoices, modules…
          </span>
          <kbd className="flex shrink-0 items-center gap-0.5 rounded-lg border border-ink-200 bg-white px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-ink-500 dark:border-white/12 dark:bg-white/5 dark:text-ink-400">
            ⌘ K
          </kbd>
        </button>

        <button
          onClick={() => setMobileSearch(true)}
          aria-label="Search"
          className="press ring-focus grid h-10 w-10 place-items-center rounded-xl border border-ink-200/80 bg-white/80 text-ink-500 md:hidden dark:border-white/10 dark:bg-white/[0.05] dark:text-ink-300"
        >
          <Search className="h-4.5 w-4.5" />
        </button>

        <div className="ml-auto flex items-center gap-2">
          {/* Sales Guided Walkthrough Button */}
          <button
            onClick={startTour}
            className="press hidden sm:flex items-center gap-1.5 rounded-xl border border-brand-300 bg-brand-50/90 px-3 py-2 text-[12px] font-bold text-brand-700 shadow-2xs hover:bg-brand-100 dark:border-brand-500/30 dark:bg-brand-500/15 dark:text-brand-300 dark:hover:bg-brand-500/25"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
            <span>Take the Tour</span>
          </button>

          {/* Biometric RFID Gate Scan Simulation Button */}
          <button
            onClick={() => setBiometricModalOpen(true)}
            title="Simulate Biometric / RFID Gate Scan"
            className="press hidden md:flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50/90 px-2.5 py-2 text-[12px] font-bold text-emerald-700 shadow-2xs hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300"
          >
            <Radio className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>SmartGate</span>
          </button>

          <Pill tone="emerald" dot className="hidden sm:inline-flex">
            {role.scope}
          </Pill>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="press ring-focus grid h-10 w-10 place-items-center rounded-xl border border-ink-200/80 bg-white/80 text-ink-500 transition-colors hover:border-ink-300 hover:text-ink-900 dark:border-white/10 dark:bg-white/[0.05] dark:text-ink-300 dark:hover:border-white/20 dark:hover:text-white"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -80, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 80, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.22 }}
              >
                {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </motion.span>
            </AnimatePresence>
          </button>

          <NotificationPanel />

          <RoleSelector />

          <button
            onClick={() => {
              setRoute('portal')
              pushToast({
                tone: 'info',
                title: 'Signed out to public site',
                description: 'Session preserved — return any time.',
              })
            }}
            aria-label="Sign out to public site"
            className="press ring-focus hidden h-10 w-10 place-items-center rounded-xl border border-ink-200/80 bg-white/80 text-ink-500 transition-colors hover:border-rose-300 hover:text-rose-600 sm:grid dark:border-white/10 dark:bg-white/[0.05] dark:text-ink-300 dark:hover:border-rose-500/40 dark:hover:text-rose-400"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Mobile search sheet */}
      <AnimatePresence>
        {mobileSearch ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ink-200/70 md:hidden dark:border-white/8"
          >
            <div className="flex items-center gap-2 p-3">
              <button
                onClick={() => {
                  setMobileSearch(false)
                  setPaletteOpen(true)
                }}
                className="press flex h-10 flex-1 items-center gap-3 rounded-xl border border-ink-200/80 bg-white px-3.5 text-left dark:border-white/10 dark:bg-white/[0.05]"
              >
                <Search className="h-4 w-4 text-ink-400" />
                <span className="text-[13px] text-ink-400">Open command palette…</span>
              </button>
              <button
                onClick={() => setMobileSearch(false)}
                aria-label="Close search"
                className="press grid h-10 w-10 place-items-center rounded-xl border border-ink-200/80 dark:border-white/10"
              >
                <X className="h-4 w-4 text-ink-500" />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

export { NotificationPanel, RoleSelector }
