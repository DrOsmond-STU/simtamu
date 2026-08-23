import { Check } from 'lucide-react'
import { STATUS, STATUS_CONFIG } from '../../lib/status'
import { cn } from '../../lib/utils'

const FLOW = [STATUS.MENUNGGU, STATUS.DISETUJUI, STATUS.BERLANGSUNG, STATUS.SELESAI]

export function buildTimeline(status) {
  if (status === STATUS.DITOLAK) {
    return [
      { key: STATUS.MENUNGGU, state: 'done' },
      { key: STATUS.DITOLAK, state: 'current' },
    ]
  }
  if (status === STATUS.DIBATALKAN) {
    return [
      { key: STATUS.MENUNGGU, state: 'done' },
      { key: STATUS.DIBATALKAN, state: 'current' },
    ]
  }
  const idx = FLOW.indexOf(status)
  return FLOW.map((key, i) => ({
    key,
    state: i < idx ? 'done' : i === idx ? 'current' : 'upcoming',
  }))
}

export default function StatusTimeline({ status }) {
  const timeline = buildTimeline(status)

  return (
    <ol className="space-y-0">
      {timeline.map((step, idx) => {
        const config = STATUS_CONFIG[step.key]
        const isLast = idx === timeline.length - 1
        return (
          <li key={step.key} className="relative flex gap-3 pb-6 last:pb-0">
            {!isLast && (
              <span
                className={cn(
                  'absolute left-[11px] top-6 h-full w-px',
                  step.state === 'done' ? 'bg-emerald-300' : 'bg-slate-200',
                )}
              />
            )}
            <span
              className={cn(
                'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                step.state === 'done' && 'bg-emerald-500 text-white',
                step.state === 'current' && `${config.dot} text-white ring-4 ring-slate-100`,
                step.state === 'upcoming' && 'bg-white text-slate-300 ring-2 ring-slate-200',
              )}
            >
              {step.state === 'done' ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              )}
            </span>
            <div className="pt-0.5">
              <p
                className={cn(
                  'text-sm font-medium',
                  step.state === 'upcoming' ? 'text-slate-400' : 'text-slate-800',
                )}
              >
                {config.label}
              </p>
              {step.state === 'current' && <p className="text-xs text-slate-400">Status saat ini</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
