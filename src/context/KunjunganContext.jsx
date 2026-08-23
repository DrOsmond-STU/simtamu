import { createContext, useContext, useMemo, useRef, useState } from 'react'
import { KUNJUNGAN as INITIAL_KUNJUNGAN } from '../lib/dummyData'
import { notifikasiPengajuanBaru, notifikasiPerubahanStatus } from '../lib/notifikasi'

// Penyimpanan data kunjungan di memori (bukan backend sungguhan).
// Cukup untuk mendemonstrasikan alur UI/UX secara utuh: menambah,
// menyetujui, menolak, hingga menyelesaikan kunjungan — baik yang
// didaftarkan petugas maupun yang diajukan mandiri oleh tamu lewat
// Portal Tamu. Setiap peristiwa juga menghasilkan entri notifikasi
// (lihat src/lib/notifikasi.js) sehingga jejak "tamu & pejabat diberi
// tahu" terlihat di lonceng notifikasi petugas maupun riwayat kunjungan.

const KunjunganContext = createContext(null)

function initialSequence() {
  return INITIAL_KUNJUNGAN.reduce((max, k) => {
    const match = /KJG-2026-(\d+)/.exec(k.id)
    return match ? Math.max(max, Number(match[1])) : max
  }, 0)
}

export function KunjunganProvider({ children }) {
  const [data, setData] = useState(INITIAL_KUNJUNGAN)
  const [notifikasi, setNotifikasi] = useState([])
  const seqRef = useRef(initialSequence())

  const actions = useMemo(
    () => ({
      updateStatus(id, status, catatanPetugas) {
        let updated = null
        setData((prev) =>
          prev.map((k) => {
            if (k.id !== id) return k
            updated = { ...k, status, catatanPetugas: catatanPetugas ?? k.catatanPetugas }
            return updated
          }),
        )
        if (updated) {
          const entries = notifikasiPerubahanStatus(updated, status, catatanPetugas)
          if (entries.length) setNotifikasi((prev) => [...entries, ...prev])
        }
      },
      updateKunjungan(id, patch) {
        setData((prev) => prev.map((k) => (k.id === id ? { ...k, ...patch } : k)))
      },
      // Membuat kunjungan baru sekaligus menghasilkan kode kunjungan yang unik,
      // dipakai baik oleh form petugas maupun form pengajuan mandiri di Portal
      // Tamu, sehingga tidak ada risiko dua kode yang sama.
      addKunjungan(partialRecord) {
        seqRef.current += 1
        const record = { ...partialRecord, id: `KJG-2026-${String(seqRef.current).padStart(4, '0')}` }
        setData((prev) => [record, ...prev])
        setNotifikasi((prev) => [...notifikasiPengajuanBaru(record), ...prev])
        return record
      },
      tandaiNotifikasiTerbaca() {
        setNotifikasi((prev) => prev.map((n) => ({ ...n, dibaca: true })))
      },
    }),
    [],
  )

  const value = useMemo(
    () => ({ data, notifikasi, ...actions }),
    [data, notifikasi, actions],
  )

  return <KunjunganContext.Provider value={value}>{children}</KunjunganContext.Provider>
}

export function useKunjungan() {
  const ctx = useContext(KunjunganContext)
  if (!ctx) throw new Error('useKunjungan harus dipakai di dalam <KunjunganProvider>')
  return ctx
}
