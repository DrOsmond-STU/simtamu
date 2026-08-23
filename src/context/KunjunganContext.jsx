import { createContext, useContext, useMemo, useRef, useState } from 'react'
import { KUNJUNGAN as INITIAL_KUNJUNGAN } from '../lib/dummyData'

// Penyimpanan data kunjungan di memori (bukan backend sungguhan).
// Cukup untuk mendemonstrasikan alur UI/UX secara utuh: menambah,
// menyetujui, menolak, hingga menyelesaikan kunjungan — baik yang
// didaftarkan petugas maupun yang diajukan mandiri oleh tamu lewat
// Portal Tamu.

const KunjunganContext = createContext(null)

function initialSequence() {
  return INITIAL_KUNJUNGAN.reduce((max, k) => {
    const match = /KJG-2026-(\d+)/.exec(k.id)
    return match ? Math.max(max, Number(match[1])) : max
  }, 0)
}

export function KunjunganProvider({ children }) {
  const [data, setData] = useState(INITIAL_KUNJUNGAN)
  const seqRef = useRef(initialSequence())

  const actions = useMemo(
    () => ({
      updateStatus(id, status, catatanPetugas) {
        setData((prev) =>
          prev.map((k) =>
            k.id === id ? { ...k, status, catatanPetugas: catatanPetugas ?? k.catatanPetugas } : k,
          ),
        )
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
        return record
      },
    }),
    [],
  )

  const value = useMemo(() => ({ data, ...actions }), [data, actions])

  return <KunjunganContext.Provider value={value}>{children}</KunjunganContext.Provider>
}

export function useKunjungan() {
  const ctx = useContext(KunjunganContext)
  if (!ctx) throw new Error('useKunjungan harus dipakai di dalam <KunjunganProvider>')
  return ctx
}
