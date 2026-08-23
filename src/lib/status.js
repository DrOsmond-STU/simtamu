// Definisi status alur kunjungan tamu, dari pendaftaran sampai selesai.

export const STATUS = {
  MENUNGGU: 'menunggu',
  DISETUJUI: 'disetujui',
  BERLANGSUNG: 'berlangsung',
  SELESAI: 'selesai',
  DITOLAK: 'ditolak',
  DIBATALKAN: 'dibatalkan',
}

export const STATUS_CONFIG = {
  [STATUS.MENUNGGU]: {
    label: 'Menunggu Konfirmasi',
    badge: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    dot: 'bg-amber-500',
    bar: 'bg-amber-500',
    hex: '#f59e0b',
  },
  [STATUS.DISETUJUI]: {
    label: 'Terjadwal',
    badge: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    dot: 'bg-blue-500',
    bar: 'bg-blue-500',
    hex: '#3b82f6',
  },
  [STATUS.BERLANGSUNG]: {
    label: 'Sedang Berlangsung',
    badge: 'bg-violet-50 text-violet-700 ring-violet-600/20',
    dot: 'bg-violet-500',
    bar: 'bg-violet-500',
    hex: '#8b5cf6',
  },
  [STATUS.SELESAI]: {
    label: 'Selesai',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    dot: 'bg-emerald-500',
    bar: 'bg-emerald-500',
    hex: '#10b981',
  },
  [STATUS.DITOLAK]: {
    label: 'Ditolak',
    badge: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    dot: 'bg-rose-500',
    bar: 'bg-rose-500',
    hex: '#f43f5e',
  },
  [STATUS.DIBATALKAN]: {
    label: 'Dibatalkan',
    badge: 'bg-slate-100 text-slate-600 ring-slate-500/20',
    dot: 'bg-slate-400',
    bar: 'bg-slate-400',
    hex: '#94a3b8',
  },
}

export const STATUS_ORDER = [
  STATUS.MENUNGGU,
  STATUS.DISETUJUI,
  STATUS.BERLANGSUNG,
  STATUS.SELESAI,
  STATUS.DITOLAK,
  STATUS.DIBATALKAN,
]
