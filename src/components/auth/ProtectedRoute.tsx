import { Loader2 } from 'lucide-react'
import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/lib/auth/AuthProvider'
import { UserRole } from '@/types/supabase'

interface ProtectedRouteProps {
  children: ReactNode
  /**
   * When set, only profiles whose `role` is in this list pass. Authenticated
   * users without an allowed role get the forbidden screen.
   */
  allow?: UserRole[]
}

export default function ProtectedRoute({ children, allow }: ProtectedRouteProps) {
  const { status, profile } = useAuth()
  const location = useLocation()

  if (status === 'initializing') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    )
  }

  if (allow && (!profile || !allow.includes(profile.role))) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-semibold">Akses ditolak</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Akun kamu tidak punya izin untuk halaman ini.
          </p>
        </div>
      </div>
    )
  }

  if (profile && profile.is_active === false) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-semibold">Akun nonaktif</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Hubungi admin untuk mengaktifkan kembali akun kamu.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
