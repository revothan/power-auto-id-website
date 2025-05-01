import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8 lg:py-48">
        <p className="text-base font-semibold text-primary">404</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Halaman Tidak Ditemukan
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Maaf, kami tidak dapat menemukan halaman yang Anda cari.
        </p>
        <div className="mt-10">
          <div className="flex items-center justify-center gap-4">
            <Button asChild>
              <Link to="/">Kembali ke Beranda</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/cars">Lihat Mobil Kami</Link>
            </Button>
          </div>
          <div className="mt-6">
            <Link to="/contact" className="text-base font-medium text-primary hover:text-primary/80">
              Hubungi Kami <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
