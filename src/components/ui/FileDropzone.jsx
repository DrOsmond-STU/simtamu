import { useRef, useState } from 'react'
import { FileText, Upload, X } from 'lucide-react'
import { cn, formatFileSize } from '../../lib/utils'

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
const ACCEPTED_LABEL = 'PDF, JPG, atau PNG'
const MAX_SIZE = 5 * 1024 * 1024

export default function FileDropzone({ file, onChange, error }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [localError, setLocalError] = useState('')

  function validateAndSet(selected) {
    if (!selected) return
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setLocalError(`Format file tidak didukung. Gunakan ${ACCEPTED_LABEL}.`)
      return
    }
    if (selected.size > MAX_SIZE) {
      setLocalError('Ukuran file maksimal 5MB.')
      return
    }
    setLocalError('')
    onChange(selected)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    validateAndSet(e.dataTransfer.files?.[0])
  }

  const shownError = error || localError

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
          <FileText className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
          <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          aria-label="Hapus file"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors',
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100',
          shownError && 'border-rose-300 bg-rose-50',
        )}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
          <Upload className="h-5 w-5" />
        </span>
        <p className="text-sm font-medium text-slate-700">Klik untuk unggah atau seret file ke sini</p>
        <p className="text-xs text-slate-400">{ACCEPTED_LABEL} &middot; maks. 5MB</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => validateAndSet(e.target.files?.[0])}
        />
      </div>
      {shownError && <p className="mt-1.5 text-xs text-rose-600">{shownError}</p>}
    </div>
  )
}
