import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  ImageIcon,
  Loader2,
  ShieldCheck,
} from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'

interface PendingRow {
  id: string
  make: string | null
  model: string | null
  year: number | null
  price: number | null
  plate_number: string | null
  submitted_at: string | null
  updated_at: string
  submitter: { full_name: string | null; email: string } | null
  branch: { name: string } | null
  car_images: { storage_path: string; is_cover: boolean }[]
}

function useApprovalQueue() {
  return useQuery({
    queryKey: ['approval-queue'],
    queryFn: async () => {
      if (!supabase) return [] as PendingRow[]
      const { data, error } = await supabase
        .from('cars')
        .select(
          `
            id, make, model, year, price, plate_number, submitted_at, updated_at,
            submitter:profiles!cars_created_by_fkey ( full_name, email ),
            branch:branches ( name ),
            car_images ( storage_path, is_cover )
          `,
        )
        .eq('status', 'pending_approval')
        .order('submitted_at', { ascending: true, nullsFirst: false })
      if (error) {
        console.error('approval queue fetch error:', error)
        return [] as PendingRow[]
      }
      return data as unknown as PendingRow[]
    },
    staleTime: 30_000,
  })
}

function formatSubmitted(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function coverUrl(row: PendingRow): string | null {
  if (!supabase) return null
  const cover = row.car_images.find((i) => i.is_cover) ?? row.car_images[0]
  if (!cover) return null
  return supabase.storage.from('car-images').getPublicUrl(cover.storage_path).data.publicUrl
}

export default function ApprovalsPage() {
  const { data: rows = [], isLoading } = useApprovalQueue()

  return (
    <>
      <Helmet>
        <title>Approval | Power Auto Dashboard</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Approval</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Listing yang menunggu review sebelum tayang di website publik.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border bg-card py-16 text-center">
            <ShieldCheck className="h-10 w-10 text-muted-foreground" />
            <div>
              <h2 className="text-base font-semibold">Antrian kosong</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Semua listing sudah direview. Kerja bagus.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => {
              const cover = coverUrl(row)
              const name =
                [row.year, row.make, row.model].filter(Boolean).join(' ') ||
                'Tanpa judul'
              return (
                <div
                  key={row.id}
                  className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4"
                >
                  <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {row.plate_number ? `${row.plate_number} • ` : ''}
                      {row.branch?.name ? `${row.branch.name} • ` : ''}
                      Submit:{' '}
                      {row.submitter?.full_name || row.submitter?.email || '—'}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-semibold tabular-nums">
                      {row.price != null ? formatCurrency(row.price) : '—'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatSubmitted(row.submitted_at ?? row.updated_at)}
                    </div>
                  </div>

                  <Button asChild className="gap-2">
                    <Link to={`/dashboard/listings/${row.id}/edit`}>
                      Buka
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export function usePendingApprovalCount() {
  return useQuery({
    queryKey: ['pending-approval-count'],
    queryFn: async () => {
      if (!supabase) return 0
      const { count, error } = await supabase
        .from('cars')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending_approval')
      if (error) {
        console.error('pending-approval-count error:', error)
        return 0
      }
      return count ?? 0
    },
    staleTime: 30_000,
  })
}
