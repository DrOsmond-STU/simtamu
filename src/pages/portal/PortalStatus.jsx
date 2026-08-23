import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BellRing, Search } from 'lucide-react'
import { useKunjungan } from '../../context/KunjunganContext'
import { STATUS } from '../../lib/status'
import { formatDate, formatTime } from '../../lib/utils'
import StatusBadge from '../../components/ui/StatusBadge'
import StatusTimeline from '../../components/kunjungan/StatusTimeline'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'

function normalizePhone(value) {
  return value.replace(/\D/g, '')
}

export default function PortalStatus() {
  const [searchParams] = useSearchParams()
  const { data, notifikasi } = useKunjungan()
  const [query, setQuery] = useState(searchParams.get('kode') || '')
  const [results, setResults] = useState(null)

  function runSearch(value) {
    const q = value.trim()
    if (!q) {
      setResults([])
      return
    }
    const qLower = q.toLowerCase()
    const qPhone = normalizePhone(q)
    const matches = data.filter((k) => {
      if (k.id.toLowerCase() === qLower) return true
      if (qPhone.length >= 8 && normalizePhone(k.telepon).includes(qPhone)) return true
      return false
    })
    setResults(matches.sort((a, b) => b.dibuatPada - a.dibuatPada))
  }

  useEffect(() => {
    const prefill = searchParams.get('kode')
    if (prefill) runSearch(prefill)
    // Hanya dijalankan sekali saat halaman dibuka dengan parameter ?kode=
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    runSearch(query)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-slate-900">Cek Status Pengajuan</h1>
        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
          Masukkan kode pengajuan (cth. KJG-2026-0032) atau nomor telepon yang Anda daftarkan
          saat mengajukan kunjungan.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto flex max-w-lg gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Kode pengajuan atau nomor telepon"
          className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <Button type="submit" variant="primary">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Cari</span>
        </Button>
      </form>

      {results !== null && results.length === 0 && (
        <EmptyState
          icon={Search}
          title="Pengajuan tidak ditemukan"
          description="Periksa kembali kode pengajuan atau nomor telepon yang Anda masukkan."
        />
      )}

      {results !== null && results.length > 0 && (
        <div className="space-y-4">
          {results.map((record) => (
            <div
              key={record.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium tracking-wide text-slate-400">{record.id}</p>
                  <h2 className="text-base font-semibold text-slate-900">{record.nama}</h2>
                  <p className="text-sm text-slate-500">{record.instansi}</p>
                </div>
                <StatusBadge status={record.status} />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-400">Tujuan Kunjungan</p>
                  <p className="font-medium text-slate-700">{record.tujuan}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Pejabat / Unit Dituju</p>
                  <p className="font-medium text-slate-700">{record.pejabat.nama}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Jadwal Diajukan</p>
                  <p className="font-medium text-slate-700">
                    {formatDate(record.mulai)}, {formatTime(record.mulai)}–{formatTime(record.selesai)} WIB
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Surat Kunjungan</p>
                  <p className="font-medium text-slate-700">
                    {record.suratKunjungan ? record.suratKunjungan.name : '—'}
                  </p>
                </div>
              </div>

              {record.catatanPetugas && [STATUS.DITOLAK, STATUS.DIBATALKAN].includes(record.status) && (
                <p className="mt-3 rounded-lg bg-red-50 px-3.5 py-3 text-xs text-red-700">
                  <span className="font-semibold">Catatan petugas:</span> {record.catatanPetugas}
                </p>
              )}

              <div className="mt-5 border-t border-slate-100 pt-5">
                <StatusTimeline status={record.status} />
              </div>

              {(() => {
                const punya = notifikasi.filter(
                  (n) => n.kunjunganId === record.id && n.target === 'tamu',
                )
                if (punya.length === 0) return null
                return (
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <h3 className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      <BellRing className="h-3.5 w-3.5" />
                      Notifikasi untuk Anda
                    </h3>
                    <ul className="space-y-2">
                      {punya.map((n) => (
                        <li key={n.id} className="text-xs text-slate-600">
                          {n.pesan}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })()}
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-sm text-slate-400">
        Belum pernah mengajukan?{' '}
        <Link to="/ajukan" className="font-medium text-brand-600 hover:text-brand-700">
          Ajukan kunjungan baru
        </Link>
      </p>
    </div>
  )
}
