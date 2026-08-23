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
- **Portal Tamu** (`/portal`) — halaman publik terpisah (tanpa sidebar
  admin) tempat tamu mengajukan kunjungan secara mandiri: formulir wizard
  4 langkah (data diri, jadwal usulan, unggah surat kunjungan, tinjau &
  kirim), halaman konfirmasi dengan kode pengajuan yang bisa disalin, dan
  halaman cek status berdasarkan kode atau nomor telepon. Pengajuan yang
  masuk langsung muncul di daftar & detail kunjungan sisi petugas dengan
  label "Pengajuan Mandiri" dan surat yang diunggah tamu bisa langsung
  dibuka petugas dari halaman detail.

Perubahan status/data disimpan sementara di memori (React Context) selama
sesi berjalan, sehingga aksi seperti "Setujui Kunjungan", "Daftarkan
Kunjungan", atau pengajuan lewat Portal Tamu langsung terlihat efeknya di
seluruh halaman — namun akan kembali ke data awal saat halaman di-refresh,
karena memang belum ada backend. Surat kunjungan yang diunggah tamu
disimpan sebagai object URL browser (`URL.createObjectURL`) sehingga bisa
langsung dibuka petugas selama sesi yang sama.

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
│   ├── layout/        # Sidebar, Header, AppLayout, PortalLayout
│   ├── kunjungan/      # StatusTimeline (dipakai sisi staf & Portal Tamu)
│   └── ui/             # Komponen dasar: Button, Badge, Avatar, Field,
│                        # FileDropzone, Stepper, dll.
├── context/            # State kunjungan di memori (KunjunganContext)
├── lib/                 # Data dummy, konstanta status, helper tanggal/file
└── pages/
    ├── Dashboard.jsx, KunjunganList.jsx, KunjunganDetail.jsx,
    │   KunjunganForm.jsx, Agenda.jsx   # Sisi staf (di dalam AppLayout)
    └── portal/          # Sisi tamu: PortalHome, PortalForm, PortalSuccess,
                          # PortalStatus (di dalam PortalLayout)
```
