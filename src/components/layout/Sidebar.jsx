import { NavLink } from 'react-router-dom'
import { CalendarDays, LayoutDashboard, Users2, X } from 'lucide-react'
import { cn } from '../../lib/utils'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/kunjungan', label: 'Kunjungan', icon: Users2 },
  { to: '/agenda', label: 'Agenda', icon: CalendarDays },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              ST
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-900">SIMTAMU</p>
              <p className="text-xs text-slate-400">Manajemen Tamu</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu Utama
          </p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )
              }
            >
              <item.icon className="h-[18px] w-[18px]" strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
              RS
            </span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium text-slate-800">Resepsionis</p>
              <p className="truncate text-xs text-slate-400">Petugas Front Office</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
