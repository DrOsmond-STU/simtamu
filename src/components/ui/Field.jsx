import { cn } from '../../lib/utils'

export const inputClass = cn(
  'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700',
  'placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100',
)

export const inputErrorClass = 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'

export default function Field({ label, htmlFor, error, required, hint, children, className }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  )
}
