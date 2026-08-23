import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Save, Ticket, X } from 'lucide-react'
import { useKunjungan } from '../context/KunjunganContext'
import { LOKASI_LIST, PEJABAT, TUJUAN_OPTIONS } from '../lib/dummyData'
import { STATUS } from '../lib/status'
import { cn, combineDateTime, toDateKey, toTimeInputValue } from '../lib/utils'
import Field, { inputClass, inputErrorClass } from '../components/ui/Field'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'

function emptyForm(prefillDate) {
  return {
    nama: '',
    instansi: '',
    jabatanTamu: '',
    telepon: '',
    email: '',
    rombongan: 1,
    tujuan: '',
    keterangan: '',
    pejabatId: '',
    lokasi: LOKASI_LIST[0],
    tanggal: prefillDate || toDateKey(new Date()),
    jamMulai: '09:00',
    jamSelesai: '10:00',
  }
}

function recordToForm(record) {
  return {
    nama: record.nama,
    instansi: record.instansi,
    jabatanTamu: record.jabatanTamu,
    telepon: record.telepon,
    email: record.email,
    rombongan: record.rombongan,
    tujuan: record.tujuan,
    keterangan: record.keterangan,
    pejabatId: record.pejabat.id,
    lokasi: record.lokasi,
    tanggal: toDateKey(record.mulai),
    jamMulai: toTimeInputValue(record.mulai),
    jamSelesai: toTimeInputValue(record.selesai),
  }
}

let localSequence = 1000

