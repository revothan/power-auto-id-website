import { Check } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  COMMON_FEATURES,
  ListingFormValues,
} from '@/lib/dashboard/listing-schema'
import { cn } from '@/lib/utils'

interface Props {
  form: UseFormReturn<ListingFormValues>
  onBlurAny: () => void
}

export function DescriptionStep({ form, onBlurAny }: Props) {
  const { register, watch, setValue, formState: { errors } } = form
  const features = watch('features') ?? []

  const toggle = (label: string) => {
    const set = new Set(features)
    if (set.has(label)) set.delete(label)
    else set.add(label)
    setValue('features', Array.from(set), { shouldDirty: true })
    onBlurAny()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <Label>Deskripsi</Label>
        <Textarea
          {...register('description')}
          onBlur={onBlurAny}
          rows={6}
          placeholder="Tulis kondisi unit, history pemakaian, fitur unggulan, dsb."
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Fitur</Label>
        <p className="text-xs text-muted-foreground">
          Klik untuk pilih fitur yang dimiliki unit.
        </p>
        <div className="flex flex-wrap gap-2">
          {COMMON_FEATURES.map((label) => {
            const active = features.includes(label)
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggle(label)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors',
                  active
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-input text-muted-foreground hover:bg-muted',
                )}
              >
                {active && <Check className="h-3 w-3" />}
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
