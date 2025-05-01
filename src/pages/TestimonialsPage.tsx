import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTestimonials } from '@/lib/supabase/client'
import { Testimonial } from '@/types/supabase'
import { Button } from '@/components/ui/button'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true)
        const data = await getTestimonials(100) // Fetch all testimonials (up to 100)
        setTestimonials(data || [])
      } catch (error) {
        console.error('Error fetching testimonials:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  return (
    <div className="bg-white">
      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80"
            alt="Customer testimonials"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-black/80" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Testimonial <span className="text-primary">Pelanggan</span>
          </h1>
          <p className="mb-6 max-w-xl text-xl text-gray-300">
            Baca pengalaman pelanggan kami dalam membeli mobil di Power Auto ID.
          </p>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex h-96 w-full items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex">
                    {/* Star Rating */}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 15.934L4.618 19 5.764 12.82 1 8.585l6.364-.545L10 3l2.636 5.04 6.364.545-4.764 4.235 1.146 6.18L10 15.934z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="mb-6 text-gray-700">"{testimonial.content}"</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {testimonial.image ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.customer_name}
                          className="mr-4 h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                          {testimonial.customer_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .substring(0, 2)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold">{testimonial.customer_name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.customer_location}</p>
                      </div>
                    </div>
                    
                    {testimonial.car_id && (
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/cars/${testimonial.car_id}`}>Lihat Mobil</Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-96 w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-8 text-center">
              <svg
                className="mb-4 h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mb-2 text-lg font-medium">Tidak ada testimonial</h3>
              <p className="text-gray-600">
                Belum ada testimonial dari pelanggan saat ini.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-100 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Siap Menjadi Pelanggan Berikutnya?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Kunjungi showroom kami dan temukan mobil impian Anda dengan harga termurah.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/cars">Lihat Semua Mobil</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Hubungi Kami</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
