import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'
import { CarStatus } from '@/types/supabase'

const COUNT_QUERY = { count: 'exact' as const, head: true }

async function countCars(filters: { status?: CarStatus; createdBy?: string }) {
  if (!supabase) return 0
  let q = supabase.from('cars').select('id', COUNT_QUERY)
  if (filters.status) q = q.eq('status', filters.status)
  if (filters.createdBy) q = q.eq('created_by', filters.createdBy)
  const { count, error } = await q
  if (error) {
    console.error('countCars error:', error)
    return 0
  }
  return count ?? 0
}

export interface DashboardStats {
  myListings: number
  pendingApproval: number
  available: number
}

export function useDashboardStats(opts: { userId: string | null; isAdmin: boolean }) {
  const { userId, isAdmin } = opts
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', userId, isAdmin],
    enabled: !!userId,
    queryFn: async () => {
      const [myListings, pendingApproval, available] = await Promise.all([
        // "My listings" — admins see everything they created; sales see own
        userId ? countCars({ createdBy: userId }) : Promise.resolve(0),
        // Pending approval — admin sees the global queue, sales sees own
        isAdmin
          ? countCars({ status: 'pending_approval' })
          : userId
            ? countCars({ status: 'pending_approval', createdBy: userId })
            : Promise.resolve(0),
        // Available across the site (anyone authenticated sees this)
        countCars({ status: 'available' }),
      ])
      return { myListings, pendingApproval, available }
    },
    staleTime: 60_000,
  })
}

// ============================================================================
// Listings table
// ============================================================================

export interface ListingsFilters {
  status?: CarStatus | 'all'
  ownerScope: 'mine' | 'all'
  search?: string
  page: number
  pageSize: number
  userId: string | null
}

export interface ListingRow {
  id: string
  status: CarStatus
  make: string | null
  model: string | null
  year: number | null
  price: number | null
  plate_number: string | null
  updated_at: string
  created_by: string | null
  branch: { name: string } | null
  sales_pic: { full_name: string | null } | null
  car_images: { storage_path: string; is_cover: boolean }[]
}

export function useListings(filters: ListingsFilters) {
  return useQuery({
    queryKey: ['dashboard-listings', filters],
    enabled: !!filters.userId,
    queryFn: async () => {
      if (!supabase) return { rows: [] as ListingRow[], count: 0 }

      const from = filters.page * filters.pageSize
      const to = from + filters.pageSize - 1

      let q = supabase
        .from('cars')
        .select(
          `
            id, status, make, model, year, price, plate_number, updated_at, created_by,
            branch:branches ( name ),
            sales_pic:profiles!cars_sales_pic_id_fkey ( full_name ),
            car_images ( storage_path, is_cover )
          `,
          { count: 'exact' },
        )
        .order('updated_at', { ascending: false })
        .range(from, to)

      if (filters.status && filters.status !== 'all') {
        q = q.eq('status', filters.status)
      }
      if (filters.ownerScope === 'mine' && filters.userId) {
        q = q.eq('created_by', filters.userId)
      }
      if (filters.search) {
        const term = filters.search.replace(/[%,]/g, '').trim()
        if (term) {
          q = q.or(
            `make.ilike.%${term}%,model.ilike.%${term}%,plate_number.ilike.%${term}%`,
          )
        }
      }

      const { data, count, error } = await q
      if (error) {
        console.error('useListings error:', error)
        return { rows: [] as ListingRow[], count: 0 }
      }
      return {
        rows: (data ?? []) as unknown as ListingRow[],
        count: count ?? 0,
      }
    },
    staleTime: 30_000,
  })
}