export default function KunjunganForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { data, addKunjungan, updateKunjungan } = useKunjungan()
  const isEdit = Boolean(id)
  const existing = isEdit ? data.find((k) => k.id === id) : null

  const [form, setForm] = useState(() =>
    existing ? recordToForm(existing) : emptyForm(searchParams.get('tanggal')),
  )
  const [errors, setErrors] = useState({})

  if (isEdit && !existing) {
    return (
      <EmptyState
        icon={Ticket}
        title="Kunjungan tidak ditemukan"
        description={`Data dengan kode "${id}" tidak tersedia atau sudah dihapus.`}
        action={
          <Link to="/kunjungan" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            &larr; Kembali ke daftar kunjungan
          </Link>
        }
      />
    )
  }

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate() {
    const next = {}
    if (!form.nama.trim()) next.nama = 'Nama tamu wajib diisi.'
    if (!form.instansi.trim()) next.instansi = 'Instansi/organisasi wajib diisi.'
    if (!form.telepon.trim()) next.telepon = 'Nomor telepon wajib diisi.'
    if (!form.tujuan.trim()) next.tujuan = 'Tujuan kunjungan wajib diisi.'
    if (!form.pejabatId) next.pejabatId = 'Pilih pejabat/unit yang dituju.'
    if (!form.tanggal) next.tanggal = 'Tanggal kunjungan wajib diisi.'
    if (!form.jamMulai) next.jamMulai = 'Jam mulai wajib diisi.'
    if (!form.jamSelesai) next.jamSelesai = 'Jam selesai wajib diisi.'
    if (form.jamMulai && form.jamSelesai && form.jamSelesai <= form.jamMulai) {
      next.jamSelesai = 'Jam selesai harus setelah jam mulai.'
    }
    if (Number(form.rombongan) < 1) next.rombongan = 'Jumlah rombongan minimal 1 orang.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    const pejabat = PEJABAT.find((p) => p.id === form.pejabatId)
    const mulai = combineDateTime(form.tanggal, form.jamMulai)
    const selesai = combineDateTime(form.tanggal, form.jamSelesai)
    const shared = {
      nama: form.nama.trim(),
      instansi: form.instansi.trim(),
      jabatanTamu: form.jabatanTamu.trim(),
      telepon: form.telepon.trim(),
      email: form.email.trim(),
      rombongan: Number(form.rombongan) || 1,
      tujuan: form.tujuan.trim(),
      keterangan: form.keterangan.trim(),
      pejabat,
      lokasi: form.lokasi,
      mulai,
      selesai,
    }

    if (isEdit) {
      updateKunjungan(existing.id, shared)
      navigate(`/kunjungan/${existing.id}`)
    } else {
      localSequence += 1
      const record = {
        id: `KJG-2026-${String(localSequence).padStart(4, '0')}`,
        ...shared,
        status: STATUS.MENUNGGU,
        catatanPetugas: '',
        dibuatPada: new Date(),
      }
      addKunjungan(record)
      navigate(`/kunjungan/${record.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-10">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          {isEdit ? 'Ubah Data Kunjungan' : 'Daftarkan Kunjungan Baru'}
        </h2>
        <p className="text-sm text-slate-500">
          {isEdit
            ? `Perbarui informasi kunjungan ${existing.id}.`
            : 'Lengkapi formulir berikut untuk mendaftarkan kunjungan tamu.'}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Data Tamu</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nama Lengkap" htmlFor="nama" required error={errors.nama}>
            <input
              id="nama"
              type="text"
              value={form.nama}
              onChange={(e) => set('nama', e.target.value)}
              placeholder="cth. Agus Prasetyo"
              className={cn(inputClass, errors.nama && inputErrorClass)}
            />
          </Field>
          <Field label="Instansi / Organisasi" htmlFor="instansi" required error={errors.instansi}>
            <input
              id="instansi"
              type="text"
              value={form.instansi}
              onChange={(e) => set('instansi', e.target.value)}
              placeholder="cth. PT Sinergi Cipta Karya"
              className={cn(inputClass, errors.instansi && inputErrorClass)}
            />
          </Field>
          <Field label="Jabatan Tamu" htmlFor="jabatanTamu">
            <input
              id="jabatanTamu"
              type="text"
              value={form.jabatanTamu}
              onChange={(e) => set('jabatanTamu', e.target.value)}
              placeholder="cth. Manajer Proyek"
              className={inputClass}
            />
          </Field>
          <Field label="Jumlah Rombongan" htmlFor="rombongan" required error={errors.rombongan}>
            <input
              id="rombongan"
              type="number"
              min={1}
              value={form.rombongan}
              onChange={(e) => set('rombongan', e.target.value)}
              className={cn(inputClass, errors.rombongan && inputErrorClass)}
            />
          </Field>
          <Field label="Nomor Telepon" htmlFor="telepon" required error={errors.telepon}>
            <input
              id="telepon"
              type="tel"
              value={form.telepon}
              onChange={(e) => set('telepon', e.target.value)}
              placeholder="08xx-xxxx-xxxx"
              className={cn(inputClass, errors.telepon && inputErrorClass)}
            />
          </Field>
          <Field label="Email" htmlFor="email" hint="Opsional, untuk konfirmasi via email">
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="nama@instansi.co.id"
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Detail Kunjungan</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Tujuan Kunjungan"
            htmlFor="tujuan"
            required
            error={errors.tujuan}
            className="sm:col-span-2"
          >
            <input
              id="tujuan"
              list="tujuan-options"
              type="text"
              value={form.tujuan}
              onChange={(e) => set('tujuan', e.target.value)}
              placeholder="cth. Audiensi kerja sama proyek"
              className={cn(inputClass, errors.tujuan && inputErrorClass)}
            />
            <datalist id="tujuan-options">
              {TUJUAN_OPTIONS.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </Field>
          <Field label="Keterangan Tambahan" htmlFor="keterangan" className="sm:col-span-2">
            <textarea
              id="keterangan"
              rows={3}
              value={form.keterangan}
              onChange={(e) => set('keterangan', e.target.value)}
              placeholder="Detail tambahan seputar agenda kunjungan"
              className={inputClass}
            />
          </Field>
          <Field label="Pejabat / Unit Dituju" htmlFor="pejabatId" required error={errors.pejabatId}>
            <select
              id="pejabatId"
              value={form.pejabatId}
              onChange={(e) => set('pejabatId', e.target.value)}
              className={cn(inputClass, errors.pejabatId && inputErrorClass)}
            >
              <option value="">Pilih pejabat/unit...</option>
              {PEJABAT.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama} — {p.unit}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Lokasi / Ruangan" htmlFor="lokasi">
            <select
              id="lokasi"
              value={form.lokasi}
              onChange={(e) => set('lokasi', e.target.value)}
              className={inputClass}
            >
              {LOKASI_LIST.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Jadwal Kunjungan</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Tanggal" htmlFor="tanggal" required error={errors.tanggal}>
            <input
              id="tanggal"
              type="date"
              value={form.tanggal}
              onChange={(e) => set('tanggal', e.target.value)}
              className={cn(inputClass, errors.tanggal && inputErrorClass)}
            />
          </Field>
          <Field label="Jam Mulai" htmlFor="jamMulai" required error={errors.jamMulai}>
            <input
              id="jamMulai"
              type="time"
              value={form.jamMulai}
              onChange={(e) => set('jamMulai', e.target.value)}
              className={cn(inputClass, errors.jamMulai && inputErrorClass)}
            />
          </Field>
          <Field label="Jam Selesai" htmlFor="jamSelesai" required error={errors.jamSelesai}>
            <input
              id="jamSelesai"
              type="time"
              value={form.jamSelesai}
              onChange={(e) => set('jamSelesai', e.target.value)}
              className={cn(inputClass, errors.jamSelesai && inputErrorClass)}
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          <X className="h-4 w-4" />
          Batal
        </Button>
        <Button type="submit" variant="primary">
          <Save className="h-4 w-4" />
          {isEdit ? 'Simpan Perubahan' : 'Daftarkan Kunjungan'}
        </Button>
      </div>
    </form>
  )
}
