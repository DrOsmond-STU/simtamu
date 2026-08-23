import { createContext, useContext, useMemo, useState } from 'react'
import { KUNJUNGAN as INITIAL_KUNJUNGAN } from '../lib/dummyData'

// Penyimpanan data kunjungan di memori (bukan backend sungguhan).
// Cukup untuk mendemonstrasikan alur UI/UX secara utuh: menambah,
// menyetujui, menolak, hingga menyelesaikan kunjungan.

const KunjunganContext = createContext(null)

export function KunjunganProvider({ children }) {
  const [data, setData] = useState(INITIAL_KUNJUNGAN)

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
      addKunjungan(record) {
        setData((prev) => [record, ...prev])
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
