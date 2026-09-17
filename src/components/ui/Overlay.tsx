import { useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { IconButton } from './Button'

const SPRING = { type: 'spring' as const, stiffness: 420, damping: 34, mass: 0.9 }

function useLockBody(open: boolean) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  useLockBody(open)

  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' }

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            className="absolute inset-0 bg-ink-950/55 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.975 }}
            transition={SPRING}
            className={cn(
              'relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-ink-200/80 bg-white shadow-2xl sm:rounded-3xl dark:border-white/10 dark:bg-ink-900',
              widths[size],
            )}
          >
            <div className="flex items-start justify-between gap-6 border-b border-ink-200/70 px-6 py-5 dark:border-white/8">
              <div className="min-w-0">
                <h2 className="text-[17px] font-bold tracking-[-0.015em] text-ink-900 dark:text-white">{title}</h2>
                {description ? (
                  <p className="mt-0.5 text-[13px] text-ink-500 dark:text-ink-400">{description}</p>
                ) : null}
              </div>
              <IconButton label="Close dialog" onClick={onClose}>
                <X className="h-4.5 w-4.5" />
              </IconButton>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer ? (
              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-ink-200/70 bg-ink-50/60 px-6 py-4 dark:border-white/8 dark:bg-white/[0.02]">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'max-w-xl',
  side = 'right',
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  width?: string
  side?: 'right' | 'left'
}) {
  useLockBody(open)

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[90]">
          <motion.div
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: side === 'right' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: side === 'right' ? '100%' : '-100%' }}
            transition={SPRING}
            className={cn(
              'absolute inset-y-0 flex w-full flex-col border-ink-200/80 bg-white dark:border-white/10 dark:bg-ink-900',
              side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
              width,
            )}
          >
            <div className="flex items-start justify-between gap-6 border-b border-ink-200/70 px-6 py-5 dark:border-white/8">
              <div className="min-w-0">
                <h2 className="text-[17px] font-bold tracking-[-0.015em] text-ink-900 dark:text-white">{title}</h2>
                {subtitle ? <p className="mt-0.5 text-[13px] text-ink-500 dark:text-ink-400">{subtitle}</p> : null}
              </div>
              <IconButton label="Close panel" onClick={onClose}>
                <X className="h-4.5 w-4.5" />
              </IconButton>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer ? (
              <div className="flex items-center justify-end gap-3 border-t border-ink-200/70 bg-ink-50/60 px-6 py-4 dark:border-white/8 dark:bg-white/[0.02]">
                {footer}
              </div>
            ) : null}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

/** Staggered children container used for view mounts and card grids. */
export function StaggerGroup({
  children,
  className,
  delay = 0,
  gap = 0.05,
}: {
  children: ReactNode
  className?: string
  delay?: number
  gap?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  )
}

export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
}

export const staggerItemScale = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
}

export function StaggerItem({
  children,
  className,
  variant = 'slide',
}: {
  children: ReactNode
  className?: string
  variant?: 'slide' | 'scale'
}) {
  return (
    <motion.div variants={variant === 'scale' ? staggerItemScale : staggerItem} className={className}>
      {children}
    </motion.div>
  )
}
