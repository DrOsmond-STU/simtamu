# SIMTAMU — Manajemen Kunjungan & Agenda

Prototipe UI/UX untuk modul **Manajemen Kunjungan & Agenda** pada SIMTAMU
(Sistem Informasi Manajemen Tamu). Aplikasi ini adalah front-end murni yang
dibangun dengan data contoh (dummy) untuk mendemonstrasikan alur kerja dan
tampilan antarmuka — belum terhubung ke backend/database sungguhan.

## Fitur

- **Dashboard** — ringkasan statistik kunjungan (hari ini, menunggu
  konfirmasi, terjadwal, selesai bulan ini), tren kunjungan 14 hari
  terakhir, distribusi status, jadwal hari ini, dan daftar yang menunggu
  konfirmasi.
- **Kunjungan** — daftar seluruh kunjungan dengan pencarian, filter status
  (chip cepat), filter unit tujuan, dan paginasi.
- **Detail Kunjungan** — informasi lengkap tamu & kunjungan, timeline
  status berjalan (Menunggu → Terjadwal → Berlangsung → Selesai, dengan
  jalur Ditolak/Dibatalkan), serta tindakan kontekstual: Setujui, Tolak
  (dengan alasan), Check-in, Selesaikan, dan Batalkan.
- **Form Kunjungan** — pendaftaran kunjungan baru maupun pengeditan data,
  lengkap dengan validasi input.
- **Agenda** — tampilan kalender bulanan untuk melihat sebaran jadwal
  kunjungan per hari, dengan panel detail untuk tanggal yang dipilih.

Perubahan status/data disimpan sementara di memori (React Context) selama
sesi berjalan, sehingga aksi seperti "Setujui Kunjungan" atau "Daftarkan
Kunjungan" langsung terlihat efeknya di seluruh halaman — namun akan
kembali ke data awal saat halaman di-refresh, karena memang belum ada
backend.

## Teknologi

- [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/) untuk navigasi antar halaman
- [Recharts](https://recharts.org/) untuk grafik pada dashboard
- [Lucide React](https://lucide.dev/) untuk ikon

## Menjalankan Proyek

```bash
npm install
npm run dev       # menjalankan dev server (default: http://localhost:5173)
npm run build     # build produksi ke folder dist/
npm run lint      # menjalankan oxlint
```

## Struktur Proyek

```
src/
├── components/
│   ├── layout/       # Sidebar, Header, AppLayout
│   └── ui/            # Komponen dasar: Button, Badge, Avatar, Field, dll.
├── context/           # State kunjungan di memori (KunjunganContext)
├── lib/                # Data dummy, konstanta status, helper tanggal
└── pages/              # Dashboard, KunjunganList, KunjunganDetail,
                         # KunjunganForm, Agenda
```
