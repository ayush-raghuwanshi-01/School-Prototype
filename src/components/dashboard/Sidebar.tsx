import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgeIndianRupee,
  BarChart3,
  BellRing,
  CalendarCheck2,
  ClipboardCheck,
  ClipboardList,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  Lock,
  LogOut,
  NotebookPen,
  UserCog,
  Users,
  UserSquare2,
  UserRound,
} from 'lucide-react'
import { useApp, type ViewKey } from '../../state/store'
import { cn } from '../../lib/utils'
import { Pill } from '../ui/Badge'

const NAV: {
  id: ViewKey
  label: string
  icon: typeof BarChart3
  group: string
  badgeKey?: 'approvals' | 'reviews'
}[] = [
  { id: 'overview', label: 'Command Centre', icon: LayoutDashboard, group: 'Today' },
  { id: 'approvals', label: 'Approvals', icon: ClipboardList, group: 'Today', badgeKey: 'approvals' },
  { id: 'notices', label: 'Notices & Circulars', icon: BellRing, group: 'Today' },
  { id: 'reviews', label: 'Notes & Reviews', icon: NotebookPen, group: 'Today', badgeKey: 'reviews' },
  { id: 'staff', label: 'Staff & Duty', icon: Users, group: 'School operations' },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck2, group: 'School operations' },
  { id: 'exams', label: 'Exams & Marks', icon: ClipboardCheck, group: 'School operations' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, group: 'Insight' },
  { id: 'reports', label: 'Reports & Compliance', icon: FileBarChart, group: 'Insight' },
  { id: 'fees', label: 'Fees & Invoicing', icon: BadgeIndianRupee, group: 'Finance' },
  { id: 'students', label: 'Students', icon: Users, group: 'People' },
  { id: 'faculty', label: 'Faculty', icon: UserSquare2, group: 'People' },
  { id: 'admissions', label: 'Admissions', icon: UserCog, group: 'Growth' },
  { id: 'child', label: 'My Ward', icon: UserRound, group: 'Family' },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { view, setView, role, setRoute, pushToast, approvalsOpenCount, lessonPlans } = useApp()

  const badgeValue = (key?: 'approvals' | 'reviews') => {
    if (key === 'approvals') return approvalsOpenCount ? String(approvalsOpenCount) : undefined
    if (key === 'reviews') {
      const pending = lessonPlans.filter((p) => p.status === 'pending').length
      return pending ? String(pending) : undefined
    }
    return undefined
  }
  const groups = [...new Set(NAV.map((n) => n.group))]

  const content = (
    <div className="flex h-full flex-col">
      <button
        onClick={() => setRoute('portal')}
        className="press ring-focus flex items-center gap-2.5 rounded-2xl px-2 py-2 text-left transition-colors hover:bg-ink-100 dark:hover:bg-white/6"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-violet-accent-600 text-white shadow-[0_10px_24px_-10px_rgb(37_99_235_/_0.9)]">
          <GraduationCap className="h-5 w-5" />
        </span>
        <span className="leading-none">
          <span className="block text-[13.5px] leading-tight font-extrabold tracking-[-0.03em] text-ink-900 dark:text-white">
            Saraswati Vidhya
          </span>
          <span className="block text-[13.5px] leading-tight font-extrabold tracking-[-0.03em] text-ink-900 dark:text-white">
            Mandir
          </span>
          <span className="block text-[9px] font-bold tracking-[0.2em] text-ink-400 uppercase">Management</span>
        </span>
      </button>

      <div className="mt-4 rounded-2xl border border-ink-200/70 bg-ink-50/70 p-3 dark:border-white/8 dark:bg-white/[0.03]">
        <p className="text-[10.5px] font-bold tracking-[0.16em] text-ink-400 uppercase">Active role</p>
        <p className="mt-1 text-[12.5px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">{role.label}</p>
        <p className="text-[11px] text-ink-500 dark:text-ink-400">{role.person}</p>
        <Pill tone={role.accent} className="mt-2">
          {role.views.length} of {NAV.length} modules
        </Pill>
      </div>

      <nav className="mt-5 min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
        {groups.map((group) => (
          <div key={group}>
            <p className="px-2.5 pb-1.5 text-[10.5px] font-bold tracking-[0.16em] text-ink-400 uppercase">{group}</p>
            <div className="space-y-0.5">
              {NAV.filter((n) => n.group === group).map((item) => {
                const allowed = role.views.includes(item.id)
                const active = view === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setView(item.id)
                      onClose()
                      if (!allowed) {
                        pushToast({
                          tone: 'warning',
                          title: `${item.label} is outside your scope`,
                          description: `${role.label} can view ${role.views.length} modules. Shown in read-only preview.`,
                        })
                      }
                    }}
                    className={cn(
                      'press group relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-colors',
                      active
                        ? 'bg-ink-900 text-white shadow-[0_12px_28px_-16px_rgb(15_23_42_/_0.8)] dark:bg-brand-600'
                        : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-white/6 dark:hover:text-white',
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="sidebar-active"
                        className="absolute -left-1 h-5 w-1 rounded-full bg-brand-500 dark:bg-white"
                        transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                      />
                    ) : null}
                    <item.icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110',
                        active ? 'text-white' : 'text-ink-400',
                      )}
                    />
                    <span className="flex-1 truncate text-[13px] font-semibold tracking-[-0.01em]">{item.label}</span>
                    {!allowed ? (
                      <Lock className="h-3 w-3 shrink-0 text-ink-400" />
                    ) : badgeValue(item.badgeKey) ? (
                      <span
                        className={cn(
                          'rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white',
                          item.badgeKey === 'approvals' ? 'bg-rose-500' : 'bg-violet-accent-600',
                        )}
                      >
                        {badgeValue(item.badgeKey)}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-4 space-y-2 border-t border-ink-200/70 pt-4 dark:border-white/8">
        <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-violet-accent-600 p-3.5 text-white">
          <p className="text-[12.5px] font-bold tracking-[-0.01em]">Session 2026–27 · Term 2</p>
          <p className="mt-0.5 text-[11px] text-white/75">Day 118 of 234 · 41 instructional days left this term</p>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/25">
            <motion.div
              className="h-full rounded-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: '50.4%' }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
        <button
          onClick={() => {
            setRoute('portal')
            onClose()
          }}
          className="press flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-ink-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-ink-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-[12.5px] font-semibold">Exit to public site</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[270px] shrink-0 border-r border-ink-200/70 bg-white/70 p-3.5 backdrop-blur-xl lg:block dark:border-white/8 dark:bg-ink-950/60">
        {content}
      </aside>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              className="fixed inset-0 z-[85] bg-ink-950/50 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              className="fixed inset-y-0 left-0 z-[86] w-[280px] border-r border-ink-200/80 bg-white p-3.5 lg:hidden dark:border-white/10 dark:bg-ink-900"
            >
              {content}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}
