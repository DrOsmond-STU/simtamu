import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, CheckCircle2, Copy, Search, Send } from 'lucide-react'
import { useKunjungan } from '../../context/KunjunganContext'
import { formatDate, formatTime } from '../../lib/utils'
import StatusBadge from '../../components/ui/StatusBadge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'

export default function PortalSuccess() {
  const { id } = useParams()
  const { data } = useKunjungan()
  const record = data.find((k) => k.id === id)
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API mungkin tidak tersedia — abaikan secara diam-diam.
    }
  }

  if (!record) {
    return (
      <EmptyState
        icon={Search}
        title="Pengajuan tidak ditemukan"
        description="Data pengajuan mungkin sudah tidak tersedia pada sesi ini. Silakan ajukan kembali."
        action={
          <Link
            to="/portal/ajukan"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            &larr; Buat pengajuan baru
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-6 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckCircle2 className="h-9 w-9" />
      </span>
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Pengajuan Berhasil Dikirim!</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Terima kasih, {record.nama}. Pengajuan kunjungan Anda telah kami terima dan akan segera
          ditinjau oleh petugas.
        </p>
      </div>

      <div className="mx-auto max-w-sm rounded-xl border border-dashed border-blue-300 bg-blue-50 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-blue-500">
          Kode Pengajuan Anda
        </p>
        <div className="mt-1.5 flex items-center justify-center gap-2">
          <p className="text-2xl font-bold tracking-wide text-blue-700">{record.id}</p>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-md p-1.5 text-blue-500 hover:bg-blue-100"
            aria-label="Salin kode pengajuan"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <p className="mt-1 text-xs text-blue-500">
          {copied ? 'Kode disalin ke clipboard' : 'Simpan kode ini untuk mengecek status pengajuan'}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Ringkasan Pengajuan</h2>
          <StatusBadge status={record.status} />
        </div>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Tujuan Kunjungan</span>
            <span className="text-right font-medium text-slate-700">{record.tujuan}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Pejabat / Unit Dituju</span>
            <span className="text-right font-medium text-slate-700">{record.pejabat.nama}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Jadwal Diusulkan</span>
            <span className="text-right font-medium text-slate-700">
              {formatDate(record.mulai)}, {formatTime(record.mulai)} WIB
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-slate-400">
        Anda akan dihubungi melalui telepon atau email setelah petugas memproses pengajuan ini.
      </p>

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button as={Link} to={`/portal/status?kode=${record.id}`} variant="secondary">
          <Search className="h-4 w-4" />
          Cek Status Pengajuan
        </Button>
        <Button as={Link} to="/portal/ajukan" variant="primary">
          <Send className="h-4 w-4" />
          Ajukan Kunjungan Lain
        </Button>
      </div>
    </div>
  )
}
