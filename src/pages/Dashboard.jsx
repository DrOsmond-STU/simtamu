import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CalendarClock, CalendarPlus, ClockAlert, UserCheck, Users2 } from 'lucide-react'
import { useKunjungan } from '../context/KunjunganContext'
import { STATUS, STATUS_CONFIG, STATUS_ORDER } from '../lib/status'
import { addDays, formatDateShort, formatDateWeekday, formatTime, isSameDay } from '../lib/utils'
import StatCard from '../components/ui/StatCard'
import StatusBadge from '../components/ui/StatusBadge'
import Avatar from '../components/ui/Avatar'
import EmptyState from '../components/ui/EmptyState'

const today = new Date()
today.setHours(0, 0, 0, 0)

export default function Dashboard() {
  const { data: KUNJUNGAN } = useKunjungan()
  // Recharts' ResponsiveContainer mengukur lebar/tinggi lewat ResizeObserver
  // pada saat mount. Setelah navigasi client-side (bukan reload penuh), ia
  // kadang mengukur sebelum layout Sidebar+Header selesai settle, sehingga
  // grafik tetap kosong sampai ada resize lain. Menunda pemasangan grafik
  // satu frame (requestAnimationFrame) memastikan container sudah punya
  // ukuran akhir yang benar saat ResponsiveContainer mulai mengamati.
  const [chartsReady, setChartsReady] = useState(false)
  useEffect(() => {
    // Dua rAF berantai: rAF pertama masih terjadwal SEBELUM paint berikutnya;
    // baru di rAF kedua kita benar-benar tahu satu siklus paint sudah lewat
    // dan layout sudah settle.
    let inner
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setChartsReady(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      if (inner) cancelAnimationFrame(inner)
    }
  }, [])
  const kunjunganHariIni = KUNJUNGAN.filter((k) => isSameDay(k.mulai, today)).sort(
    (a, b) => a.mulai - b.mulai,
  )
  const menunggu = KUNJUNGAN.filter((k) => k.status === STATUS.MENUNGGU).sort(
    (a, b) => a.mulai - b.mulai,
  )
  const terjadwalMendatang = KUNJUNGAN.filter(
    (k) => k.status === STATUS.DISETUJUI && k.mulai >= today,
  )
  const selesaiBulanIni = KUNJUNGAN.filter(
    (k) =>
      k.status === STATUS.SELESAI &&
      k.mulai.getMonth() === today.getMonth() &&
      k.mulai.getFullYear() === today.getFullYear(),
  )

  const trendData = Array.from({ length: 14 }).map((_, idx) => {
    const date = addDays(today, idx - 13)
    const jumlah = KUNJUNGAN.filter((k) => isSameDay(k.mulai, date)).length
    return { tanggal: formatDateShort(date), jumlah }
  })

  const statusData = STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_CONFIG[status].label,
    value: KUNJUNGAN.filter((k) => k.status === status).length,
  })).filter((item) => item.value > 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">Selamat datang kembali,</p>
          <h2 className="text-xl font-semibold text-slate-900">Ringkasan Kunjungan Tamu</h2>
        </div>
        <p className="text-sm font-medium text-slate-500">{formatDateWeekday(today)}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Kunjungan Hari Ini" value={kunjunganHariIni.length} icon={Users2} tone="blue" />
        <StatCard label="Menunggu Konfirmasi" value={menunggu.length} icon={ClockAlert} tone="amber" />
        <StatCard
          label="Terjadwal (Akan Datang)"
          value={terjadwalMendatang.length}
          icon={CalendarClock}
          tone="violet"
        />
        <StatCard label="Selesai Bulan Ini" value={selesaiBulanIni.length} icon={UserCheck} tone="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Tren Kunjungan 14 Hari Terakhir</h3>
              <p className="text-xs text-slate-400">Jumlah kunjungan terdaftar per hari</p>
            </div>
          </div>
          <div className="h-64 w-full">
            {chartsReady ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#eef2f7" />
                  <XAxis
                    dataKey="tanggal"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                    interval={1}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{
                      borderRadius: 8,
                      borderColor: '#e2e8f0',
                      fontSize: 12,
                    }}
                    labelStyle={{ color: '#0f172a', fontWeight: 600 }}
                    formatter={(value) => [`${value} kunjungan`, '']}
                  />
                  <Bar dataKey="jumlah" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full animate-pulse rounded-lg bg-slate-100" />
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-1 text-sm font-semibold text-slate-900">Distribusi Status</h3>
          <p className="mb-2 text-xs text-slate-400">Seluruh data kunjungan tercatat</p>
          <div className="h-40 w-full">
            {chartsReady ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={42}
                    outerRadius={64}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_CONFIG[entry.status].hex} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 12 }}
                    formatter={(value, _name, item) => [`${value} kunjungan`, item.payload.label]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full animate-pulse rounded-lg bg-slate-100" />
            )}
          </div>
          <ul className="mt-2 space-y-2">
            {statusData.map((item) => (
              <li key={item.status} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: STATUS_CONFIG[item.status].hex }}
                  />
                  {item.label}
                </span>
                <span className="font-medium text-slate-900">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Jadwal Hari Ini</h3>
            <Link to="/petugas/agenda" className="text-xs font-medium text-brand-600 hover:text-brand-700">
              Lihat agenda &rarr;
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {kunjunganHariIni.length === 0 && (
              <div className="p-5">
                <EmptyState
                  icon={CalendarClock}
                  title="Belum ada jadwal hari ini"
                  description="Kunjungan yang terdaftar untuk hari ini akan muncul di sini."
                />
              </div>
            )}
            {kunjunganHariIni.slice(0, 5).map((k) => (
              <Link
                key={k.id}
                to={`/petugas/kunjungan/${k.id}`}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
              >
                <Avatar name={k.nama} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{k.nama}</p>
                  <p className="truncate text-xs text-slate-400">
                    {formatTime(k.mulai)} &middot; {k.pejabat.nama.split(',')[0]}
                  </p>
                </div>
                <StatusBadge status={k.status} />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-slate-900">Menunggu Konfirmasi</h3>
            <Link
              to="/petugas/kunjungan?status=menunggu"
              className="text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              Lihat semua &rarr;
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {menunggu.length === 0 && (
              <div className="p-5">
                <EmptyState
                  icon={UserCheck}
                  title="Tidak ada yang menunggu"
                  description="Semua pengajuan kunjungan sudah diproses."
                />
              </div>
            )}
            {menunggu.slice(0, 5).map((k) => (
              <Link
                key={k.id}
                to={`/petugas/kunjungan/${k.id}`}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
              >
                <Avatar name={k.nama} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{k.nama}</p>
                  <p className="truncate text-xs text-slate-400">
                    {formatDateShort(k.mulai)}, {formatTime(k.mulai)} &middot; {k.instansi}
                  </p>
                </div>
                <span className="hidden shrink-0 text-xs font-medium text-brand-600 sm:block">Tinjau</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-brand-200 bg-brand-50/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
            <CalendarPlus className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">Ada tamu yang akan berkunjung?</p>
            <p className="text-xs text-slate-500">Daftarkan kunjungan baru hanya dalam beberapa langkah.</p>
          </div>
        </div>
        <Link
          to="/petugas/kunjungan/baru"
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700"
        >
          Daftarkan Kunjungan
        </Link>
      </div>
    </div>
  )
}
