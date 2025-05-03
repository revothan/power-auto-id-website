import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car } from '@/types/supabase'
import { formatCurrency } from '@/lib/utils'
import { optimizeImage } from '@/lib/image-utils'
import { Car as CarIcon, Fuel, Calendar, Gauge, Tag } from 'lucide-react'
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
  const [imageSrc, setImageSrc] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  // Preload and optimize image
  useEffect(() => {
    if (car.title_image) {
      // Generate thumbnail for card view (smaller, optimized)
      const optimizedImage = optimizeImage(car.title_image, 400, 225, 80)
      setImageSrc(optimizedImage)
      
      // Preload larger image for better experience when navigating to detail page
      const img = new Image()
      img.src = optimizeImage(car.title_image, 800, 450)
      
      setIsLoading(false)
    }
  }, [car.title_image])

  // Translations for fuel types
  const fuelTypeMap = {
    gasoline: 'Bensin',
    diesel: 'Solar',
    electric: 'Listrik',
    hybrid: 'Hybrid',
  }

  // Format transmission
  const formattedTransmission = car.transmission === 'automatic' ? 'Otomatis' : 'Manual'

  // Calculate discount percentage if market price exists
  const discountPercentage = car.market_price && car.market_price > car.price
    ? Math.round(((car.market_price - car.price) / car.market_price) * 100)
    : 0

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Image container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-200">
        <Link to={`/cars/${car.slug}`}>
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            </div>
          ) : (
            <img
              src={imageSrc}
              alt={`${car.year} ${car.make} ${car.model}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          )}
        </Link>
        
        {/* Discount tag */}
        {discountPercentage > 0 && !car.sold && (
          <div className="absolute left-0 top-0 m-2 rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white">
            {discountPercentage}% OFF
          </div>
        )}
        
        {car.sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="transform rotate-12 bg-primary px-6 py-2 text-lg font-bold text-white">
              TERJUAL
            </span>
          </div>
        )}
      </div>

      <CardHeader className="flex-none px-4 pb-0 pt-4">
        <div>
          <Link 
            to={`/cars/${car.slug}`}
            className="line-clamp-2 min-h-[3.5rem] block text-xl font-bold leading-tight hover:text-primary"
          >
            {car.year} {car.make} {car.model}
          </Link>
        </div>
      </CardHeader>

      {/* Price section separated from title */}
      <div className="flex-none px-4 py-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <div className="flex flex-col">
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
        </div>
      </div>

      <CardContent className="flex-grow px-4 pb-2 pt-0">
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

      <CardFooter className="flex-none flex gap-2 px-4 pb-4">
        <Button asChild className="flex-1">
          <Link to={`/cars/${car.slug}`}>
            Detail
          </Link>
        </Button>
        <Button 
          asChild 
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <a href={`https://wa.me/628119288855?text=Halo,%20saya%20tertarik%20dengan%20${car.year}%20${car.make}%20${car.model}`} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}