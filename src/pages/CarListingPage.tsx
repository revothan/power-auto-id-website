import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCars, checkSupabaseConnection } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import CarCard from '@/components/cars/CarCard'
import CarFilter from '@/components/cars/CarFilter'
import ConnectionErrorDisplay from '@/components/common/ConnectionErrorDisplay'

const ITEMS_PER_PAGE = 9

export default function CarListingPage() {
  const [searchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [hasConnectionError, setHasConnectionError] = useState(false)

  // Check if Supabase is configured
  useEffect(() => {
    const isConfigured = checkSupabaseConnection()
    setHasConnectionError(!isConfigured)
  }, [])

  // Parse filter parameters with useMemo for better performance
  const filters = useMemo(() => {
    const filterObj: Record<string, any> = {}
    
    // Add make filter
    const make = searchParams.get('make')
    if (make) filterObj.make = make
    
    // Add model filter
    const model = searchParams.get('model')
    if (model) filterObj.model = model
    
    // Add year range
    const yearMin = searchParams.get('yearMin')
    const yearMax = searchParams.get('yearMax')
    if (yearMin || yearMax) {
      filterObj.year = {}
      if (yearMin) filterObj.year.min = parseInt(yearMin)
      if (yearMax) filterObj.year.max = parseInt(yearMax)
    }
    
    // Add price range
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    if (priceMin || priceMax) {
      filterObj.price = {}
      if (priceMin) filterObj.price.min = parseInt(priceMin)
      if (priceMax) filterObj.price.max = parseInt(priceMax)
    }
    
    // Add transmission filter
    const transmission = searchParams.get('transmission')
    if (transmission) filterObj.transmission = transmission
    
    // Add fuel type filter
    const fuelType = searchParams.get('fuelType')
    if (fuelType) filterObj.fuel_type = fuelType
    
    // Only show available cars (not sold)
    filterObj.sold = false
    
    return filterObj
  }, [searchParams])

  // Use React Query for cached car data with automatic error handling
  const { 
    data: carData, 
    isLoading, 
    error 
  } = useCars(
    ITEMS_PER_PAGE, 
    currentPage, 
    filters, 
    'created_at', 
    'desc'
  )

  // Extract data with fallbacks
  const cars = carData?.data || []
  const totalCars = carData?.count || 0
  const totalPages = carData?.totalPages || 0

  // Navigate to another page
  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Toggle filter visibility on mobile
  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev)
  }

  return (
    <div className="bg-gray-50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between sm:flex-row">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mobil Kami</h1>
            <p className="mt-2 text-lg text-gray-600">
              Temukan mobil impian Anda dengan harga termurah
            </p>
          </div>
          
          {!hasConnectionError && (
            <div className="mt-4 sm:mt-0">
              <Button
                variant="outline"
                className="flex items-center md:hidden"
                onClick={toggleFilter}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          )}
        </div>

        {/* Connection Error */}
        {hasConnectionError && (
          <div className="mt-6">
            <ConnectionErrorDisplay message="Tidak dapat terhubung ke database" />
          </div>
        )}

        {/* Main content */}
        {!hasConnectionError && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Filters */}
            <div
              className={`${
                isFilterOpen ? 'block' : 'hidden'
              } lg:block`}
            >
              <CarFilter />
            </div>

            {/* Car listings */}
            <div className="lg:col-span-3">
              {/* Results summary */}
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {isLoading ? 'Loading...' : `Menampilkan ${cars.length} dari ${totalCars} mobil`}
                </p>
                
                {/* Sort dropdown (placeholder) */}
                <div>
                  <select
                    className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none"
                    defaultValue="newest"
                  >
                    <option value="newest">Terbaru</option>
                    <option value="price-low">Harga: Rendah ke Tinggi</option>
                    <option value="price-high">Harga: Tinggi ke Rendah</option>
                    <option value="year-new">Tahun: Terbaru</option>
                    <option value="year-old">Tahun: Terlama</option>
                  </select>
                </div>
              </div>

              {/* Car grid */}
              {isLoading ? (
                <div className="flex h-96 w-full items-center justify-center">
                  <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="flex h-96 w-full flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center">
                  <h3 className="mb-2 text-lg font-medium text-red-800">Error loading cars</h3>
                  <p className="text-red-600">Please try again later.</p>
                </div>
              ) : cars.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {cars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              ) : (
                <div className="flex h-96 w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-8 text-center">
                  <div className="mb-4 rounded-full bg-gray-100 p-3">
                    <Filter className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium">Tidak ada mobil yang ditemukan</h3>
                  <p className="text-gray-600">
                    Coba ubah filter pencarian Anda untuk melihat lebih banyak mobil.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="ml-1">Sebelumnya</span>
                    </Button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <Button
                        key={index}
                        variant={currentPage === index ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => goToPage(index)}
                        className={index >= currentPage - 2 && index <= currentPage + 2 ? 'block' : 'hidden md:block'}
                      >
                        {index + 1}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                    >
                      <span className="mr-1">Selanjutnya</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}