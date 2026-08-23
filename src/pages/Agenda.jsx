import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useKunjungan } from '../context/KunjunganContext'
import { STATUS_CONFIG, STATUS_ORDER } from '../lib/status'
import { addDays, cn, formatDateWeekday, formatTime, isSameDay, toDateKey } from '../lib/utils'
import StatusBadge from '../components/ui/StatusBadge'
import Avatar from '../components/ui/Avatar'
import EmptyState from '../components/ui/EmptyState'

const WEEKDAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

const monthYearFormatter = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' })

const today = new Date()
today.setHours(0, 0, 0, 0)

function getMonthMatrix(cursor) {
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const offset = (firstOfMonth.getDay() + 6) % 7 // minggu dimulai Senin
  const start = addDays(firstOfMonth, -offset)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7
  return Array.from({ length: totalCells }, (_, i) => addDays(start, i))
}

export default function Agenda() {
  const { data: KUNJUNGAN } = useKunjungan()
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(today)

  const matrix = useMemo(() => getMonthMatrix(cursor), [cursor])

  const eventsByDay = useMemo(() => {
    const map = new Map()
    for (const k of KUNJUNGAN) {
      const key = toDateKey(k.mulai)
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(k)
    }
    for (const list of map.values()) list.sort((a, b) => a.mulai - b.mulai)
    return map
  }, [KUNJUNGAN])

  const selectedEvents = eventsByDay.get(toDateKey(selectedDate)) || []

  function goToMonth(delta) {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1))
  }

  function goToday() {
    const now = new Date(today)
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1))
    setSelectedDate(now)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Agenda Kunjungan</h2>
          <p className="text-sm text-slate-500">Lihat jadwal kunjungan dalam tampilan kalender bulanan</p>
        </div>
        <Link
          to={`/kunjungan/baru?tanggal=${toDateKey(selectedDate)}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Daftarkan Kunjungan
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold capitalize text-slate-900">
              {monthYearFormatter.format(cursor)}
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={goToday}
                className="rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={() => goToMonth(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
                aria-label="Bulan sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => goToMonth(1)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
                aria-label="Bulan berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400">
            {WEEKDAY_LABELS.map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {matrix.map((day) => {
              const inMonth = day.getMonth() === cursor.getMonth()
              const events = eventsByDay.get(toDateKey(day)) || []
              const isToday = isSameDay(day, today)
              const isSelected = isSameDay(day, selectedDate)
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    'flex min-h-[84px] flex-col items-start gap-1 rounded-lg border p-1.5 text-left transition-colors sm:min-h-[96px] sm:p-2',
                    isSelected
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-transparent hover:border-slate-200 hover:bg-slate-50',
                    !inMonth && 'opacity-40',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                      isToday ? 'bg-blue-600 text-white' : 'text-slate-600',
                    )}
                  >
                    {day.getDate()}
                  </span>
                  <div className="flex w-full flex-col gap-0.5">
                    {events.slice(0, 2).map((ev) => (
                      <span
                        key={ev.id}
                        className={cn(
                          'truncate rounded px-1 py-0.5 text-[10px] font-medium text-white',
                          STATUS_CONFIG[ev.status].bar,
                        )}
                        title={`${formatTime(ev.mulai)} — ${ev.nama}`}
                      >
                        {formatTime(ev.mulai)} {ev.nama}
                      </span>
                    ))}
                    {events.length > 2 && (
                      <span className="text-[10px] font-medium text-slate-400">
                        +{events.length - 2} lainnya
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-slate-100 pt-4">
            {STATUS_ORDER.map((s) => (
              <span key={s} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className={cn('h-2 w-2 rounded-full', STATUS_CONFIG[s].dot)} />
                {STATUS_CONFIG[s].label}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {isSameDay(selectedDate, today) ? 'Hari Ini' : 'Tanggal Terpilih'}
            </p>
            <h3 className="text-sm font-semibold capitalize text-slate-900">
              {formatDateWeekday(selectedDate)}
            </h3>
          </div>
          <div className="max-h-[520px] divide-y divide-slate-100 overflow-y-auto">
            {selectedEvents.length === 0 && (
              <div className="p-5">
                <EmptyState
                  icon={CalendarDays}
                  title="Belum ada kunjungan"
                  description="Tidak ada kunjungan terjadwal pada tanggal ini."
                  action={
                    <Link
                      to={`/kunjungan/baru?tanggal=${toDateKey(selectedDate)}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      + Daftarkan kunjungan pada tanggal ini
                    </Link>
                  }
                />
              </div>
            )}
            {selectedEvents.map((ev) => (
              <Link
                key={ev.id}
                to={`/kunjungan/${ev.id}`}
                className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
              >
                <Avatar name={ev.nama} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{ev.nama}</p>
                  <p className="truncate text-xs text-slate-400">{ev.instansi}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatTime(ev.mulai)}–{formatTime(ev.selesai)} WIB &middot; {ev.lokasi}
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={ev.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
