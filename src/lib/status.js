// Definisi status alur kunjungan tamu, dari pendaftaran sampai selesai.
// Warna semantik (amber/green/red) disamakan dengan token --amber-500,
// --green-500, --red-500 yang dipakai aplikasi lain di lingkungan
// PT Semesta Teknologi Utama (ERP Enterprise, FLMS).

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
    hex: '#d97706',
  },
  [STATUS.DISETUJUI]: {
    label: 'Terjadwal',
    badge: 'bg-brand-50 text-brand-700 ring-brand-600/20',
    dot: 'bg-brand-600',
    bar: 'bg-brand-600',
    hex: '#1b4bd6',
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
    badge: 'bg-green-50 text-green-700 ring-green-600/20',
    dot: 'bg-green-600',
    bar: 'bg-green-600',
    hex: '#16a34a',
  },
  [STATUS.DITOLAK]: {
    label: 'Ditolak',
    badge: 'bg-red-50 text-red-700 ring-red-600/20',
    dot: 'bg-red-600',
    bar: 'bg-red-600',
    hex: '#dc2626',
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
