import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Search,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { StatusBadge, STATUS_LABELS } from '@/components/dashboard/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth/AuthProvider'
import {
  ListingRow,
  ListingsFilters,
  useListings,
} from '@/lib/dashboard/hooks'
import { supabase } from '@/lib/supabase/client'
import { cn, formatCurrency } from '@/lib/utils'
import { CarStatus } from '@/types/supabase'

const PAGE_SIZE = 20

const STATUS_OPTIONS: { value: CarStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua status' },
  { value: 'draft', label: STATUS_LABELS.draft },
  { value: 'pending_approval', label: STATUS_LABELS.pending_approval },
  { value: 'available', label: STATUS_LABELS.available },
  { value: 'reserved', label: STATUS_LABELS.reserved },
  { value: 'sold', label: STATUS_LABELS.sold },
  { value: 'rejected', label: STATUS_LABELS.rejected },
  { value: 'archived', label: STATUS_LABELS.archived },
]

function coverUrl(row: ListingRow): string | null {
  if (!supabase) return null
  const cover = row.car_images.find((i) => i.is_cover) ?? row.car_images[0]
  if (!cover) return null
  const { data } = supabase.storage.from('car-images').getPublicUrl(cover.storage_path)
  return data.publicUrl
}

function formatRelative(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ListingsPage() {
  const { session } = useAuth()
  const userId = session?.user.id ?? null

  const [status, setStatus] = useState<CarStatus | 'all'>('all')
  const [ownerScope, setOwnerScope] = useState<'mine' | 'all'>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  const filters: ListingsFilters = useMemo(
    () => ({ status, ownerScope, search, page, pageSize: PAGE_SIZE, userId }),
    [status, ownerScope, search, page, userId],
  )

  const { data, isLoading, isFetching } = useListings(filters)
  const rows = data?.rows ?? []
  const total = data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const setFilter = <K extends keyof Pick<ListingsFilters, 'status' | 'ownerScope' | 'search'>>(
    key: K,
    value: ListingsFilters[K],
  ) => {
    setPage(0)
    if (key === 'status') setStatus(value as CarStatus | 'all')
    if (key === 'ownerScope') setOwnerScope(value as 'mine' | 'all')
    if (key === 'search') setSearch(value as string)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Listing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total > 0
              ? `${total} listing${total === 1 ? '' : ''}`
              : 'Belum ada listing yang cocok dengan filter.'}
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/dashboard/listings/new">
            <Plus className="h-4 w-4" />
            Tambah Listing
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Cari brand, model, plat nomor…"
            className="pl-9"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setFilter('status', e.target.value as CarStatus | 'all')}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <div className="inline-flex rounded-md border bg-background p-0.5 text-sm">
          {(['mine', 'all'] as const).map((scope) => (
            <button
              key={scope}
              type="button"
              onClick={() => setFilter('ownerScope', scope)}
              className={cn(
                'rounded-sm px-3 py-1.5 transition-colors',
                ownerScope === scope
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {scope === 'mine' ? 'Listing saya' : 'Semua'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="w-16 px-4 py-3">Foto</th>
                <th className="px-4 py-3">Mobil</th>
                <th className="px-4 py-3">Plat</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Cabang</th>
                <th className="px-4 py-3">Diperbarui</th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16">
                    <div className="flex items-center justify-center text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-muted-foreground">
                    Tidak ada listing.
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const cover = coverUrl(row)
                  const name =
                    [row.year, row.make, row.model].filter(Boolean).join(' ') ||
                    'Tanpa judul'
                  return (
                    <tr key={row.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex h-10 w-14 items-center justify-center overflow-hidden rounded bg-muted">
                          {cover ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={cover}
                              alt=""
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{name}</div>
                        {row.sales_pic?.full_name && (
                          <div className="text-xs text-muted-foreground">
                            PIC: {row.sales_pic.full_name}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.plate_number || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {row.price != null ? formatCurrency(row.price) : '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.branch?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatRelative(row.updated_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Button asChild variant="ghost" size="icon" aria-label="Edit">
                          <Link to={`/dashboard/listings/${row.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > PAGE_SIZE && (
          <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
            <div className="text-muted-foreground">
              Halaman {page + 1} dari {totalPages}
              {isFetching && (
                <Loader2 className="ml-2 inline h-3 w-3 animate-spin" />
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                Berikutnya
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
