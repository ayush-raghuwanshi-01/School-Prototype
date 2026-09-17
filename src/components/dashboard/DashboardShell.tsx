import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Command, Globe2, Lock, Search } from 'lucide-react'
import { useApp, type ViewKey } from '../../state/store'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { CommandPalette } from './CommandPalette'
import { QuickActions } from './QuickActions'
import { OverviewView } from './views/OverviewView'
import { ApprovalsView } from './views/ApprovalsView'
import { NoticesView } from './views/NoticesView'
import { ReviewsView } from './views/ReviewsView'
import { StaffView } from './views/StaffView'
import { AnalyticsView } from './views/AnalyticsView'
import { AttendanceView } from './views/AttendanceView'
import { FeesView } from './views/FeesView'
import { ExamsView } from './views/ExamsView'
import { StudentsView } from './views/StudentsView'
import { FacultyView } from './views/FacultyView'
import { ReportsView } from './views/ReportsView'
import { AdmissionsView } from './views/AdmissionsView'
import { ChildView } from './views/ChildView'
import { Pill } from '../ui/Badge'
import { Button } from '../ui/Button'

const VIEW_LABEL: Record<ViewKey, string> = {
  overview: 'Command Centre',
  approvals: 'Approvals',
  notices: 'Notices & Circulars',
  reviews: 'Notes & Reviews',
  staff: 'Staff & Duty',
  analytics: 'Admin Analytics',
  attendance: 'Attendance',
  fees: 'Fees & Invoicing',
  exams: 'Exams & Marks',
  students: 'Students',
  faculty: 'Faculty',
  reports: 'Reports',
  admissions: 'Admissions',
  child: 'My Ward',
}

export function DashboardShell() {
  const { view, setView, role, setPaletteOpen, setRoute } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Command palette can hop back to the public site.
  useEffect(() => {
    const handler = () => setRoute('portal')
    document.addEventListener('svm:navigate-portal', handler)
    return () => document.removeEventListener('svm:navigate-portal', handler)
  }, [setRoute])

  const allowed = role.views.includes(view)

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen bg-ink-50/70 dark:bg-ink-950"
    >
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

        <main className="min-h-0 flex-1 px-3 py-5 sm:px-5 sm:py-6">
          <AnimatePresence>
            {!allowed ? (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 dark:border-amber-500/25 dark:bg-amber-500/10">
                  <Lock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="flex-1 text-[12.5px] font-medium text-amber-900 dark:text-amber-100">
                    <strong className="font-bold">{VIEW_LABEL[view]}</strong> sits outside the {role.label} scope. You
                    are viewing a read-only preview — actions are simulated.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => setView(role.defaultView)}>
                    Back to {VIEW_LABEL[role.defaultView]}
                  </Button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              {view === 'overview' ? <OverviewView /> : null}
              {view === 'approvals' ? <ApprovalsView /> : null}
              {view === 'notices' ? <NoticesView /> : null}
              {view === 'reviews' ? <ReviewsView /> : null}
              {view === 'staff' ? <StaffView /> : null}
              {view === 'analytics' ? <AnalyticsView /> : null}
              {view === 'attendance' ? <AttendanceView /> : null}
              {view === 'fees' ? <FeesView /> : null}
              {view === 'exams' ? <ExamsView /> : null}
              {view === 'students' ? <StudentsView /> : null}
              {view === 'faculty' ? <FacultyView /> : null}
              {view === 'reports' ? <ReportsView /> : null}
              {view === 'admissions' ? <AdmissionsView /> : null}
              {view === 'child' ? <ChildView /> : null}
            </motion.div>
          </AnimatePresence>

          <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-ink-200/70 pt-5 pb-16 dark:border-white/8">
            <div className="flex flex-wrap items-center gap-2.5">
              <Pill tone="slate">Saraswati Vidhya Mandir · School ERP v4.2</Pill>
              <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-ink-400">
                <Command className="h-3 w-3" /> Press ⌘K anywhere
              </span>
              <button
                onClick={() => setPaletteOpen(true)}
                className="press inline-flex items-center gap-1.5 rounded-lg border border-ink-200/80 px-2 py-1 text-[11.5px] font-semibold text-ink-500 transition-colors hover:border-brand-400 hover:text-brand-600 dark:border-white/10 dark:text-ink-400"
              >
                <Search className="h-3 w-3" /> Command palette
              </button>
            </div>
            <button
              onClick={() => setRoute('portal')}
              className="press inline-flex items-center gap-1.5 text-[11.5px] font-bold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
            >
              <Globe2 className="h-3.5 w-3.5" /> Open public website
            </button>
          </footer>
        </main>
      </div>

      <CommandPalette />
      <QuickActions />
    </motion.div>
  )
}
