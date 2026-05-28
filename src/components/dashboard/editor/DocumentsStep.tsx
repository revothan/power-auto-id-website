import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ListingFormValues } from '@/lib/dashboard/listing-schema'

interface Props {
  form: UseFormReturn<ListingFormValues>
  onBlurAny: () => void
}

export function DocumentsStep({ form, onBlurAny }: Props) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Pemegang STNK</Label>
          <Input
            {...register('stnk_holder_name')}
            onBlur={onBlurAny}
            placeholder="Nama sesuai STNK"
          />
          {errors.stnk_holder_name && (
            <p className="text-xs text-destructive">
              {errors.stnk_holder_name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Pemegang BPKB</Label>
          <Input
            {...register('bpkb_holder_name')}
            onBlur={onBlurAny}
            placeholder="Nama sesuai BPKB"
          />
          {errors.bpkb_holder_name && (
            <p className="text-xs text-destructive">
              {errors.bpkb_holder_name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Tanggal jatuh tempo pajak</Label>
          <Input
            type="date"
            {...register('tax_due_date')}
            onBlur={onBlurAny}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Riwayat servis</Label>
        <Textarea
          {...register('service_history')}
          onBlur={onBlurAny}
          rows={4}
          placeholder="Servis berkala di bengkel resmi, ganti oli terakhir 5.000km lalu, dsb."
        />
      </div>
    </div>
  )
}
