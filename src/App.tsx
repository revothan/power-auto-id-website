import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Loading fallback
const PageLoading = () => (
  <div className="flex min-h-[60vh] w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
  </div>
)

// Public pages
const HomePage = lazy(() => import('./pages/HomePage'))
const CarListingPage = lazy(() => import('./pages/CarListingPage'))
const CarDetailPage = lazy(() => import('./pages/CarDetailPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Auth pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'))

// Dashboard
const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout'))
const DashboardOverviewPage = lazy(
  () => import('./pages/dashboard/DashboardOverviewPage'),
)
const ListingsPage = lazy(() => import('./pages/dashboard/ListingsPage'))
const NewListingPage = lazy(() => import('./pages/dashboard/NewListingPage'))
const CarEditorPage = lazy(() => import('./pages/dashboard/CarEditorPage'))
const ApprovalsPage = lazy(() => import('./pages/dashboard/ApprovalsPage'))

export default function App() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {/* Public site */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/cars" element={<Layout title="Mobil Kami | Power Auto ID"><CarListingPage /></Layout>} />
        <Route path="/cars/:slug" element={<Layout><CarDetailPage /></Layout>} />
        <Route path="/about" element={<Layout title="Tentang Kami | Power Auto ID"><AboutPage /></Layout>} />
        <Route path="/testimonials" element={<Layout title="Testimonial | Power Auto ID"><TestimonialsPage /></Layout>} />
        <Route path="/contact" element={<Layout title="Kontak | Power Auto ID"><ContactPage /></Layout>} />

        {/* Auth (standalone — no public Layout, no dashboard chrome) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Authenticated dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverviewPage />} />
          <Route path="listings" element={<ListingsPage />} />
          <Route path="listings/new" element={<NewListingPage />} />
          <Route path="listings/:id/edit" element={<CarEditorPage />} />
          <Route
            path="approvals"
            element={
              <ProtectedRoute allow={['admin']}>
                <ApprovalsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Layout title="Halaman Tidak Ditemukan | Power Auto ID"><NotFoundPage /></Layout>} />
      </Routes>
    </Suspense>
  )
}
