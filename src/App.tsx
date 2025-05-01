import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'

// Loading fallback
const PageLoading = () => (
  <div className="flex min-h-[60vh] w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
  </div>
)

// Lazy loading pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const CarListingPage = lazy(() => import('./pages/CarListingPage'))
const CarDetailPage = lazy(() => import('./pages/CarDetailPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export default function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/cars" element={<Layout title="Mobil Kami | Power Auto ID"><CarListingPage /></Layout>} />
        <Route path="/cars/:slug" element={<Layout><CarDetailPage /></Layout>} />
        <Route path="/about" element={<Layout title="Tentang Kami | Power Auto ID"><AboutPage /></Layout>} />
        <Route path="/testimonials" element={<Layout title="Testimonial | Power Auto ID"><TestimonialsPage /></Layout>} />
        <Route path="/contact" element={<Layout title="Kontak | Power Auto ID"><ContactPage /></Layout>} />
        <Route path="*" element={<Layout title="Halaman Tidak Ditemukan | Power Auto ID"><NotFoundPage /></Layout>} />
      </Routes>
    </Suspense>
  )
}
