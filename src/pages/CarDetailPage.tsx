import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useCars } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CarImageGallery from '@/components/cars/CarImageGallery'
import CarBenefits from '@/components/cars/CarBenefits'
import PriceComparisonWidget from '@/components/cars/PriceComparisonWidget'
import CarCallToAction from '@/components/cars/CarCallToAction'
import CarCard from '@/components/cars/CarCard'

export default function CarDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  // Use React Query to fetch car details with caching
  const { data: carData, isLoading: carLoading } = useCars(1, 0, { slug })
  
  const car = useMemo(() => {
    if (!carData?.data || carData.data.length === 0) {
      return null
    }
    return carData.data[0]
  }, [carData])

  // Use React Query to fetch similar cars only when we have car data
  const similarFilters = car ? { make: car.make, sold: false, exclude_id: car.id } : {}
  const { data: similarCarsData, isLoading: similarCarsLoading } = useCars(
    3, 
    0, 
    similarFilters,
    'created_at',
    'desc'
  )
  
  const similarCars = similarCarsData?.data || []
  const isLoading = carLoading || (car && similarCarsLoading)

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    )
  }

  // Car not found
  if (!car) {
    return null // Will redirect to 404
  }

  // Meta title and description
  const metaTitle = `${car.year} ${car.make} ${car.model} | Power Auto ID`
  const metaDescription = `Beli ${car.year} ${car.make} ${car.model} bekas berkualitas dengan harga ${formatCurrency(car.price)}. ${car.transmission === 'automatic' ? 'Transmisi Otomatis' : 'Transmisi Manual'}, Bahan Bakar ${car.fuel_type}, Kilometer ${car.mileage.toLocaleString()}.`

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={car.title_image} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Power Auto ID" />
        <meta property="og:locale" content="id_ID" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={car.title_image} />
      </Helmet>

      <div className="bg-gray-50 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb and back */}
          <div className="mb-6">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              asChild
            >
              <Link to="/cars">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Link>
            </Button>
          </div>

          {/* Car header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {car.year} {car.make} {car.model}
            </h1>
            
            <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2">
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(car.price)}
              </div>
              
              {car.market_price && car.market_price > car.price && (
                <div className="text-lg text-gray-500 line-through">
                  {formatCurrency(car.market_price)}
                </div>
              )}

              {car.sold && (
                <div className="rounded-md bg-yellow-100 px-2.5 py-0.5 text-sm font-medium text-yellow-800">
                  Terjual
                </div>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left side (images and info) */}
            <div className="lg:col-span-2">
              {/* Car images */}
              <div className="overflow-hidden rounded-lg bg-white p-4 shadow-sm">
                <CarImageGallery 
                  images={car.images} 
                  title={`${car.year} ${car.make} ${car.model}`} 
                />
              </div>

              {/* Car description */}
              <div className="mt-8 overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-bold">Deskripsi</h2>
                <div className="prose prose-sm max-w-none text-gray-700">
                  {car.description.split('\n').map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Car benefits */}
              <div className="mt-8">
                <CarBenefits />
              </div>
            </div>

            {/* Right side (price comparison and contact) */}
            <div>
              {/* Price comparison widget */}
              {!car.sold && car.market_price && car.market_price > car.price && (
                <div className="mb-4">
                  <PriceComparisonWidget 
                    price={car.price} 
                    marketPrice={car.market_price} 
                  />
                </div>
              )}
              
              {/* Call to action */}
              <div className="mb-4">
                <CarCallToAction car={car} />
              </div>
              
              {/* Sold notice */}
              {car.sold && (
                <div className="mb-4 rounded-lg border-2 border-yellow-400 bg-yellow-50 p-4 text-center">
                  <h3 className="mb-2 text-lg font-bold text-yellow-700">
                    Mobil Ini Telah Terjual
                  </h3>
                  <p className="text-yellow-600">
                    Mobil ini sudah tidak tersedia, tapi kami masih memiliki banyak 
                    pilihan mobil berkualitas lainnya.
                  </p>
                  <div className="mt-4">
                    <Button asChild>
                      <Link to="/cars">Lihat Mobil Lainnya</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar cars */}
          {similarCars.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 text-2xl font-bold">Mobil Serupa</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {similarCars.map((similarCar) => (
                  <CarCard key={similarCar.id} car={similarCar} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}