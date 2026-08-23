import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Bell,
  Building2,
  Calendar,
  Check,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Ticket,
  UserRound,
  Users,
  X,
} from 'lucide-react'
import { useKunjungan } from '../context/KunjunganContext'
import { SUMBER } from '../lib/dummyData'
import { STATUS, STATUS_CONFIG } from '../lib/status'
import { CHANNEL_LABEL } from '../lib/notifikasi'
import { cn, formatDate, formatDateTime, formatFileSize, formatTime } from '../lib/utils'
import StatusBadge from '../components/ui/StatusBadge'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import StatusTimeline from '../components/kunjungan/StatusTimeline'

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
  const { data, notifikasi, updateStatus } = useKunjungan()
  const record = data.find((k) => k.id === id)
  const riwayatNotifikasi = notifikasi
    .filter((n) => n.kunjunganId === id)
    .sort((a, b) => b.waktu - a.waktu)

  const [dialog, setDialog] = useState(null)
  const [alasan, setAlasan] = useState('')

  if (!record) {
    return (
      <EmptyState
        icon={Ticket}
        title="Kunjungan tidak ditemukan"
        description={`Data dengan kode "${id}" tidak tersedia atau sudah dihapus.`}
        action={
          <Link to="/petugas/kunjungan" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            &larr; Kembali ke daftar kunjungan
          </Link>
        }
      />
    )
  }

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
        onClick={() => navigate('/petugas/kunjungan')}
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
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <p className="text-xs font-medium tracking-wide text-slate-400">{record.id}</p>
                {record.sumber === SUMBER.MANDIRI && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-600 ring-1 ring-inset ring-violet-200">
                    <UserRound className="h-3 w-3" />
                    Pengajuan Mandiri via Portal Tamu
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button as={Link} to={`/petugas/kunjungan/${record.id}/edit`} variant="secondary" size="sm">
            <Pencil className="h-3.5 w-3.5" />
            Edit Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Tujuan Kunjungan</h3>
            <p className="mt-2 text-sm font-medium text-slate-700">{record.tujuan}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{record.keterangan}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">Surat Kunjungan</h3>
            {record.suratKunjungan ? (
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {record.suratKunjungan.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatFileSize(record.suratKunjungan.size)} &middot; diunggah oleh tamu
                  </p>
                </div>
                <a
                  href={record.suratKunjungan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  Lihat Surat
                </a>
              </div>
            ) : (
              <p className="rounded-lg bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-500">
                Belum ada surat yang diunggah untuk kunjungan ini
                {record.sumber === SUMBER.PETUGAS
                  ? ' karena didaftarkan langsung oleh petugas.'
                  : '.'}
              </p>
            )}
          </div>

          {record.catatanPetugas && isFinal && (
            <div
              className={cn(
                'rounded-xl border p-5 text-sm',
                record.status === STATUS.DITOLAK
                  ? 'border-red-200 bg-red-50 text-red-700'
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

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-1 text-sm font-semibold text-slate-900">Riwayat Notifikasi</h3>
            <p className="mb-3 text-xs text-slate-400">
              Pemberitahuan yang terkirim ke tamu dan pejabat/unit tujuan sepanjang sesi ini.
            </p>
            {riwayatNotifikasi.length === 0 ? (
              <p className="rounded-lg bg-slate-50 px-3.5 py-3 text-xs leading-relaxed text-slate-500">
                Belum ada notifikasi terkirim untuk kunjungan ini pada sesi ini.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {riwayatNotifikasi.map((n) => (
                  <li key={n.id} className="flex items-start gap-3 py-2.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                      <Bell className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-slate-700">
                        Ke <span className="font-medium text-slate-900">{n.targetNama}</span>
                        <span className="text-slate-400"> &middot; {n.target === 'tamu' ? 'Tamu' : 'Pejabat Tujuan'}</span>
                      </p>
                      <p className="text-xs text-slate-500">{n.pesan}</p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {formatDateTime(n.waktu)} &middot; via {CHANNEL_LABEL[n.channel]}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">Status Kunjungan</h3>
            <StatusTimeline status={record.status} />
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
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
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
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </ConfirmDialog>
    </div>
  )
}
