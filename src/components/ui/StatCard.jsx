import { cn } from '../../lib/utils'

export default function StatCard({ label, value, icon: Icon, tone = 'blue', trend }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold text-slate-900">{value}</p>
        </div>
        {Icon && (
          <span className={cn('flex h-10 w-10 items-center justify-center rounded-lg', tones[tone])}>
            <Icon className="h-5 w-5" strokeWidth={2} />
          </span>
        )}
      </div>
      {trend && (
        <p
          className={cn(
            'mt-3 flex items-center gap-1 text-xs font-medium',
            trend.direction === 'up' ? 'text-emerald-600' : 'text-slate-500',
          )}
        >
          {trend.label}
        </p>
      )}
    </div>
  )
}
