import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car as CarIcon, Gauge, Award, ShieldCheck } from 'lucide-react'
import { getCars } from '@/lib/supabase/client'
import { Car as CarType } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import CarCard from '@/components/cars/CarCard'
import TestimonialCarousel from '@/components/testimonials/TestimonialCarousel'

// Testimonial image URLs
const testimonialImages = [
  "https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/testimonial-images//testimonial1.png",
  "https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/testimonial-images//testimonial2.png",
  "https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/testimonial-images//testimonial3.png",
  "https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/testimonial-images//testimonial4.png",
  "https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/testimonial-images//testimonial5.png"
]

export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState<CarType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch featured cars
        const { data: carsData } = await getCars(6, 0, { sold: false })
        
        setFeaturedCars(carsData || [])
      } catch (error) {
        console.error('Error fetching initial data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?auto=format&fit=crop&q=80"
            alt="Luxury car showroom"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800/90 to-black/80" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="md:w-2/3">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Mobil Terbaik dengan Harga{' '}
              <span className="text-primary">TERMURAH SE-INDONESIA</span>
            </h1>
            <p className="mb-8 max-w-xl text-xl text-gray-300">
              Power Auto ID menyediakan mobil bekas berkualitas dengan kondisi terbaik, DP 0%, dan garansi buyback.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/cars">Lihat Semua Mobil</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="https://wa.me/628119288855" target="_blank" rel="noopener noreferrer">
                  Hubungi Kami
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Keunggulan Power Auto ID
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500">
              Kami menawarkan pengalaman pembelian mobil bekas yang terbaik di Indonesia.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* USP 1 */}
            <div className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Buyback Guarantee</h3>
              <p className="text-gray-600">
                Kami menjamin untuk membeli kembali mobil Anda dengan harga yang kompetitif.
              </p>
            </div>

            {/* USP 2 */}
            <div className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-medium">0% Down Payment</h3>
              <p className="text-gray-600">
                Dapatkan mobil impian Anda tanpa DP dan dengan cicilan yang terjangkau.
              </p>
            </div>

            {/* USP 3 */}
            <div className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Gauge className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Fully Serviced</h3>
              <p className="text-gray-600">
                Semua mobil kami telah melalui pemeriksaan menyeluruh dan servis lengkap.
              </p>
            </div>

            {/* USP 4 */}
            <div className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CarIcon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Harga Termurah</h3>
              <p className="text-gray-600">
                Kami menjamin harga mobil bekas termurah di seluruh Indonesia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Mobil Pilihan
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                Temukan mobil impian Anda dengan harga terbaik
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button asChild>
                <Link to="/cars">Lihat Semua Mobil</Link>
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="mt-12 flex h-96 w-full items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Apa Kata Pelanggan Kami
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500">
              Pelanggan kami selalu puas dengan pelayanan dan kualitas mobil dari Power Auto ID.
            </p>
          </div>

          {isLoading ? (
            <div className="mt-12 flex h-64 w-full items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            </div>
          ) : (
            <div className="mt-12">
              <TestimonialCarousel 
                testimonialImages={testimonialImages.slice(0, 5)} 
                withCTA={true}
              />
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-red-700 py-12 text-white sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Siap Untuk Menemukan Mobil Impian Anda?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg">
              Kunjungi showroom kami atau hubungi kami untuk penawaran terbaik dan informasi lebih lanjut.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                <Link to="/cars">Lihat Semua Mobil</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
                <a href="https://wa.me/628119288855" target="_blank" rel="noopener noreferrer">
                  Hubungi Kami
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
