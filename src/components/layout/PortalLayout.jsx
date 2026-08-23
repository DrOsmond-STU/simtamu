import { Link, Outlet } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

export default function PortalLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-brand-50 via-slate-50 to-slate-50">
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              ST
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-900">SIMTAMU</p>
              <p className="text-xs text-slate-400">Portal Tamu</p>
            </div>
          </Link>
          <Link
            to="/petugas"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Masuk sebagai Petugas</span>
            <span className="sm:hidden">Petugas</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200/70 py-6 text-center text-xs text-slate-400">
        &copy; 2026 SIMTAMU &mdash; Sistem Informasi Manajemen Tamu
      </footer>
    </div>
  )
}
