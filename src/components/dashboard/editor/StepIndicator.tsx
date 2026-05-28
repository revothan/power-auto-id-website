import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const STEP_LABELS = [
  'Spesifikasi',
  'Harga',
  'Deskripsi',
  'Dokumen',
  'Foto',
  'Lokasi & PIC',
] as const

export function StepIndicator({
  current,
  onJump,
}: {
  current: number
  onJump: (n: number) => void
}) {
  return (
    <ol className="flex flex-wrap gap-2">
      {STEP_LABELS.map((label, i) => {
        const isCurrent = i === current
        const isDone = i < current
        return (
          <li key={label}>
            <button
              type="button"
              onClick={() => onJump(i)}
              className={cn(
                'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                isCurrent && 'border-primary bg-primary text-primary-foreground',
                isDone && !isCurrent && 'border-emerald-300 bg-emerald-50 text-emerald-700',
                !isCurrent && !isDone && 'border-input text-muted-foreground hover:bg-muted',
              )}
            >
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-[10px]',
                  isCurrent && 'bg-primary-foreground/20',
                  isDone && !isCurrent && 'bg-emerald-200 text-emerald-800',
                  !isCurrent && !isDone && 'bg-muted',
                )}
              >
                {isDone ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              {label}
            </button>
          </li>
        )
      })}
    </ol>
  )
}
