import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export default function Stepper({ steps, current }) {
  return (
    <ol className="flex items-start">
      {steps.map((label, idx) => {
        const stepNum = idx + 1
        const state = stepNum < current ? 'done' : stepNum === current ? 'current' : 'upcoming'
        const isLast = idx === steps.length - 1
        return (
          <li key={label} className={cn('flex items-center', !isLast && 'flex-1')}>
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                  state === 'done' && 'bg-brand-600 text-white',
                  state === 'current' && 'bg-brand-600 text-white ring-4 ring-brand-100',
                  state === 'upcoming' && 'bg-slate-100 text-slate-400',
                )}
              >
                {state === 'done' ? <Check className="h-4 w-4" /> : stepNum}
              </span>
              <span
                className={cn(
                  'hidden max-w-[6.5rem] text-center text-xs font-medium sm:block',
                  state === 'upcoming' ? 'text-slate-400' : 'text-slate-700',
                )}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <span
                className={cn(
                  'mx-2 h-0.5 flex-1 translate-y-[-14px] transition-colors sm:translate-y-0',
                  state === 'done' ? 'bg-brand-600' : 'bg-slate-200',
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
