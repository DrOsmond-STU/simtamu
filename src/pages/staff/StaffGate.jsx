import { useNavigate } from 'react-router-dom'
import { CalendarCheck, FileCheck2, Info, ShieldCheck, Users2 } from 'lucide-react'
import Button from '../../components/ui/Button'

const FITUR = [
  { icon: Users2, label: 'Kelola pendaftaran & jadwal kunjungan' },
  { icon: FileCheck2, label: 'Verifikasi surat kunjungan tamu' },
  { icon: CalendarCheck, label: 'Notifikasi otomatis ke tamu & pejabat' },
]

export default function StaffGate() {
  const navigate = useNavigate()

  function masuk(e) {
    e.preventDefault()
    navigate('/petugas/dashboard')
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-center overflow-hidden bg-gradient-to-br from-[#101a2e] via-[#16223b] to-brand-700 px-12 py-16 text-white lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(circle at 22% 30%, rgba(53,99,233,.45) 0%, transparent 55%), radial-gradient(circle at 78% 75%, rgba(139,92,246,.25) 0%, transparent 50%)',
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-base font-bold backdrop-blur">
              ST
            </span>
            <div className="leading-tight">
              <p className="text-base font-semibold">SIMTAMU</p>
              <p className="text-xs text-white/60">Panel Petugas</p>
            </div>
          </div>

          <h1 className="mt-12 max-w-md text-3xl font-semibold leading-tight text-balance">
            Kelola setiap kunjungan tamu dari satu tempat.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Tinjau pengajuan, verifikasi surat kunjungan, dan pastikan setiap tamu maupun
            pejabat yang dituju selalu mendapat kabar terbaru.
          </p>

          <div className="mt-10 space-y-4">
            {FITUR.map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <f.icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <span className="text-sm text-white/85">{f.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-14 flex items-center gap-2 text-xs text-white/45">
            <ShieldCheck className="h-3.5 w-3.5" />
            Khusus untuk petugas front office yang berwenang
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-canvas px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
              ST
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-900">SIMTAMU</p>
              <p className="text-xs text-slate-400">Panel Petugas</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-slate-900">Masuk ke akun Anda</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Gunakan akun petugas untuk membuka panel manajemen kunjungan.
          </p>

          <form onSubmit={masuk} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email / NIP
              </label>
              <input
                id="email"
                type="text"
                defaultValue="resepsionis@simtamu.semestateknologiutama.com"
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Kata Sandi
              </label>
              <input
                id="password"
                type="password"
                defaultValue="demo1234"
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Masuk
            </Button>
          </form>

          <div className="mt-6 flex gap-2.5 rounded-lg bg-brand-50 px-3.5 py-3 text-xs leading-relaxed text-brand-700">
            <Info className="h-4 w-4 shrink-0" />
            <p>
              <span className="font-semibold">Purwarupa UI/UX.</span> Data pada aplikasi ini
              contoh/fiktif dan autentikasi tidak diproses — klik <b>Masuk</b> untuk langsung
              menjelajahi panel petugas.
            </p>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400">
            SIMTAMU v1.0 — Purwarupa &middot; PT Semesta Teknologi Utama
          </p>
        </div>
      </div>
    </div>
  )
}
