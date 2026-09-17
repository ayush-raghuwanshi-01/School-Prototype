import { Suspense, lazy } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { AppProvider, useApp } from './state/store'
import { PublicPortal } from './components/portal/PublicPortal'
import { ToastHost } from './components/ui/ToastHost'
import { Skeleton, SkeletonChart, SkeletonStatGrid } from './components/ui/Skeleton'

/**
 * The management console (Recharts, tables, matrices) is code-split away from
 * the public portal so first paint on the marketing site stays light.
 */
const DashboardShell = lazy(() =>
  import('./components/dashboard/DashboardShell').then((m) => ({ default: m.DashboardShell })),
)

function ConsoleFallback() {
  return (
    <div className="min-h-screen bg-ink-50/70 dark:bg-ink-950">
      <div className="flex h-16 items-center gap-3 border-b border-ink-200/70 bg-white/80 px-4 dark:border-white/8 dark:bg-ink-950/80">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <Skeleton className="h-9 w-64 rounded-xl" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl space-y-5 p-5">
        <div className="flex items-center gap-2 text-[12.5px] font-semibold text-ink-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading Saraswati Vidhya Mandir console…
        </div>
        <SkeletonStatGrid />
        <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
          <SkeletonChart height="h-[340px]" />
          <SkeletonChart height="h-[340px]" bars={0} />
        </div>
      </div>
    </div>
  )
}

function Router() {
  const { route } = useApp()
  return (
    <>
      <AnimatePresence mode="wait">
        {route === 'portal' ? (
          <motion.div key="portal-route" exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28 }}>
            <PublicPortal />
          </motion.div>
        ) : (
          <motion.div key="dash-route" exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.28 }}>
            <Suspense fallback={<ConsoleFallback />}>
              <DashboardShell />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
      <ToastHost />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  )
}
