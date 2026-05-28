import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ListingFormValues } from '@/lib/dashboard/listing-schema'
import { formatCurrency } from '@/lib/utils'

interface Props {
  form: UseFormReturn<ListingFormValues>
  onBlurAny: () => void
}

export function PricingStep({ form, onBlurAny }: Props) {
  const { register, watch, formState: { errors } } = form
  const price = watch('price')
  const marketPrice = watch('market_price')

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label>Harga jual (Rp)</Label>
        <Input
          type="number"
          {...register('price', { valueAsNumber: true })}
          onBlur={onBlurAny}
          placeholder="145000000"
        />
        {price ? (
          <p className="text-xs text-muted-foreground">{formatCurrency(price)}</p>
        ) : null}
        {errors.price && (
          <p className="text-xs text-destructive">{errors.price.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Harga pasar (Rp, opsional)</Label>
        <Input
          type="number"
          {...register('market_price', { valueAsNumber: true })}
          onBlur={onBlurAny}
          placeholder="155000000"
        />
        {marketPrice ? (
          <p className="text-xs text-muted-foreground">
            {formatCurrency(marketPrice)}
          </p>
        ) : null}
        {errors.market_price && (
          <p className="text-xs text-destructive">{errors.market_price.message}</p>
        )}
      </div>
    </div>
  )
}
