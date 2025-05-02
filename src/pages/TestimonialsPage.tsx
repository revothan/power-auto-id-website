import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import TestimonialImageGrid from '@/components/testimonials/TestimonialImageGrid'

// Testimonial image URLs
const testimonialImages = [
  "https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/testimonial-images//testimonial1.png",
  "https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/testimonial-images//testimonial2.png",
  "https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/testimonial-images//testimonial3.png",
  "https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/testimonial-images//testimonial4.png",
  "https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/testimonial-images//testimonial5.png",
  "https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/testimonial-images//testimonial6.png",
  "https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/testimonial-images//testimonial7.png",
  "https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/testimonial-images//testimonial8.png",
  "https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/testimonial-images//testimonial9.png",
  "https://cfwrwtgwdljhdqgpwzip.supabase.co/storage/v1/object/public/testimonial-images//testimonial10.png"
]

export default function TestimonialsPage() {
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
          <TestimonialImageGrid testimonialImages={testimonialImages} />
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
