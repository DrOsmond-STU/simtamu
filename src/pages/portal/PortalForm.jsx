import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Send } from 'lucide-react'
import { useKunjungan } from '../../context/KunjunganContext'
import { PEJABAT, SUMBER, TUJUAN_OPTIONS } from '../../lib/dummyData'
import { STATUS } from '../../lib/status'
import { addDays, cn, combineDateTime, formatDate, formatTime, toDateKey } from '../../lib/utils'
import Field, { inputClass, inputErrorClass } from '../../components/ui/Field'
import Button from '../../components/ui/Button'
import Stepper from '../../components/ui/Stepper'
import FileDropzone from '../../components/ui/FileDropzone'

const STEPS = ['Data Diri', 'Jadwal Kunjungan', 'Surat Kunjungan', 'Tinjau & Kirim']
const MIN_DATE = toDateKey(addDays(new Date(), 1))

function emptyForm() {
  return {
    nama: '',
    instansi: '',
    jabatanTamu: '',
    telepon: '',
    email: '',
    rombongan: 1,
    pejabatId: '',
    tujuan: '',
    keterangan: '',
    tanggal: MIN_DATE,
    jamMulai: '09:00',
    jamSelesai: '10:00',
  }
}

export default function PortalForm() {
  const navigate = useNavigate()
  const { addKunjungan } = useKunjungan()

  const [step, setStep] = useState(1)
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState(null)
  const [setuju, setSetuju] = useState(false)
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validateStep1() {
    const next = {}
    if (!form.nama.trim()) next.nama = 'Nama lengkap wajib diisi.'
    if (!form.instansi.trim()) next.instansi = 'Instansi/organisasi wajib diisi.'
    if (!form.telepon.trim()) next.telepon = 'Nomor telepon wajib diisi.'
    if (!form.email.trim()) next.email = 'Email wajib diisi untuk konfirmasi.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Format email tidak valid.'
    if (Number(form.rombongan) < 1) next.rombongan = 'Jumlah rombongan minimal 1 orang.'
    return next
  }

  function validateStep2() {
    const next = {}
    if (!form.pejabatId) next.pejabatId = 'Pilih pejabat/unit yang dituju.'
    if (!form.tujuan.trim()) next.tujuan = 'Tujuan kunjungan wajib diisi.'
    if (!form.tanggal) next.tanggal = 'Tanggal kunjungan wajib diisi.'
    else if (form.tanggal < MIN_DATE) next.tanggal = 'Ajukan minimal 1 hari sebelum tanggal kunjungan.'
    if (!form.jamMulai) next.jamMulai = 'Jam mulai wajib diisi.'
    if (!form.jamSelesai) next.jamSelesai = 'Jam selesai wajib diisi.'
    if (form.jamMulai && form.jamSelesai && form.jamSelesai <= form.jamMulai) {
      next.jamSelesai = 'Jam selesai harus setelah jam mulai.'
    }
    return next
  }

  function handleNext() {
    const stepErrors = step === 1 ? validateStep1() : step === 2 ? validateStep2() : {}
    setErrors(stepErrors)
    if (Object.keys(stepErrors).length > 0) return
    setStep((s) => Math.min(STEPS.length, s + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBack() {
    setStep((s) => Math.max(1, s - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleSubmit() {
    const next = {}
    if (!file) next.file = 'Surat kunjungan wajib diunggah sebelum mengirim pengajuan.'
    if (!setuju) next.setuju = 'Anda harus menyatakan bahwa data yang diisi sudah benar.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const pejabat = PEJABAT.find((p) => p.id === form.pejabatId)
    const mulai = combineDateTime(form.tanggal, form.jamMulai)
    const selesai = combineDateTime(form.tanggal, form.jamSelesai)

    const record = addKunjungan({
      nama: form.nama.trim(),
      instansi: form.instansi.trim(),
      jabatanTamu: form.jabatanTamu.trim(),
      telepon: form.telepon.trim(),
      email: form.email.trim(),
      rombongan: Number(form.rombongan) || 1,
      tujuan: form.tujuan.trim(),
      keterangan: form.keterangan.trim(),
      pejabat,
      lokasi: 'Menunggu penentuan petugas',
      mulai,
      selesai,
      status: STATUS.MENUNGGU,
      catatanPetugas: '',
      dibuatPada: new Date(),
      sumber: SUMBER.MANDIRI,
      suratKunjungan: {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      },
    })

    navigate(`/portal/sukses/${record.id}`)
  }

  const pejabatTerpilih = PEJABAT.find((p) => p.id === form.pejabatId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Formulir Pengajuan Kunjungan</h1>
        <p className="text-sm text-slate-500">
          Lengkapi setiap langkah berikut. Anda bisa kembali ke langkah sebelumnya kapan saja.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <Stepper steps={STEPS} current={step} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">Data Diri & Instansi</h2>
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
              <Field label="Jabatan" htmlFor="jabatanTamu">
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
              <Field
                label="Email"
                htmlFor="email"
                required
                error={errors.email}
                hint="Konfirmasi persetujuan akan dikirim ke email ini"
              >
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="nama@instansi.co.id"
                  className={cn(inputClass, errors.email && inputErrorClass)}
                />
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">Jadwal & Tujuan Kunjungan</h2>
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
              <Field
                label="Pejabat / Unit yang Dituju"
                htmlFor="pejabatId"
                required
                error={errors.pejabatId}
                className="sm:col-span-2"
              >
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
              <Field label="Tanggal Kunjungan" htmlFor="tanggal" required error={errors.tanggal}>
                <input
                  id="tanggal"
                  type="date"
                  min={MIN_DATE}
                  value={form.tanggal}
                  onChange={(e) => set('tanggal', e.target.value)}
                  className={cn(inputClass, errors.tanggal && inputErrorClass)}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
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
            <p className="rounded-lg bg-blue-50 px-3.5 py-3 text-xs leading-relaxed text-blue-700">
              Jadwal yang Anda usulkan akan ditinjau oleh petugas. Lokasi/ruangan kunjungan akan
              ditentukan saat pengajuan disetujui.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-900">Unggah Surat Kunjungan</h2>
            <p className="text-sm text-slate-500">
              Lampirkan surat permohonan kunjungan resmi dari instansi Anda sebagai syarat
              pengajuan.
            </p>
            <FileDropzone file={file} onChange={setFile} error={errors.file} />
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-slate-900">Tinjau Sebelum Mengirim</h2>

            <div className="grid grid-cols-1 gap-4 rounded-lg bg-slate-50 p-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-400">Nama Lengkap</p>
                <p className="font-medium text-slate-800">{form.nama || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Instansi</p>
                <p className="font-medium text-slate-800">{form.instansi || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Telepon</p>
                <p className="font-medium text-slate-800">{form.telepon || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <p className="font-medium text-slate-800">{form.email || '—'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-slate-400">Tujuan Kunjungan</p>
                <p className="font-medium text-slate-800">{form.tujuan || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Pejabat / Unit Dituju</p>
                <p className="font-medium text-slate-800">
                  {pejabatTerpilih ? `${pejabatTerpilih.nama} — ${pejabatTerpilih.unit}` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Jadwal Diusulkan</p>
                <p className="font-medium text-slate-800">
                  {form.tanggal ? formatDate(form.tanggal) : '—'}, {formatTime(combineDateTime(form.tanggal, form.jamMulai))}–
                  {formatTime(combineDateTime(form.tanggal, form.jamSelesai))} WIB
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Jumlah Rombongan</p>
                <p className="font-medium text-slate-800">{form.rombongan} orang</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Surat Kunjungan</p>
                <p className="font-medium text-slate-800">{file ? file.name : 'Belum diunggah'}</p>
              </div>
            </div>

            <label className="flex items-start gap-2.5 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={setuju}
                onChange={(e) => {
                  setSetuju(e.target.checked)
                  setErrors((prev) => ({ ...prev, setuju: undefined }))
                }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Saya menyatakan bahwa data yang saya isi di atas benar dan dapat
              dipertanggungjawabkan.
            </label>
            {errors.setuju && <p className="text-xs text-rose-600">{errors.setuju}</p>}
            {errors.file && <p className="text-xs text-rose-600">{errors.file}</p>}
          </div>
        )}
      </div>

      <div className="flex justify-between gap-3">
        <Button type="button" variant="secondary" onClick={handleBack} disabled={step === 1}>
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        {step < STEPS.length ? (
          <Button type="button" variant="primary" onClick={handleNext}>
            Lanjut
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" variant="primary" onClick={handleSubmit}>
            <Send className="h-4 w-4" />
            Kirim Pengajuan
          </Button>
        )}
      </div>
    </div>
  )
}
