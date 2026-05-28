export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      branches: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      car_images: {
        Row: {
          car_id: string
          created_at: string
          height: number | null
          id: string
          is_cover: boolean
          size_bytes: number | null
          sort_order: number
          storage_path: string
          width: number | null
        }
        Insert: {
          car_id: string
          created_at?: string
          height?: number | null
          id?: string
          is_cover?: boolean
          size_bytes?: number | null
          sort_order?: number
          storage_path: string
          width?: number | null
        }
        Update: {
          car_id?: string
          created_at?: string
          height?: number | null
          id?: string
          is_cover?: boolean
          size_bytes?: number | null
          sort_order?: number
          storage_path?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "car_images_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      cars: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          bpkb_holder_name: string | null
          branch_id: string | null
          color: string | null
          condition: Database["public"]["Enums"]["condition_type"] | null
          created_at: string
          created_by: string | null
          description: string | null
          doors: number | null
          engine_size: number | null
          features: string[] | null
          fuel_type: Database["public"]["Enums"]["fuel_type"] | null
          id: string
          images: string[] | null
          make: string | null
          market_price: number | null
          mileage: number | null
          model: string | null
          plate_number: string | null
          power: number | null
          price: number | null
          rejected_reason: string | null
          sales_pic_id: string | null
          seats: number | null
          service_history: string | null
          slug: string | null
          sold: boolean
          sold_at: string | null
          status: Database["public"]["Enums"]["car_status"]
          stnk_holder_name: string | null
          submitted_at: string | null
          tax_due_date: string | null
          title_image: string | null
          transmission: Database["public"]["Enums"]["transmission_type"] | null
          updated_at: string
          vin: string | null
          year: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          bpkb_holder_name?: string | null
          branch_id?: string | null
          color?: string | null
          condition?: Database["public"]["Enums"]["condition_type"] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          doors?: number | null
          engine_size?: number | null
          features?: string[] | null
          fuel_type?: Database["public"]["Enums"]["fuel_type"] | null
          id?: string
          images?: string[] | null
          make?: string | null
          market_price?: number | null
          mileage?: number | null
          model?: string | null
          plate_number?: string | null
          power?: number | null
          price?: number | null
          rejected_reason?: string | null
          sales_pic_id?: string | null
          seats?: number | null
          service_history?: string | null
          slug?: string | null
          sold?: boolean
          sold_at?: string | null
          status?: Database["public"]["Enums"]["car_status"]
          stnk_holder_name?: string | null
          submitted_at?: string | null
          tax_due_date?: string | null
          title_image?: string | null
          transmission?: Database["public"]["Enums"]["transmission_type"] | null
          updated_at?: string
          vin?: string | null
          year?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          bpkb_holder_name?: string | null
          branch_id?: string | null
          color?: string | null
          condition?: Database["public"]["Enums"]["condition_type"] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          doors?: number | null
          engine_size?: number | null
          features?: string[] | null
          fuel_type?: Database["public"]["Enums"]["fuel_type"] | null
          id?: string
          images?: string[] | null
          make?: string | null
          market_price?: number | null
          mileage?: number | null
          model?: string | null
          plate_number?: string | null
          power?: number | null
          price?: number | null
          rejected_reason?: string | null
          sales_pic_id?: string | null
          seats?: number | null
          service_history?: string | null
          slug?: string | null
          sold?: boolean
          sold_at?: string | null
          status?: Database["public"]["Enums"]["car_status"]
          stnk_holder_name?: string | null
          submitted_at?: string | null
          tax_due_date?: string | null
          title_image?: string | null
          transmission?: Database["public"]["Enums"]["transmission_type"] | null
          updated_at?: string
          vin?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cars_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cars_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cars_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cars_sales_pic_id_fkey"
            columns: ["sales_pic_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_audit_log: {
        Row: {
          actor_id: string | null
          car_id: string
          created_at: string
          from_status: Database["public"]["Enums"]["car_status"] | null
          id: string
          reason: string | null
          to_status: Database["public"]["Enums"]["car_status"]
        }
        Insert: {
          actor_id?: string | null
          car_id: string
          created_at?: string
          from_status?: Database["public"]["Enums"]["car_status"] | null
          id?: string
          reason?: string | null
          to_status: Database["public"]["Enums"]["car_status"]
        }
        Update: {
          actor_id?: string | null
          car_id?: string
          created_at?: string
          from_status?: Database["public"]["Enums"]["car_status"] | null
          id?: string
          reason?: string | null
          to_status?: Database["public"]["Enums"]["car_status"]
        }
        Relationships: [
          {
            foreignKeyName: "listing_audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_audit_log_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          car_id: string | null
          content: string
          created_at: string
          customer_location: string
          customer_name: string
          id: string
          image: string | null
          rating: number
        }
        Insert: {
          car_id?: string | null
          content: string
          created_at?: string
          customer_location: string
          customer_name: string
          id?: string
          image?: string | null
          rating: number
        }
        Update: {
          car_id?: string | null
          content?: string
          created_at?: string
          customer_location?: string
          customer_name?: string
          id?: string
          image?: string | null
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      car_status:
        | "draft"
        | "pending_approval"
        | "available"
        | "reserved"
        | "sold"
        | "rejected"
        | "archived"
      condition_type: "excellent" | "good" | "fair"
      fuel_type: "gasoline" | "diesel" | "electric" | "hybrid"
      transmission_type: "manual" | "automatic"
      user_role: "admin" | "sales"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      car_status: [
        "draft",
        "pending_approval",
        "available",
        "reserved",
        "sold",
        "rejected",
        "archived",
      ],
      condition_type: ["excellent", "good", "fair"],
      fuel_type: ["gasoline", "diesel", "electric", "hybrid"],
      transmission_type: ["manual", "automatic"],
      user_role: ["admin", "sales"],
    },
  },
} as const

// Derived types
//
// `CarRow` is the raw DB row, with nullable fields for drafts.
// `Car` is the "public listing" shape — required fields are asserted non-null
// because the public site only reads rows with status='available', which by
// definition must have those fields populated. Dashboard code that works with
// drafts should import `CarRow` instead.
export type CarRow = Database['public']['Tables']['cars']['Row']
export type NewCar = Database['public']['Tables']['cars']['Insert']
export type UpdateCar = Database['public']['Tables']['cars']['Update']

export type Car = Omit<
  CarRow,
  | 'make' | 'model' | 'year' | 'color' | 'transmission' | 'fuel_type'
  | 'mileage' | 'price' | 'description' | 'vin' | 'engine_size' | 'power'
  | 'seats' | 'doors' | 'condition' | 'title_image' | 'slug'
> & {
  make: string
  model: string
  year: number
  color: string
  transmission: Database['public']['Enums']['transmission_type']
  fuel_type: Database['public']['Enums']['fuel_type']
  mileage: number
  price: number
  description: string
  vin: string
  engine_size: number
  power: number
  seats: number
  doors: number
  condition: Database['public']['Enums']['condition_type']
  title_image: string
  slug: string
  // Optional relations populated by the public fetchers via PostgREST joins.
  car_images?: { storage_path: string; sort_order: number; is_cover: boolean }[]
  sales_pic?: { full_name: string | null; phone: string | null } | null
}

export type Testimonial = Database['public']['Tables']['testimonials']['Row']
export type NewTestimonial = Database['public']['Tables']['testimonials']['Insert']
export type UpdateTestimonial = Database['public']['Tables']['testimonials']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type NewProfile = Database['public']['Tables']['profiles']['Insert']
export type UpdateProfile = Database['public']['Tables']['profiles']['Update']
export type UserRole = Database['public']['Enums']['user_role']

export type Branch = Database['public']['Tables']['branches']['Row']
export type NewBranch = Database['public']['Tables']['branches']['Insert']
export type UpdateBranch = Database['public']['Tables']['branches']['Update']

export type CarImage = Database['public']['Tables']['car_images']['Row']
export type NewCarImage = Database['public']['Tables']['car_images']['Insert']
export type UpdateCarImage = Database['public']['Tables']['car_images']['Update']

export type CarStatus = Database['public']['Enums']['car_status']

export type AuditLogEntry = Database['public']['Tables']['listing_audit_log']['Row']
