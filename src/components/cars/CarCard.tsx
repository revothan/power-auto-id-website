import { Link } from 'react-router-dom'
import { Car } from '@/types/supabase'
import { formatCurrency } from '@/lib/utils'
import { Car as CarIcon, Fuel, Calendar, Gauge } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface CarCardProps {
  car: Car
}

export default function CarCard({ car }: CarCardProps) {
  // Translations for fuel types
  const fuelTypeMap = {
    gasoline: 'Bensin',
    diesel: 'Solar',
    electric: 'Listrik',
    hybrid: 'Hybrid',
  }

  // Format transmission
  const formattedTransmission = car.transmission === 'automatic' ? 'Otomatis' : 'Manual'

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Image container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Link to={`/cars/${car.slug}`}>
          <img
            src={car.title_image}
            alt={`${car.year} ${car.make} ${car.model}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {car.sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="transform rotate-12 bg-primary px-6 py-2 text-lg font-bold text-white">
              TERJUAL
            </span>
          </div>
        )}
      </div>

      <CardHeader className="px-4 pb-0 pt-4">
        <div className="space-y-1">
          <Link 
            to={`/cars/${car.slug}`}
            className="line-clamp-1 block text-xl font-bold leading-tight hover:text-primary"
          >
            {car.year} {car.make} {car.model}
          </Link>
          <div className="flex justify-between">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(car.price)}
            </span>
            {car.market_price && car.market_price > car.price && (
              <span className="text-sm line-through text-gray-500">
                {formatCurrency(car.market_price)}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center text-sm">
            <CarIcon className="mr-1 h-4 w-4 text-gray-500" />
            <span>{formattedTransmission}</span>
          </div>
          <div className="flex items-center text-sm">
            <Fuel className="mr-1 h-4 w-4 text-gray-500" />
            <span>{fuelTypeMap[car.fuel_type]}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="mr-1 h-4 w-4 text-gray-500" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center text-sm">
            <Gauge className="mr-1 h-4 w-4 text-gray-500" />
            <span>{car.mileage.toLocaleString()} km</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 px-4 pb-4">
        <Button asChild className="flex-1">
          <Link to={`/cars/${car.slug}`}>
            Detail
          </Link>
        </Button>
        <Button asChild variant="secondary" className="flex-1">
          <a href={`https://wa.me/628119288855?text=Halo,%20saya%20tertarik%20dengan%20${car.year}%20${car.make}%20${car.model}`} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
