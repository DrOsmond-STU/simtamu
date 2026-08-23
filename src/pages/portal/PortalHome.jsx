import { Link } from 'react-router-dom'
import { CalendarCheck, FileUp, Search, Send, UserPen } from 'lucide-react'

const LANGKAH = [
  {
    icon: UserPen,
    title: '1. Isi Data & Jadwal',
    desc: 'Lengkapi data diri, tujuan kunjungan, serta usulan tanggal dan jam kunjungan.',
  },
  {
    icon: FileUp,
    title: '2. Unggah Surat Kunjungan',
    desc: 'Lampirkan surat permohonan kunjungan resmi dari instansi Anda (PDF/JPG/PNG).',
  },
  {
    icon: CalendarCheck,
    title: '3. Tunggu Konfirmasi',
    desc: 'Petugas akan meninjau pengajuan Anda dan mengonfirmasi jadwal kunjungan.',
  },
]

const SYARAT = [
  'Surat permohonan kunjungan resmi dari instansi/organisasi',
  'Data diri yang aktif dapat dihubungi (nomor telepon & email)',
  'Kepastian jumlah rombongan yang akan hadir',
  'Mengajukan paling lambat 1 hari sebelum tanggal kunjungan',
]

export default function PortalHome() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          Layanan Mandiri untuk Tamu
        </span>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">
          Ajukan Kunjungan Anda Secara Online
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
          Daftarkan rencana kunjungan Anda, usulkan waktu yang diinginkan, dan unggah surat
          kunjungan resmi tanpa perlu datang langsung. Petugas kami akan meninjau dan
          mengonfirmasi pengajuan Anda.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/portal/ajukan"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 sm:w-auto"
          >
            <Send className="h-4 w-4" />
            Ajukan Kunjungan Sekarang
          </Link>
          <Link
            to="/portal/status"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
          >
            <Search className="h-4 w-4" />
            Cek Status Pengajuan
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {LANGKAH.map((l) => (
          <div key={l.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <l.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 text-sm font-semibold text-slate-900">{l.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{l.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="text-sm font-semibold text-amber-900">Yang perlu Anda siapkan</h3>
        <ul className="mt-3 space-y-2">
          {SYARAT.map((s) => (
            <li key={s} className="flex items-start gap-2 text-sm text-amber-800">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
