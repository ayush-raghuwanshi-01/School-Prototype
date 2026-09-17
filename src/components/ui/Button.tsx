import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg' | 'icon'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white shadow-[0_10px_30px_-12px_rgb(37_99_235_/_0.75)] hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-500',
  secondary: 'bg-ink-900 text-white hover:bg-ink-800 dark:bg-white dark:text-ink-900 dark:hover:bg-ink-100',
  ghost:
    'text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-white/10 dark:hover:text-white',
  outline:
    'border border-ink-200 bg-white text-ink-800 hover:border-ink-300 hover:bg-ink-50 dark:border-white/12 dark:bg-white/[0.04] dark:text-ink-100 dark:hover:bg-white/[0.08]',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-[0_10px_30px_-14px_rgb(225_29_72_/_0.8)]',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
}

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px] gap-1.5 rounded-xl',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-13 px-7 text-[15px] gap-2.5 rounded-2xl',
  icon: 'h-10 w-10 rounded-xl justify-center',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', loading, icon, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'press ring-focus relative inline-flex select-none items-center font-semibold tracking-[-0.01em] transition-all duration-200',
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
      {children}
    </button>
  )
})

export function IconButton({
  className,
  children,
  label,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        'press ring-focus inline-flex h-10 w-10 items-center justify-center rounded-xl text-ink-500 transition-all duration-200',
        'hover:bg-ink-100 hover:text-ink-900 active:bg-ink-200/70 dark:text-ink-400 dark:hover:bg-white/10 dark:hover:text-white',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
