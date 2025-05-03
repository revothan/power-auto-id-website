import { Link } from 'react-router-dom'
import { ShieldCheck, Award, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1567077084813-4410a4644ce1?auto=format&fit=crop&q=80"
            alt="Car showroom"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-800/70 to-black/80" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Tentang <span className="text-primary">Power Auto ID</span>
          </h1>
          <p className="mb-6 max-w-xl text-xl text-gray-300">
            Showroom mobil bekas berkualitas dengan harga TERMURAH SE-INDONESIA
          </p>
        </div>
      </section>

      {/* Company history */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Sejarah Kami
              </h2>
              <div className="mt-6 space-y-6 text-lg text-gray-600">
                <p>
                  Power Auto ID didirikan pada tahun 2015 dengan visi sederhana: memberikan pengalaman 
                  pembelian mobil bekas yang transparan, terpercaya, dan terjangkau bagi masyarakat Indonesia.
                </p>
                <p>
                  Berawal dari showroom kecil di BSD City, kami terus berkembang berkat kepercayaan pelanggan 
                  dan komitmen kami terhadap kualitas. Saat ini, Power Auto ID telah menjadi salah satu 
                  dealer mobil bekas terpercaya di kawasan Tangerang dan sekitarnya.
                </p>
                <p>
                  Selama bertahun-tahun, kami telah membantu ribuan pelanggan menemukan mobil impian mereka 
                  dengan harga yang terjangkau dan kualitas yang terjamin. Kepuasan pelanggan adalah prioritas 
                  utama kami, dan kami berkomitmen untuk terus meningkatkan layanan kami.
                </p>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551522435-a13afa10f103?auto=format&fit=crop&q=80"
                alt="Power Auto ID showroom"
                className="h-full w-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Values */}
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Misi dan Nilai Kami
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Kami berkomitmen untuk menyediakan pengalaman pembelian mobil bekas terbaik dengan harga termurah.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Value 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">Kualitas Terjamin</h3>
              <p className="mt-2 text-gray-600">
                Setiap mobil di showroom kami telah melalui inspeksi ketat dan servis 
                lengkap untuk memastikan kondisi terbaik.
              </p>
            </div>

            {/* Value 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">Harga Transparan</h3>
              <p className="mt-2 text-gray-600">
                Kami menawarkan harga yang jujur dan transparan, tanpa biaya 
                tersembunyi, untuk pengalaman pembelian yang menyenangkan.
              </p>
            </div>

            {/* Value 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                <ThumbsUp className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">Layanan Prima</h3>
              <p className="mt-2 text-gray-600">
                Kami memprioritaskan kepuasan pelanggan dengan layanan ramah, profesional, 
                dan after-sales yang memuaskan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Showroom Photos */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Showroom Kami
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Kunjungi showroom kami di Ocean Park BSD City untuk melihat koleksi mobil berkualitas.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <img
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80"
              alt="Power Auto ID showroom"
              className="h-64 w-full rounded-lg object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&q=80"
              alt="Power Auto ID car collection"
              className="h-64 w-full rounded-lg object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1570733577524-3a047079e80d?auto=format&fit=crop&q=80"
              alt="Power Auto ID office"
              className="h-64 w-full rounded-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Siap Menemukan Mobil Impian Anda?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Jelajahi koleksi mobil kami atau hubungi kami untuk informasi lebih lanjut.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-primary focus:ring-white">
              <Link to="/cars">Lihat Semua Mobil</Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100">
              <Link to="/contact">Hubungi Kami</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
