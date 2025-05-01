import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)

export async function getCars(
  limit = 10,
  page = 0,
  filters: Record<string, any> = {},
  sortBy: string = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  let query = supabase
    .from('cars')
    .select('*', { count: 'exact' })
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .range(page * limit, (page + 1) * limit - 1)

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          query = query.in(key, value)
        }
      } else if (typeof value === 'object' && 'min' in value && 'max' in value) {
        if (value.min !== undefined && value.min !== null && value.min !== '') {
          query = query.gte(key, value.min)
        }
        if (value.max !== undefined && value.max !== null && value.max !== '') {
          query = query.lte(key, value.max)
        }
      } else {
        query = query.eq(key, value)
      }
    }
  })

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching cars:', error)
    throw error
  }

  return { 
    data, 
    count: count || 0, 
    totalPages: count ? Math.ceil(count / limit) : 0 
  }
}

export async function getCarById(id: string) {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching car:', error)
    throw error
  }

  return data
}

export async function getTestimonials(limit = 10) {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching testimonials:', error)
    throw error
  }

  return data
}

export async function getCarMakes() {
  const { data, error } = await supabase
    .from('cars')
    .select('make')
    .order('make')

  if (error) {
    console.error('Error fetching car makes:', error)
    throw error
  }

  // Get unique makes
  const uniqueMakes = [...new Set(data.map(car => car.make))]
  return uniqueMakes
}

export async function getCarModels(make?: string) {
  let query = supabase
    .from('cars')
    .select('model')
    .order('model')

  if (make) {
    query = query.eq('make', make)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching car models:', error)
    throw error
  }

  // Get unique models
  const uniqueModels = [...new Set(data.map(car => car.model))]
  return uniqueModels
}

export async function getCarYears() {
  const { data, error } = await supabase
    .from('cars')
    .select('year')
    .order('year', { ascending: false })

  if (error) {
    console.error('Error fetching car years:', error)
    throw error
  }

  // Get unique years
  const uniqueYears = [...new Set(data.map(car => car.year))]
  return uniqueYears
}