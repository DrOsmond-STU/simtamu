import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Ticket,
  Users,
  X,
} from 'lucide-react'
import { useKunjungan } from '../context/KunjunganContext'
import { STATUS, STATUS_CONFIG } from '../lib/status'
import { formatDate, formatDateTime, formatTime } from '../lib/utils'
import StatusBadge from '../components/ui/StatusBadge'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import { cn } from '../lib/utils'

const FLOW = [STATUS.MENUNGGU, STATUS.DISETUJUI, STATUS.BERLANGSUNG, STATUS.SELESAI]

function buildTimeline(status) {
  if (status === STATUS.DITOLAK) {
    return [
      { key: STATUS.MENUNGGU, state: 'done' },
      { key: STATUS.DITOLAK, state: 'current' },
    ]
  }
  if (status === STATUS.DIBATALKAN) {
    return [
      { key: STATUS.MENUNGGU, state: 'done' },
      { key: STATUS.DIBATALKAN, state: 'current' },
    ]
  }
  const idx = FLOW.indexOf(status)
  return FLOW.map((key, i) => ({
    key,
    state: i < idx ? 'done' : i === idx ? 'current' : 'upcoming',
  }))
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  )
}

export default function KunjunganDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, updateStatus } = useKunjungan()
  const record = data.find((k) => k.id === id)

  const [dialog, setDialog] = useState(null)
  const [alasan, setAlasan] = useState('')

  if (!record) {
    return (
      <EmptyState
        icon={Ticket}
        title="Kunjungan tidak ditemukan"
        description={`Data dengan kode "${id}" tidak tersedia atau sudah dihapus.`}
        action={
          <Link to="/kunjungan" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            &larr; Kembali ke daftar kunjungan
          </Link>
        }
      />
    )
  }

  const timeline = buildTimeline(record.status)
  const isFinal = [STATUS.SELESAI, STATUS.DITOLAK, STATUS.DIBATALKAN].includes(record.status)

  function closeDialog() {
    setDialog(null)
    setAlasan('')
  }

  function confirmTolak() {
    updateStatus(record.id, STATUS.DITOLAK, alasan.trim() || 'Ditolak oleh petugas.')
    closeDialog()
  }

  function confirmBatalkan() {
    updateStatus(record.id, STATUS.DIBATALKAN, alasan.trim() || 'Dibatalkan oleh petugas.')
    closeDialog()
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => navigate('/kunjungan')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke daftar kunjungan
      </button>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar name={record.nama} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900">{record.nama}</h2>
                <StatusBadge status={record.status} />
              </div>
              <p className="text-sm text-slate-500">
                {record.jabatanTamu} &middot; {record.instansi}
              </p>
              <p className="mt-1 text-xs font-medium tracking-wide text-slate-400">{record.id}</p>
            </div>
          </div>
          <Link to={`/kunjungan/${record.id}/edit`}>
            <Button variant="secondary" size="sm">
              <Pencil className="h-3.5 w-3.5" />
              Edit Data
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Tujuan Kunjungan</h3>
            <p className="mt-2 text-sm font-medium text-slate-700">{record.tujuan}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{record.keterangan}</p>
          </div>

          {record.catatanPetugas && isFinal && (
            <div
              className={cn(
                'rounded-xl border p-5 text-sm',
                record.status === STATUS.DITOLAK
                  ? 'border-rose-200 bg-rose-50 text-rose-700'
                  : 'border-slate-200 bg-slate-50 text-slate-600',
              )}
            >
              <p className="font-semibold">Catatan Petugas</p>
              <p className="mt-1">{record.catatanPetugas}</p>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-1 text-sm font-semibold text-slate-900">Informasi Kunjungan</h3>
            <div className="divide-y divide-slate-100">
              <InfoRow
                icon={Calendar}
                label="Jadwal"
                value={`${formatDate(record.mulai)}, ${formatTime(record.mulai)}–${formatTime(record.selesai)} WIB`}
              />
              <InfoRow icon={MapPin} label="Lokasi" value={record.lokasi} />
              <InfoRow
                icon={Building2}
                label="Pejabat / Unit Dituju"
                value={`${record.pejabat.nama} — ${record.pejabat.unit}`}
              />
              <InfoRow
                icon={Users}
                label="Jumlah Rombongan"
                value={`${record.rombongan} orang`}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-1 text-sm font-semibold text-slate-900">Kontak Tamu</h3>
            <div className="divide-y divide-slate-100">
              <InfoRow icon={Phone} label="Nomor Telepon" value={record.telepon} />
              <InfoRow icon={Mail} label="Email" value={record.email} />
              <InfoRow icon={Ticket} label="Terdaftar Pada" value={formatDateTime(record.dibuatPada)} />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Status Kunjungan</h3>
            <ol className="space-y-0">
              {timeline.map((step, idx) => {
                const config = STATUS_CONFIG[step.key]
                const isLast = idx === timeline.length - 1
                return (
                  <li key={step.key} className="relative flex gap-3 pb-6 last:pb-0">
                    {!isLast && (
                      <span
                        className={cn(
                          'absolute left-[11px] top-6 h-full w-px',
                          step.state === 'done' ? 'bg-emerald-300' : 'bg-slate-200',
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        'relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                        step.state === 'done' && 'bg-emerald-500 text-white',
                        step.state === 'current' && `${config.dot} text-white ring-4 ring-slate-100`,
                        step.state === 'upcoming' && 'bg-white text-slate-300 ring-2 ring-slate-200',
                      )}
                    >
                      {step.state === 'done' ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                    </span>
                    <div className="pt-0.5">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          step.state === 'upcoming' ? 'text-slate-400' : 'text-slate-800',
                        )}
                      >
                        {config.label}
                      </p>
                      {step.state === 'current' && (
                        <p className="text-xs text-slate-400">Status saat ini</p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Tindakan</h3>
            <div className="space-y-2.5">
              {record.status === STATUS.MENUNGGU && (
                <>
                  <Button
                    variant="success"
                    className="w-full"
                    onClick={() => updateStatus(record.id, STATUS.DISETUJUI)}
                  >
                    <Check className="h-4 w-4" />
                    Setujui Kunjungan
                  </Button>
                  <Button variant="danger" className="w-full" onClick={() => setDialog('tolak')}>
                    <X className="h-4 w-4" />
                    Tolak Kunjungan
                  </Button>
                </>
              )}
              {record.status === STATUS.DISETUJUI && (
                <>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => updateStatus(record.id, STATUS.BERLANGSUNG)}
                  >
                    Check-in / Mulai Kunjungan
                  </Button>
                  <Button variant="danger" className="w-full" onClick={() => setDialog('batalkan')}>
                    Batalkan Kunjungan
                  </Button>
                </>
              )}
              {record.status === STATUS.BERLANGSUNG && (
                <Button
                  variant="success"
                  className="w-full"
                  onClick={() => updateStatus(record.id, STATUS.SELESAI)}
                >
                  <Check className="h-4 w-4" />
                  Selesaikan Kunjungan
                </Button>
              )}
              {isFinal && (
                <p className="rounded-lg bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-500">
                  Kunjungan ini berstatus <span className="font-medium">{STATUS_CONFIG[record.status].label}</span> dan
                  tidak memerlukan tindakan lebih lanjut.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={dialog === 'tolak'}
        onClose={closeDialog}
        onConfirm={confirmTolak}
        title="Tolak Kunjungan"
        description="Berikan alasan penolakan agar tamu dan petugas lain memahami keputusan ini."
        confirmLabel="Tolak Kunjungan"
        confirmVariant="danger"
      >
        <textarea
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          rows={3}
          placeholder="Contoh: Jadwal bentrok dengan agenda pimpinan"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </ConfirmDialog>

      <ConfirmDialog
        open={dialog === 'batalkan'}
        onClose={closeDialog}
        onConfirm={confirmBatalkan}
        title="Batalkan Kunjungan"
        description="Kunjungan yang sudah terjadwal akan dibatalkan. Tambahkan catatan bila diperlukan."
        confirmLabel="Batalkan Kunjungan"
        confirmVariant="danger"
      >
        <textarea
          value={alasan}
          onChange={(e) => setAlasan(e.target.value)}
          rows={3}
          placeholder="Contoh: Tamu berhalangan hadir"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </ConfirmDialog>
    </div>
  )
}
