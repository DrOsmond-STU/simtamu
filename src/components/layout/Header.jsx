import { useLocation } from 'react-router-dom'
import { Bell, Menu, Search } from 'lucide-react'

function getPageMeta(pathname) {
  if (pathname === '/') return { title: 'Dashboard', subtitle: 'Ringkasan aktivitas kunjungan tamu' }
  if (pathname === '/kunjungan') return { title: 'Kunjungan', subtitle: 'Kelola pendaftaran dan status kunjungan tamu' }
  if (pathname === '/kunjungan/baru') return { title: 'Daftarkan Kunjungan', subtitle: 'Formulir pendaftaran kunjungan baru' }
  if (pathname.endsWith('/edit')) return { title: 'Ubah Kunjungan', subtitle: 'Perbarui data kunjungan tamu' }
  if (pathname.startsWith('/kunjungan/')) return { title: 'Detail Kunjungan', subtitle: 'Informasi lengkap kunjungan tamu' }
  if (pathname === '/agenda') return { title: 'Agenda', subtitle: 'Jadwal kunjungan dalam tampilan kalender' }
  return { title: 'SIMTAMU', subtitle: '' }
}

export default function Header({ onOpenSidebar }) {
  const location = useLocation()
  const meta = getPageMeta(location.pathname)

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="Buka menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold text-slate-900">{meta.title}</h1>
        {meta.subtitle && (
          <p className="hidden truncate text-xs text-slate-400 sm:block">{meta.subtitle}</p>
        )}
      </div>

      <div className="relative hidden w-full max-w-xs md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari nama tamu, instansi, kode..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <button
        type="button"
        className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
        aria-label="Notifikasi"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
      </button>

      <div className="hidden items-center gap-2.5 border-l border-slate-200 pl-4 sm:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
          RS
        </span>
        <div className="leading-tight">
          <p className="text-sm font-medium text-slate-800">Resepsionis</p>
          <p className="text-xs text-slate-400">Petugas Front Office</p>
        </div>
      </div>
    </header>
  )
}
