import { STATUS_CONFIG } from '../../lib/status'
import { cn } from '../../lib/utils'

export default function StatusBadge({ status, className }) {
  const config = STATUS_CONFIG[status]
  if (!config) return null
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap',
        config.badge,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  )
}
