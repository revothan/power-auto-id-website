import { Loader2, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useDashboardStats } from '@/lib/dashboard/hooks'
import { cn } from '@/lib/utils'

function StatCard({
  label,
  value,
  loading,
  highlight,
}: {
  label: string
  value: number
  loading: boolean
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-5',
        highlight && 'ring-1 ring-amber-300',
      )}
    >
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          value
        )}
      </div>
    </div>
  )
}

export default function DashboardOverviewPage() {
  const { profile, isAdmin, session } = useAuth()
  const userId = session?.user.id ?? null
  const { data: stats, isLoading } = useDashboardStats({ userId, isAdmin })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            Halo, {profile?.full_name || profile?.email?.split('@')[0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin
              ? 'Pantau listing dan approval di sini.'
              : 'Kelola listing kamu di sini.'}
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/dashboard/listings/new">
            <Plus className="h-4 w-4" />
            Tambah Listing
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Listing kamu"
          value={stats?.myListings ?? 0}
          loading={isLoading}
        />
        <StatCard
          label={
            isAdmin ? 'Menunggu approval (semua)' : 'Menunggu approval (kamu)'
          }
          value={stats?.pendingApproval ?? 0}
          loading={isLoading}
          highlight={isAdmin && (stats?.pendingApproval ?? 0) > 0}
        />
        <StatCard
          label="Available di website"
          value={stats?.available ?? 0}
          loading={isLoading}
        />
      </div>

      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-base font-semibold">Mulai dari sini</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link
              to="/dashboard/listings"
              className="text-primary hover:underline"
            >
              Lihat semua listing
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link
                to="/dashboard/approvals"
                className="text-primary hover:underline"
              >
                Buka antrian approval
              </Link>
            </li>
          )}
          <li>
            <Link
              to="/dashboard/listings/new"
              className="text-primary hover:underline"
            >
              Tambah listing baru
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
