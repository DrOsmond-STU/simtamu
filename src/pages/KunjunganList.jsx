import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plus, Search, SlidersHorizontal, Users2 } from 'lucide-react'
import { PEJABAT, SUMBER } from '../lib/dummyData'
import { useKunjungan } from '../context/KunjunganContext'
import { STATUS_CONFIG, STATUS_ORDER } from '../lib/status'
import { cn, formatDate, formatTime } from '../lib/utils'
import StatusBadge from '../components/ui/StatusBadge'
import Avatar from '../components/ui/Avatar'
import EmptyState from '../components/ui/EmptyState'

const PAGE_SIZE = 8

export default function KunjunganList() {
  const { data: KUNJUNGAN } = useKunjungan()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialStatus = searchParams.get('status') || 'semua'

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState(initialStatus)
  const [unit, setUnit] = useState('semua')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return KUNJUNGAN.filter((k) => {
      const matchQuery =
        !q ||
        k.nama.toLowerCase().includes(q) ||
        k.instansi.toLowerCase().includes(q) ||
        k.id.toLowerCase().includes(q)
      const matchStatus = status === 'semua' || k.status === status
      const matchUnit = unit === 'semua' || k.pejabat.id === unit
      return matchQuery && matchStatus && matchUnit
    }).sort((a, b) => b.mulai - a.mulai)
  }, [KUNJUNGAN, query, status, unit])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function updateStatus(value) {
    setStatus(value)
    setPage(1)
    const next = new URLSearchParams(searchParams)
    if (value === 'semua') next.delete('status')
    else next.set('status', value)
    setSearchParams(next, { replace: true })
  }

  const statusChips = [
    { key: 'semua', label: 'Semua', count: KUNJUNGAN.length },
    ...STATUS_ORDER.map((key) => ({
      key,
      label: STATUS_CONFIG[key].label,
      count: KUNJUNGAN.filter((k) => k.status === key).length,
    })),
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Daftar Kunjungan</h2>
          <p className="text-sm text-slate-500">{filtered.length} kunjungan ditemukan</p>
        </div>
        <Link
          to="/kunjungan/baru"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Daftarkan Kunjungan
        </Link>
      </div>

      <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
        {statusChips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => updateStatus(chip.key)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
              status === chip.key
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
            )}
          >
            {chip.label}
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                status === chip.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500',
              )}
            >
              {chip.count}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Cari nama tamu, instansi, atau kode kunjungan..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400" />
          <select
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 sm:w-56"
          >
            <option value="semua">Semua Unit Tujuan</option>
            {PEJABAT.map((p) => (
              <option key={p.id} value={p.id}>
                {p.unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {paged.length === 0 ? (
          <EmptyState
            icon={Users2}
            title="Tidak ada kunjungan yang cocok"
            description="Coba ubah kata kunci pencarian atau filter status/unit yang dipilih."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-5 py-3 font-medium">Tamu</th>
                  <th className="px-5 py-3 font-medium">Tujuan Kunjungan</th>
                  <th className="px-5 py-3 font-medium">Pejabat Dituju</th>
                  <th className="px-5 py-3 font-medium">Jadwal</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paged.map((k) => (
                  <tr key={k.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={k.nama} size="sm" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate font-medium text-slate-800">{k.nama}</p>
                            {k.sumber === SUMBER.MANDIRI && (
                              <span
                                title="Pengajuan mandiri via Portal Tamu"
                                className="inline-flex shrink-0 items-center rounded-full bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-600 ring-1 ring-inset ring-violet-200"
                              >
                                Mandiri
                              </span>
                            )}
                          </div>
                          <p className="truncate text-xs text-slate-400">{k.instansi}</p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[220px] px-5 py-3.5 text-slate-600">
                      <p className="truncate">{k.tujuan}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <p className="truncate">{k.pejabat.nama.split(',')[0]}</p>
                      <p className="truncate text-xs text-slate-400">{k.pejabat.unit}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <p>{formatDate(k.mulai)}</p>
                      <p className="text-xs text-slate-400">{formatTime(k.mulai)} WIB</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={k.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to={`/kunjungan/${k.id}`}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        Lihat Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-3.5 sm:flex-row">
            <p className="text-xs text-slate-500">
              Menampilkan {(currentPage - 1) * PAGE_SIZE + 1}
              &ndash;{Math.min(currentPage * PAGE_SIZE, filtered.length)} dari {filtered.length} data
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 text-xs font-medium text-slate-600">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
