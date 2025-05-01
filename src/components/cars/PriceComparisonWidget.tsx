import { formatCurrency } from '@/lib/utils'
import { TrendingDown } from 'lucide-react'

interface PriceComparisonWidgetProps {
  price: number
  marketPrice: number | null
}

export default function PriceComparisonWidget({
  price,
  marketPrice,
}: PriceComparisonWidgetProps) {
  // If no market price is available, we can't show a comparison
  if (!marketPrice || marketPrice <= price) {
    return null
  }

  const difference = marketPrice - price
  const percentageSavings = ((difference / marketPrice) * 100).toFixed(0)

  return (
    <div className="rounded-lg bg-gradient-to-r from-primary to-red-700 p-4 text-white shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Bandingkan Harga</h3>
        <TrendingDown className="h-6 w-6" />
      </div>
      
      <div className="mb-2 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs opacity-90">Harga Kami</p>
          <p className="text-xl font-bold">{formatCurrency(price)}</p>
        </div>
        <div>
          <p className="text-xs opacity-90">Harga Pasar</p>
          <p className="text-xl font-bold line-through opacity-80">
            {formatCurrency(marketPrice)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between rounded-md bg-white/10 p-3">
        <div>
          <p className="text-sm">Anda Hemat:</p>
          <p className="text-lg font-bold">{formatCurrency(difference)}</p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl font-bold text-primary">
          {percentageSavings}%
        </div>
      </div>
      
      <div className="mt-2 text-center text-sm font-semibold">
        TERMURAH SE-INDONESIA!
      </div>
    </div>
  )
}
