import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ListingFormValues } from '@/lib/dashboard/listing-schema'

interface Props {
  form: UseFormReturn<ListingFormValues>
  onBlurAny: () => void
}

const SELECT_CLASS =
  'h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export function SpecsStep({ form, onBlurAny }: Props) {
  const { register, formState: { errors } } = form

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Brand" error={errors.make?.message}>
        <Input {...register('make')} onBlur={onBlurAny} placeholder="Toyota" />
      </Field>
      <Field label="Model" error={errors.model?.message}>
        <Input {...register('model')} onBlur={onBlurAny} placeholder="Calya" />
      </Field>
      <Field label="Tahun" error={errors.year?.message}>
        <Input
          type="number"
          {...register('year', { valueAsNumber: true })}
          onBlur={onBlurAny}
          placeholder="2021"
        />
      </Field>
      <Field label="Warna" error={errors.color?.message}>
        <Input {...register('color')} onBlur={onBlurAny} placeholder="Silver" />
      </Field>

      <Field label="Transmisi" error={errors.transmission?.message}>
        <select {...register('transmission')} onBlur={onBlurAny} className={SELECT_CLASS}>
          <option value="">— pilih —</option>
          <option value="manual">Manual</option>
          <option value="automatic">Automatic</option>
        </select>
      </Field>
      <Field label="Bahan bakar" error={errors.fuel_type?.message}>
        <select {...register('fuel_type')} onBlur={onBlurAny} className={SELECT_CLASS}>
          <option value="">— pilih —</option>
          <option value="gasoline">Bensin</option>
          <option value="diesel">Diesel</option>
          <option value="electric">Listrik</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </Field>

      <Field label="Kilometer" error={errors.mileage?.message}>
        <Input
          type="number"
          {...register('mileage', { valueAsNumber: true })}
          onBlur={onBlurAny}
          placeholder="45000"
        />
      </Field>
      <Field label="Kondisi" error={errors.condition?.message}>
        <select {...register('condition')} onBlur={onBlurAny} className={SELECT_CLASS}>
          <option value="">— pilih —</option>
          <option value="excellent">Sangat baik</option>
          <option value="good">Baik</option>
          <option value="fair">Cukup</option>
        </select>
      </Field>

      <Field label="Engine (cc)" error={errors.engine_size?.message}>
        <Input
          type="number"
          {...register('engine_size', { valueAsNumber: true })}
          onBlur={onBlurAny}
          placeholder="1200"
        />
      </Field>
      <Field label="Tenaga (hp)" error={errors.power?.message}>
        <Input
          type="number"
          {...register('power', { valueAsNumber: true })}
          onBlur={onBlurAny}
          placeholder="88"
        />
      </Field>

      <Field label="Jumlah kursi" error={errors.seats?.message}>
        <Input
          type="number"
          {...register('seats', { valueAsNumber: true })}
          onBlur={onBlurAny}
          placeholder="7"
        />
      </Field>
      <Field label="Jumlah pintu" error={errors.doors?.message}>
        <Input
          type="number"
          {...register('doors', { valueAsNumber: true })}
          onBlur={onBlurAny}
          placeholder="5"
        />
      </Field>

      <Field label="VIN" error={errors.vin?.message}>
        <Input {...register('vin')} onBlur={onBlurAny} placeholder="JT123…" />
      </Field>
      <Field label="Plat nomor" error={errors.plate_number?.message}>
        <Input
          {...register('plate_number')}
          onBlur={onBlurAny}
          placeholder="B 1234 ABC"
        />
      </Field>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
