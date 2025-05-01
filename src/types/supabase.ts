export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cars: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          make: string
          model: string
          year: number
          color: string
          transmission: 'manual' | 'automatic'
          fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid'
          mileage: number
          price: number
          market_price: number | null
          features: string[]
          description: string
          vin: string
          engine_size: number
          power: number
          seats: number
          doors: number
          condition: 'excellent' | 'good' | 'fair'
          sold: boolean
          sold_at: string | null
          title_image: string
          images: string[]
          slug: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          make: string
          model: string
          year: number
          color: string
          transmission: 'manual' | 'automatic'
          fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid'
          mileage: number
          price: number
          market_price?: number | null
          features?: string[]
          description: string
          vin: string
          engine_size: number
          power: number
          seats: number
          doors: number
          condition: 'excellent' | 'good' | 'fair'
          sold?: boolean
          sold_at?: string | null
          title_image: string
          images?: string[]
          slug?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          make?: string
          model?: string
          year?: number
          color?: string
          transmission?: 'manual' | 'automatic'
          fuel_type?: 'gasoline' | 'diesel' | 'electric' | 'hybrid'
          mileage?: number
          price?: number
          market_price?: number | null
          features?: string[]
          description?: string
          vin?: string
          engine_size?: number
          power?: number
          seats?: number
          doors?: number
          condition?: 'excellent' | 'good' | 'fair'
          sold?: boolean
          sold_at?: string | null
          title_image?: string
          images?: string[]
          slug?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          created_at: string
          customer_name: string
          customer_location: string
          rating: number
          content: string
          image: string | null
          car_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          customer_name: string
          customer_location: string
          rating: number
          content: string
          image?: string | null
          car_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          customer_name?: string
          customer_location?: string
          rating?: number
          content?: string
          image?: string | null
          car_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Derived types
export type Car = Database['public']['Tables']['cars']['Row']
export type NewCar = Database['public']['Tables']['cars']['Insert']
export type UpdateCar = Database['public']['Tables']['cars']['Update']

export type Testimonial = Database['public']['Tables']['testimonials']['Row']
export type NewTestimonial = Database['public']['Tables']['testimonials']['Insert']
export type UpdateTestimonial = Database['public']['Tables']['testimonials']['Update']
