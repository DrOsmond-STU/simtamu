import { cn, getAvatarColor, getInitials } from '../../lib/utils'

export default function Avatar({ name, size = 'md', className }) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
  }
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
        sizes[size],
        getAvatarColor(name),
        className,
      )}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  )
}
