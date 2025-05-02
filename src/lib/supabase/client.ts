import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string || ''

// Check if environment variables are available
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey

// Create client only if properly configured
export const supabase = isSupabaseConfigured 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null

// Helper function to check if Supabase is configured
export const checkSupabaseConnection = () => {
  if (!isSupabaseConfigured) {
    console.error('Supabase configuration is missing. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.')
    return false
  }
  return true
}

export async function getCars(
  limit = 10,
  page = 0,
  filters: Record<string, any> = {},
  sortBy: string = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  if (!checkSupabaseConnection()) {
    return { data: [], count: 0, totalPages: 0 }
  }

  let query = supabase!
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

  try {
    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching cars:', error)
      return { data: [], count: 0, totalPages: 0 }
    }

    return { 
      data: data || [], 
      count: count || 0, 
      totalPages: count ? Math.ceil(count / limit) : 0 
    }
  } catch (error) {
    console.error('Error fetching cars:', error)
    return { data: [], count: 0, totalPages: 0 }
  }
}

export async function getCarById(id: string) {
  if (!checkSupabaseConnection()) {
    return null
  }

  try {
    const { data, error } = await supabase!
      .from('cars')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching car:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching car:', error)
    return null
  }
}

export async function getTestimonials(limit = 10) {
  if (!checkSupabaseConnection()) {
    return []
  }

  try {
    const { data, error } = await supabase!
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching testimonials:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return []
  }
}

export async function getCarMakes() {
  if (!checkSupabaseConnection()) {
    return []
  }

  try {
    const { data, error } = await supabase!
      .from('cars')
      .select('make')
      .order('make')

    if (error) {
      console.error('Error fetching car makes:', error)
      return []
    }

    // Get unique makes
    const uniqueMakes = [...new Set(data.map(car => car.make))]
    return uniqueMakes
  } catch (error) {
    console.error('Error fetching car makes:', error)
    return []
  }
}

export async function getCarModels(make?: string) {
  if (!checkSupabaseConnection()) {
    return []
  }

  try {
    let query = supabase!
      .from('cars')
      .select('model')
      .order('model')

    if (make) {
      query = query.eq('make', make)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching car models:', error)
      return []
    }

    // Get unique models
    const uniqueModels = [...new Set(data.map(car => car.model))]
    return uniqueModels
  } catch (error) {
    console.error('Error fetching car models:', error)
    return []
  }
}

export async function getCarYears() {
  if (!checkSupabaseConnection()) {
    return []
  }

  try {
    const { data, error } = await supabase!
      .from('cars')
      .select('year')
      .order('year', { ascending: false })

    if (error) {
      console.error('Error fetching car years:', error)
      return []
    }

    // Get unique years
    const uniqueYears = [...new Set(data.map(car => car.year))]
    return uniqueYears
  } catch (error) {
    console.error('Error fetching car years:', error)
    return []
  }
}