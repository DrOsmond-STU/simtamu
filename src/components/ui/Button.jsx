import { cn } from '../../lib/utils'

const VARIANTS = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-600 shadow-sm',
  secondary:
    'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:outline-blue-600',
  ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:outline-blue-600',
  danger: 'bg-white text-rose-600 ring-1 ring-inset ring-rose-200 hover:bg-rose-50 focus-visible:outline-rose-600',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-emerald-600 shadow-sm',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
}

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
