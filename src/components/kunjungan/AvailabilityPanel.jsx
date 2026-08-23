import { CalendarClock, CircleAlert, CircleCheck } from 'lucide-react'
import { useKunjungan } from '../../context/KunjunganContext'
import { STATUS, STATUS_CONFIG } from '../../lib/status'
import { combineDateTime, formatDate, formatTime, toDateKey } from '../../lib/utils'

// Status yang dianggap benar-benar "menempati" jadwal pejabat. Menunggu
// konfirmasi belum pasti, jadi ditampilkan terpisah sebagai info tambahan,
// bukan dihitung sebagai jadwal terisi.
const STATUS_TERISI = [STATUS.DISETUJUI, STATUS.BERLANGSUNG]

// Panel ini SENGAJA hanya menampilkan rentang jam yang sudah terisi, tanpa
// nama/instansi tamu lain — mirip tampilan "free/busy" pada kalender bersama.
// Menampilkan identitas tamu lain ke pengunjung yang tidak berkaitan akan
// membocorkan informasi kunjungan pihak lain.
export default function AvailabilityPanel({ pejabat, tanggal, jamMulai, jamSelesai }) {
  const { data } = useKunjungan()

  if (!pejabat || !tanggal) return null

  const kunjunganHari = data.filter(
    (k) => k.pejabat.id === pejabat.id && toDateKey(k.mulai) === tanggal,
  )
  const terjadwal = kunjunganHari
    .filter((k) => STATUS_TERISI.includes(k.status))
    .sort((a, b) => a.mulai - b.mulai)
  const menunggu = kunjunganHari.filter((k) => k.status === STATUS.MENUNGGU)

  let bentrok = false
  if (jamMulai && jamSelesai) {
    const usulMulai = combineDateTime(tanggal, jamMulai)
    const usulSelesai = combineDateTime(tanggal, jamSelesai)
    bentrok = terjadwal.some((k) => usulMulai < k.selesai && k.mulai < usulSelesai)
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-brand-600" />
          <p className="text-sm font-semibold text-slate-800">
            Ketersediaan {pejabat.nama.split(',')[0]}
          </p>
        </div>
        <span className="text-xs font-medium text-slate-500">{formatDate(tanggal)}</span>
      </div>

      {terjadwal.length === 0 ? (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-green-700">
          <CircleCheck className="h-4 w-4 shrink-0" />
          Belum ada kunjungan terjadwal pada tanggal ini — jadwal kosong.
        </p>
      ) : (
        <>
          <p className="mt-3 text-xs text-slate-500">
            {terjadwal.length} jadwal sudah terisi pada tanggal ini:
          </p>
          <ul className="mt-2 space-y-1.5">
            {terjadwal.map((k) => (
              <li
                key={k.id}
                className="flex items-center gap-2 rounded-md bg-white px-2.5 py-1.5 text-xs text-slate-600 ring-1 ring-slate-200"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: STATUS_CONFIG[k.status].hex }}
                />
                <span className="font-medium text-slate-700">
                  {formatTime(k.mulai)}–{formatTime(k.selesai)}
                </span>
                <span className="text-slate-400">&middot;</span>
                <span>{STATUS_CONFIG[k.status].label}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {menunggu.length > 0 && (
        <p className="mt-2 text-xs text-amber-600">
          Selain itu, {menunggu.length} pengajuan lain pada tanggal ini masih menunggu konfirmasi
          petugas.
        </p>
      )}

      {bentrok && (
        <p className="mt-3 flex items-start gap-1.5 rounded-md bg-red-50 px-2.5 py-2 text-xs text-red-700 ring-1 ring-red-200">
          <CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Jam yang Anda pilih ({formatTime(combineDateTime(tanggal, jamMulai))}&ndash;
          {formatTime(combineDateTime(tanggal, jamSelesai))}) bertabrakan dengan jadwal yang sudah
          terisi. Anda tetap dapat mengirim pengajuan, namun petugas mungkin akan menghubungi Anda
          untuk menyesuaikan waktu.
        </p>
      )}

      <p className="mt-2 text-[11px] text-slate-400">
        Hanya menampilkan jam yang sudah terisi, tanpa detail identitas tamu lain.
      </p>
    </div>
  )
}
