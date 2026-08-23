import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useKunjungan } from '../../context/KunjunganContext'
import { STATUS, STATUS_CONFIG } from '../../lib/status'
import { addDays, cn, formatDateWeekday, formatTime, hashSeed, toDateKey } from '../../lib/utils'

// Status yang dianggap benar-benar bagian dari kepadatan agenda hari itu.
// Ditolak/dibatalkan tidak dihitung karena slotnya sudah tidak terpakai.
const STATUS_AKTIF = [STATUS.MENUNGGU, STATUS.DISETUJUI, STATUS.BERLANGSUNG, STATUS.SELESAI]

const HARI_HEADER = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const BULAN_TAHUN = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' })

// Warna blok per unit/bagian — konsisten untuk unit yang sama di seluruh
// kalender, dipilih otomatis dari nama unit (bukan warna acak per render).
const UNIT_PALETTE = [
  '#2563eb', // biru
  '#0d9488', // teal
  '#16a34a', // hijau
  '#d97706', // amber
  '#dc2626', // merah
  '#7c3aed', // ungu
  '#0891b2', // sian
  '#475569', // slate
]
function unitColor(unit) {
  return UNIT_PALETTE[hashSeed(unit) % UNIT_PALETTE.length]
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

// Grid kalender selalu berupa kelipatan minggu penuh (mulai hari Minggu)
// yang mencakup seluruh tanggal pada bulan yang ditampilkan.
function buildGridDays(monthDate) {
  const first = startOfMonth(monthDate)
  const start = addDays(first, -first.getDay())
  const lastOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
  const totalWeeks = Math.ceil((Math.round((lastOfMonth - start) / 86400000) + 1) / 7)
  return Array.from({ length: totalWeeks * 7 }, (_, i) => addDays(start, i))
}

// Kalender agenda kegiatan lintas-unit yang tampil di beranda publik,
// SEBELUM tamu mulai mengisi formulir — memberi gambaran kepadatan secara
// global (dikelompokkan per unit/bagian, bukan per orang) agar tamu dapat
// memperkirakan waktu yang lebih lengang sebelum memutuskan tanggal
// kunjungan. Sengaja tidak menyebutkan nama tamu maupun pejabat yang
// terlibat — hanya unit, jumlah kunjungan, jam, lokasi, dan status.
export default function AgendaKegiatan() {
  const { data } = useKunjungan()

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])
  const [viewDate, setViewDate] = useState(today)
  const [selected, setSelected] = useState(today)

  const gridDays = useMemo(() => buildGridDays(viewDate), [viewDate])
  const currentMonth = viewDate.getMonth()

  // Kelompokkan kunjungan aktif per tanggal, lalu per unit pejabat yang dituju.
  const perTanggal = useMemo(() => {
    const map = new Map()
    for (const k of data) {
      if (!STATUS_AKTIF.includes(k.status)) continue
      const key = toDateKey(k.mulai)
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(k)
    }
    return map
  }, [data])

  function unitGroups(dateKey) {
    const items = perTanggal.get(dateKey) || []
    const byUnit = new Map()
    for (const k of items) {
      const unit = k.pejabat.unit
      byUnit.set(unit, (byUnit.get(unit) || 0) + 1)
    }
    return Array.from(byUnit, ([unit, jumlah]) => ({ unit, jumlah }))
  }

  const selectedKey = toDateKey(selected)
  const selectedDalamBulanIni = selected.getMonth() === currentMonth && selected.getFullYear() === viewDate.getFullYear()
  const selectedItems = selectedDalamBulanIni
    ? (perTanggal.get(selectedKey) || []).slice().sort((a, b) => a.mulai - b.mulai)
    : []

  function gotoMonth(delta) {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1))
  }
  function gotoToday() {
    setViewDate(today)
    setSelected(today)
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Agenda Kegiatan</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Gambaran kepadatan kunjungan per unit di seluruh instansi, agar Anda dapat
          memperkirakan waktu yang lebih lengang sebelum mengajukan. Demi menjaga privasi,
          agenda ini tidak menampilkan nama tamu maupun pejabat yang terlibat.
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => gotoMonth(-1)}
            aria-label="Bulan sebelumnya"
            className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => gotoMonth(1)}
            aria-label="Bulan berikutnya"
            className="rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={gotoToday}
            className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Hari ini
          </button>
        </div>
        <p className="text-sm font-semibold capitalize text-slate-800">
          {BULAN_TAHUN.format(viewDate)}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 text-center">
        {HARI_HEADER.map((h) => (
          <div key={h} className="bg-slate-50 py-1.5 text-[11px] font-semibold text-slate-500">
            {h}
          </div>
        ))}
        {gridDays.map((day) => {
          const key = toDateKey(day)
          const groups = unitGroups(key)
          const luarBulan = day.getMonth() !== currentMonth
          const isToday = key === toDateKey(today)
          const isSelected = key === selectedKey
          const visible = groups.slice(0, 2)
          const sisa = groups.length - visible.length

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(day)}
              className={cn(
                'flex min-h-[76px] flex-col items-stretch gap-0.5 bg-white p-1 text-left align-top transition-colors sm:min-h-[92px] sm:p-1.5',
                luarBulan && 'bg-slate-50/60',
                isSelected && 'ring-2 ring-inset ring-brand-500',
              )}
            >
              <span
                className={cn(
                  'self-start rounded-full px-1.5 text-[11px] font-medium',
                  luarBulan ? 'text-slate-300' : 'text-slate-600',
                  isToday && 'bg-brand-600 text-white',
                )}
              >
                {day.getDate()}
              </span>
              <div className="space-y-0.5">
                {visible.map((g) => (
                  <div
                    key={g.unit}
                    className="truncate rounded px-1 py-0.5 text-[9.5px] font-medium leading-tight text-white sm:text-[10px]"
                    style={{ backgroundColor: unitColor(g.unit) }}
                    title={`${g.unit} — ${g.jumlah} kunjungan`}
                  >
                    {g.unit} &middot; {g.jumlah}
                  </div>
                ))}
                {sisa > 0 && <div className="px-1 text-[9.5px] text-slate-400">+{sisa} lainnya</div>}
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        {selectedDalamBulanIni ? (
          <p className="text-xs font-semibold text-slate-700">{formatDateWeekday(selected)}</p>
        ) : (
          <p className="text-xs font-semibold text-slate-700">Pilih tanggal</p>
        )}
        {!selectedDalamBulanIni ? (
          <p className="mt-2 text-sm text-slate-500">
            Klik salah satu tanggal pada kalender di atas untuk melihat detail kegiatan.
          </p>
        ) : selectedItems.length === 0 ? (
          <p className="mt-2 text-sm text-green-700">
            Tidak ada kegiatan terjadwal pada tanggal ini &mdash; jadwal lengang sepanjang hari.
          </p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {selectedItems.map((k) => (
              <li
                key={k.id}
                className="flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600"
              >
                <span className="font-medium text-slate-700">
                  {formatTime(k.mulai)}&ndash;{formatTime(k.selesai)}
                </span>
                <span className="text-slate-300">&middot;</span>
                <span
                  className="rounded px-1.5 py-0.5 text-[11px] font-medium text-white"
                  style={{ backgroundColor: unitColor(k.pejabat.unit) }}
                >
                  {k.pejabat.unit}
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
