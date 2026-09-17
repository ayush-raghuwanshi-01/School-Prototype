import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeIndianRupee,
  BarChart3,
  BellRing,
  CalendarCheck2,
  CornerDownLeft,
  FileBarChart,
  ClipboardCheck,
  ClipboardList,
  Globe2,
  LayoutDashboard,
  Moon,
  NotebookPen,
  Search,
  Sun,
  UserCog,
  Users,
  UserSquare2,
} from 'lucide-react'
import { ROLES, useApp, type ViewKey } from '../../state/store'
import { cn } from '../../lib/utils'
import { STUDENTS } from '../../data/school'
import { Avatar } from '../ui/Form'

interface Command {
  id: string
  label: string
  hint?: string
  group: 'Navigate' | 'Actions' | 'People' | 'Roles'
  icon: typeof Search
  run: () => void
}

export function CommandPalette() {
  const { paletteOpen } = useApp()
  return <AnimatePresence>{paletteOpen ? <PaletteSurface key="command-palette" /> : null}</AnimatePresence>
}

/**
 * The palette surface is only mounted while open, so its query, cursor and
 * focus state always start clean — no reset effects required.
 */
function PaletteSurface() {
  const { setPaletteOpen, setView, setRoleId, toggleTheme, theme, pushToast, role } = useApp()
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands = useMemo<Command[]>(() => {
    const nav: Array<[ViewKey, string, typeof Search]> = [
      ['overview', 'Command Centre', LayoutDashboard],
      ['approvals', 'Approvals & Sanctions', ClipboardList],
      ['notices', 'Notices & Circulars', BellRing],
      ['reviews', 'Notes & Reviews', NotebookPen],
      ['staff', 'Staff & Duty Roster', Users],
      ['attendance', 'Attendance Heatmap', CalendarCheck2],
      ['exams', 'Exam Schedule & Marks', ClipboardCheck],
      ['analytics', 'Analytics & Insight', BarChart3],
      ['fees', 'Fees & Invoicing', BadgeIndianRupee],
      ['students', 'Student Directory', Users],
      ['faculty', 'Faculty Directory', UserSquare2],
      ['reports', 'Reports & Compliance', FileBarChart],
      ['admissions', 'Admissions Pipeline', UserCog],
      ['child', 'My Ward — Aarav Mehta', Globe2],
    ]
    const base: Command[] = nav.map(([view, label, icon]) => ({
      id: `nav-${view}`,
      label,
      group: 'Navigate',
      icon,
      hint: role.views.includes(view) ? 'available' : 'outside your role',
      run: () => {
        setView(view)
        pushToast(
          role.views.includes(view)
            ? { tone: 'info', title: `Opened ${label}`, description: `as ${role.label}` }
            : {
                tone: 'warning',
                title: `${label} is restricted`,
                description: `${role.label} has read-only scope for this module.`,
              },
        )
      },
    }))

    const actions: Command[] = [
      {
        id: 'act-theme',
        label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
        group: 'Actions',
        icon: theme === 'dark' ? Sun : Moon,
        run: toggleTheme,
      },
      {
        id: 'act-portal',
        label: 'Open public website',
        group: 'Actions',
        icon: Globe2,
        run: () => {
          setPaletteOpen(false)
          window.setTimeout(() => {
            document.dispatchEvent(new CustomEvent('svm:navigate-portal'))
          }, 80)
        },
      },
      {
        id: 'act-attendance',
        label: 'Mark whole class present',
        group: 'Actions',
        icon: CalendarCheck2,
        run: () => {
          setView('attendance')
          document.dispatchEvent(new CustomEvent('svm:bulk-present'))
        },
      },
      {
        id: 'act-fees',
        label: 'Record a fee payment',
        group: 'Actions',
        icon: BadgeIndianRupee,
        run: () => {
          setView('fees')
          document.dispatchEvent(new CustomEvent('svm:open-payment'))
        },
      },
    ]

    const people: Command[] = STUDENTS.slice(0, 12).map((s) => ({
      id: `stu-${s.id}`,
      label: s.name,
      hint: `Roll ${s.roll} · ${s.classId}-${s.section} · ${s.feeStatus} fees`,
      group: 'People',
      icon: Users,
      run: () => {
        setView('students')
        document.dispatchEvent(new CustomEvent('svm:focus-student', { detail: s.id }))
      },
    }))

    const roles: Command[] = ROLES.map((r) => ({
      id: `role-${r.id}`,
      label: `Switch to ${r.label}`,
      hint: `${r.person} · ${r.scope}`,
      group: 'Roles',
      icon: LayoutDashboard,
      run: () => setRoleId(r.id),
    }))

    return [...base, ...actions, ...people, ...roles]
  }, [pushToast, role, setPaletteOpen, setRoleId, setView, theme, toggleTheme])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? commands.filter((c) => c.label.toLowerCase().includes(q) || (c.hint ?? '').toLowerCase().includes(q))
      : commands
    return list.slice(0, 12)
  }, [commands, query])

  const grouped = useMemo(() => {
    const map = new Map<Command['group'], Command[]>()
    filtered.forEach((c) => {
      const arr = map.get(c.group) ?? []
      arr.push(c)
      map.set(c.group, arr)
    })
    return [...map.entries()]
  }, [filtered])

  // Mounted only while the palette is open, so the listener needs no gate.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setCursor((c) => Math.min(filtered.length - 1, c + 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setCursor((c) => Math.max(0, c - 1))
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        const cmd = filtered[cursor]
        if (cmd) {
          cmd.run()
          if (cmd.id !== 'act-theme') setPaletteOpen(false)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cursor, filtered, setPaletteOpen])

  let flatIndex = -1

  return (
    <div className="fixed inset-0 z-[110] flex items-start justify-center p-4 pt-[8vh] sm:pt-[12vh]">
      <motion.div
        className="absolute inset-0 bg-ink-950/55 backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={() => setPaletteOpen(false)}
      />
      <motion.div
        initial={{ opacity: 0, y: -18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 480, damping: 34 }}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-ink-200/80 bg-white/97 shadow-[0_40px_100px_-30px_rgb(15_23_42_/_0.65)] backdrop-blur-2xl dark:border-white/12 dark:bg-ink-900/97"
      >
        <div className="flex items-center gap-3 border-b border-ink-200/70 px-5 py-4 dark:border-white/8">
          <Search className="h-4.5 w-4.5 shrink-0 text-ink-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setCursor(0)
            }}
            placeholder="Search students, jump to a module, switch role…"
            className="h-7 flex-1 bg-transparent text-[14.5px] font-medium text-ink-900 outline-none placeholder:font-normal placeholder:text-ink-400 dark:text-white dark:placeholder:text-ink-500"
          />
          <kbd className="hidden rounded-lg border border-ink-200 bg-ink-50 px-2 py-1 font-mono text-[10.5px] font-semibold text-ink-500 sm:block dark:border-white/12 dark:bg-white/5 dark:text-ink-400">
            ESC
          </kbd>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2">
          {grouped.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-[13.5px] font-bold text-ink-700 dark:text-ink-200">No matches for “{query}”</p>
              <p className="mt-1 text-[12.5px] text-ink-500 dark:text-ink-400">
                Try a student name, “fees”, “attendance” or “role”.
              </p>
            </div>
          ) : (
            grouped.map(([group, items]) => (
              <div key={group} className="mb-1">
                <p className="px-3 py-2 text-[10.5px] font-bold tracking-[0.16em] text-ink-400 uppercase">{group}</p>
                {items.map((cmd) => {
                  flatIndex += 1
                  const idx = flatIndex
                  const active = idx === cursor
                  return (
                    <button
                      key={cmd.id}
                      onMouseEnter={() => setCursor(idx)}
                      onClick={() => {
                        cmd.run()
                        if (cmd.id !== 'act-theme') setPaletteOpen(false)
                      }}
                      className={cn(
                        'press flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors',
                        active ? 'bg-ink-900 text-white dark:bg-brand-600' : 'text-ink-700 dark:text-ink-200',
                      )}
                    >
                      {cmd.group === 'People' ? (
                        <Avatar name={cmd.label} tone={idx % 6} size={26} />
                      ) : (
                        <span
                          className={cn(
                            'grid h-7 w-7 shrink-0 place-items-center rounded-lg',
                            active
                              ? 'bg-white/15 text-white'
                              : 'bg-ink-100 text-ink-500 dark:bg-white/8 dark:text-ink-300',
                          )}
                        >
                          <cmd.icon className="h-3.5 w-3.5" />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-semibold tracking-[-0.01em]">
                          {cmd.label}
                        </span>
                        {cmd.hint ? (
                          <span
                            className={cn(
                              'block truncate text-[11.5px] capitalize',
                              active ? 'text-white/70' : 'text-ink-400',
                            )}
                          >
                            {cmd.hint}
                          </span>
                        ) : null}
                      </span>
                      {active ? (
                        <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-white/70" />
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink-300 dark:text-ink-600" />
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-ink-200/70 bg-ink-50/70 px-5 py-3 dark:border-white/8 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3 text-[11px] font-semibold text-ink-400">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-ink-200 bg-white px-1.5 py-0.5 font-mono text-[10px] dark:border-white/12 dark:bg-white/5">
                ↑↓
              </kbd>
              navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-ink-200 bg-white px-1.5 py-0.5 font-mono text-[10px] dark:border-white/12 dark:bg-white/5">
                ↵
              </kbd>
              open
            </span>
          </div>
          <span className="text-[11px] font-semibold text-ink-400">
            Signed in as <strong className="text-ink-600 dark:text-ink-300">{role.person}</strong>
          </span>
        </div>
      </motion.div>
    </div>
  )
}
