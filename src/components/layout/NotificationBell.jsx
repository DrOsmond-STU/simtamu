import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CalendarCheck, UserPlus } from 'lucide-react'
import { useKunjungan } from '../../context/KunjunganContext'
import { cn } from '../../lib/utils'

function relativeTime(date) {
  const diffMs = Date.now() - new Date(date).getTime()
  const menit = Math.round(diffMs / 60000)
  if (menit < 1) return 'baru saja'
  if (menit < 60) return `${menit} menit lalu`
  const jam = Math.round(menit / 60)
  if (jam < 24) return `${jam} jam lalu`
  return `${Math.round(jam / 24)} hari lalu`
}

export default function NotificationBell() {
  const { notifikasi, tandaiNotifikasiTerbaca } = useKunjungan()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  const untukPejabat = notifikasi.filter((n) => n.target === 'pejabat')
  const belumDibaca = untukPejabat.filter((n) => !n.dibaca).length

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Menandai notifikasi terbaca sebagai efek dari panel terbuka, bukan di
  // dalam updater setOpen — memanggil setState context lain di sana melanggar
  // aturan render React ("Cannot update a component while rendering a
  // different component").
  useEffect(() => {
    if (open) tandaiNotifikasiTerbaca()
  }, [open, tandaiNotifikasiTerbaca])

  function toggle() {
    setOpen((prev) => !prev)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggle}
        className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
        aria-label="Notifikasi"
      >
        <Bell className="h-5 w-5" />
        {belumDibaca > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white ring-2 ring-white">
            {belumDibaca}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">Notifikasi</p>
            <p className="text-xs text-slate-400">Pemberitahuan untuk pejabat/unit tujuan</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {untukPejabat.length === 0 && (
              <p className="px-4 py-6 text-center text-xs text-slate-400">Belum ada notifikasi.</p>
            )}
            {untukPejabat.slice(0, 8).map((n) => {
              const Icon = n.jenis === 'checkin' ? CalendarCheck : UserPlus
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    navigate(`/petugas/kunjungan/${n.kunjunganId}`)
                  }}
                  className={cn(
                    'flex w-full items-start gap-3 border-b border-slate-50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-slate-50',
                  )}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-relaxed text-slate-700">
                      <span className="font-medium text-slate-900">{n.targetNama}</span> &middot; {n.pesan}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">{relativeTime(n.waktu)}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
