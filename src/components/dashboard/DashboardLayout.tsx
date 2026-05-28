import {
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from 'lucide-react'
import { ReactNode, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/AuthProvider'
import { usePendingApprovalCount } from '@/pages/dashboard/ApprovalsPage'
import { cn } from '@/lib/utils'
import { UserRole } from '@/types/supabase'

interface NavItem {
  to: string
  label: string
  icon: ReactNode
  allow?: UserRole[]
  end?: boolean
}

const navItems: NavItem[] = [
  {
    to: '/dashboard',
    label: 'Overview',
    icon: <LayoutDashboard className="h-4 w-4" />,
    end: true,
  },
  {
    to: '/dashboard/listings',
    label: 'Listing',
    icon: <ListChecks className="h-4 w-4" />,
  },
  {
    to: '/dashboard/approvals',
    label: 'Approval',
    icon: <ShieldCheck className="h-4 w-4" />,
    allow: ['admin'],
  },
]

export default function DashboardLayout() {
  const { profile, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const { data: pendingCount } = usePendingApprovalCount()

  const visibleItems = navItems.filter(
    (item) => !item.allow || (profile && item.allow.includes(profile.role)),
  )

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | Power Auto ID</title>
      </Helmet>
      <div className="flex min-h-screen bg-muted/20">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background transition-transform lg:static lg:translate-x-0',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex h-16 items-center justify-between border-b px-6">
            <Link to="/dashboard" className="text-lg font-semibold">
              Power Auto
            </Link>
            <button
              type="button"
              className="lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Tutup menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="space-y-1 p-4">
            {visibleItems.map((item) => {
              const badge =
                item.to === '/dashboard/approvals' && isAdmin && pendingCount
                  ? pendingCount
                  : null
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )
                  }
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {badge ? (
                    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-100 px-1.5 text-[10px] font-semibold text-amber-700">
                      {badge}
                    </span>
                  ) : null}
                </NavLink>
              )
            })}
          </nav>
        </aside>

        {mobileOpen && (
          <button
            type="button"
            aria-label="Tutup menu"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Main column */}
        <div className="flex flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background px-4 lg:px-6">
            <button
              type="button"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden text-right text-sm sm:block">
                <div className="font-medium">
                  {profile?.full_name || profile?.email}
                </div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {profile?.role}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}
