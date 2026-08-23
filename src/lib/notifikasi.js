// Generator pesan notifikasi. Ini adalah PROTOTIPE front-end — tidak ada
// email/SMS yang sungguhan terkirim. Setiap peristiwa pada kunjungan
// menghasilkan entri di sini, dipakai untuk menampilkan bukti bahwa tamu
// maupun pejabat yang dituju "diberi tahu" pada momen yang tepat (lonceng
// notifikasi petugas, dan riwayat notifikasi di halaman detail/cek status).

import { STATUS } from './status'

let seq = 0

function buat({ kunjunganId, target, targetNama, pesan, channel, jenis = 'info' }) {
  seq += 1
  return {
    id: `NTF-${seq}`,
    kunjunganId,
    waktu: new Date(),
    target,
    targetNama,
    pesan,
    channel,
    jenis,
    dibaca: false,
  }
}

export function notifikasiPengajuanBaru(record) {
  return [
    buat({
      kunjunganId: record.id,
      target: 'tamu',
      targetNama: record.nama,
      pesan: 'Pengajuan kunjungan Anda telah diterima dan sedang menunggu konfirmasi petugas.',
      channel: 'email',
    }),
    buat({
      kunjunganId: record.id,
      target: 'pejabat',
      targetNama: record.pejabat.nama,
      pesan: `Pengajuan kunjungan baru dari ${record.nama} (${record.instansi}) menunggu konfirmasi Anda.`,
      channel: 'email',
      jenis: 'baru',
    }),
  ]
}

export function notifikasiPerubahanStatus(record, status, catatan) {
  const nama = record.nama
  const pejabat = record.pejabat.nama

  if (status === STATUS.DISETUJUI) {
    return [
      buat({
        kunjunganId: record.id,
        target: 'tamu',
        targetNama: nama,
        pesan: `Kunjungan Anda ke ${pejabat} telah disetujui. Silakan datang sesuai jadwal.`,
        channel: 'email+sms',
      }),
    ]
  }

  if (status === STATUS.DITOLAK) {
    return [
      buat({
        kunjunganId: record.id,
        target: 'tamu',
        targetNama: nama,
        pesan: `Mohon maaf, pengajuan kunjungan Anda ditolak.${catatan ? ` Alasan: ${catatan}` : ''}`,
        channel: 'email+sms',
      }),
    ]
  }

  if (status === STATUS.BERLANGSUNG) {
    return [
      buat({
        kunjunganId: record.id,
        target: 'pejabat',
        targetNama: pejabat,
        pesan: `${nama} telah check-in dan menuju ke lokasi Anda.`,
        channel: 'sistem',
        jenis: 'checkin',
      }),
    ]
  }

  if (status === STATUS.DIBATALKAN) {
    return [
      buat({
        kunjunganId: record.id,
        target: 'tamu',
        targetNama: nama,
        pesan: `Kunjungan Anda dibatalkan.${catatan ? ` Keterangan: ${catatan}` : ''}`,
        channel: 'email+sms',
      }),
      buat({
        kunjunganId: record.id,
        target: 'pejabat',
        targetNama: pejabat,
        pesan: `Kunjungan dari ${nama} yang terjadwal untuk Anda telah dibatalkan.`,
        channel: 'sistem',
      }),
    ]
  }

  if (status === STATUS.SELESAI) {
    return [
      buat({
        kunjunganId: record.id,
        target: 'tamu',
        targetNama: nama,
        pesan: 'Terima kasih telah berkunjung. Sampai jumpa kembali.',
        channel: 'sistem',
      }),
    ]
  }

  return []
}

export const CHANNEL_LABEL = {
  email: 'Email',
  'email+sms': 'Email & SMS',
  sistem: 'Sistem',
}
