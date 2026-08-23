import { useMemo, useState } from 'react'
import { CalendarRange } from 'lucide-react'
import { useKunjungan } from '../../context/KunjunganContext'
import { STATUS, STATUS_CONFIG } from '../../lib/status'
import { addDays, cn, formatTime, toDateKey } from '../../lib/utils'

// Status yang dianggap benar-benar bagian dari kepadatan agenda hari itu.
// Ditolak/dibatalkan tidak dihitung karena slotnya sudah tidak terpakai.
const STATUS_AKTIF = [STATUS.MENUNGGU, STATUS.DISETUJUI, STATUS.BERLANGSUNG, STATUS.SELESAI]

const HARI_LABEL = new Intl.DateTimeFormat('id-ID', { weekday: 'short' })
const TANGGAL_LABEL = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' })

function densityLevel(count) {
  if (count === 0) return { label: 'Kosong', dot: 'bg-slate-300', text: 'text-slate-400' }
  if (count <= 2) return { label: 'Lengang', dot: 'bg-green-500', text: 'text-green-700' }
  if (count <= 4) return { label: 'Sedang', dot: 'bg-amber-500', text: 'text-amber-700' }
  return { label: 'Padat', dot: 'bg-red-500', text: 'text-red-700' }
}

// Agenda kegiatan lintas-unit yang tampil di beranda publik, SEBELUM tamu
// mulai mengisi formulir — memberi gambaran kepadatan secara global (semua
// pejabat/unit sekaligus) agar tamu bisa memperkirakan waktu yang lebih
// lengang sebelum memutuskan tanggal kunjungan. Sengaja tidak menyebutkan
// nama tamu maupun pejabat yang terlibat — hanya jam, lokasi, dan status.
export default function AgendaKegiatan() {
  const { data } = useKunjungan()

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(today, i)), [today])
  const [selected, setSelected] = useState(1) // default: besok, tanggal terdekat yang bisa diajukan

  const byDay = useMemo(
    () =>
      days.map((day) => {
        const key = toDateKey(day)
        const items = data
          .filter((k) => toDateKey(k.mulai) === key && STATUS_AKTIF.includes(k.status))
          .sort((a, b) => a.mulai - b.mulai)
        return { day, key, items }
      }),
    [days, data],
  )

  const activeDay = byDay[selected]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <CalendarRange className="h-4 w-4 text-brand-600" />
        <h3 className="text-sm font-semibold text-slate-900">Agenda Kegiatan</h3>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        Gambaran kepadatan kunjungan di seluruh unit selama 7 hari ke depan, agar Anda dapat
        memperkirakan waktu yang lebih lengang sebelum mengajukan. Demi menjaga privasi, agenda
        ini tidak menampilkan nama tamu maupun pejabat yang terlibat.
      </p>

      <div className="scrollbar-thin mt-4 flex gap-2 overflow-x-auto pb-1">
        {byDay.map((d, i) => {
          const dens = densityLevel(d.items.length)
          const active = i === selected
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => setSelected(i)}
              className={cn(
                'flex shrink-0 flex-col items-center gap-1 rounded-lg border px-3 py-2 text-xs transition-colors',
                active ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:bg-slate-50',
              )}
            >
              <span className={cn('font-medium', active ? 'text-brand-700' : 'text-slate-600')}>
                {i === 0 ? 'Hari ini' : HARI_LABEL.format(d.day)}
              </span>
              <span className="text-slate-400">{TANGGAL_LABEL.format(d.day)}</span>
              <span className={cn('flex items-center gap-1 text-[11px]', dens.text)}>
                <span className={cn('h-1.5 w-1.5 rounded-full', dens.dot)} />
                {dens.label}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-4">
        {activeDay.items.length === 0 ? (
          <p className="text-sm text-green-700">
            Tidak ada kegiatan terjadwal pada tanggal ini &mdash; jadwal lengang sepanjang hari.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {activeDay.items.map((k) => (
              <li
                key={k.id}
                className="flex items-center gap-2.5 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600"
              >
                <span className="font-medium text-slate-700">
                  {formatTime(k.mulai)}&ndash;{formatTime(k.selesai)}
                </span>
                <span className="text-slate-300">&middot;</span>
                <span className="truncate">{k.lokasi}</span>
                <span
                  className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    backgroundColor: `${STATUS_CONFIG[k.status].hex}1a`,
                    color: STATUS_CONFIG[k.status].hex,
                  }}
                >
                  {STATUS_CONFIG[k.status].label}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
