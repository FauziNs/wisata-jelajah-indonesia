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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_number: string
          created_at: string | null
          destination_id: string | null
          id: string
          payment_method: string | null
          payment_status: string | null
          quantity: number
          special_requests: string | null
          status: string | null
          ticket_type_id: string | null
          total_price: number
          updated_at: string | null
          user_id: string | null
          visit_date: string
          visitor_email: string
          visitor_name: string
          visitor_phone: string | null
        }
        Insert: {
          booking_number: string
          created_at?: string | null
          destination_id?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          quantity: number
          special_requests?: string | null
          status?: string | null
          ticket_type_id?: string | null
          total_price: number
          updated_at?: string | null
          user_id?: string | null
          visit_date: string
          visitor_email: string
          visitor_name: string
          visitor_phone?: string | null
        }
        Update: {
          booking_number?: string
          created_at?: string | null
          destination_id?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          quantity?: number
          special_requests?: string | null
          status?: string | null
          ticket_type_id?: string | null
          total_price?: number
          updated_at?: string | null
          user_id?: string | null
          visit_date?: string
          visitor_email?: string
          visitor_name?: string
          visitor_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "ticket_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      destination_facilities: {
        Row: {
          created_at: string | null
          destination_id: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          destination_id?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          destination_id?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "destination_facilities_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      destination_images: {
        Row: {
          created_at: string | null
          destination_id: string | null
          id: string
          image_url: string
          is_primary: boolean | null
        }
        Insert: {
          created_at?: string | null
          destination_id?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
        }
        Update: {
          created_at?: string | null
          destination_id?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "destination_images_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          full_location: string | null
          id: string
          image_url: string | null
          location: string
          long_description: string | null
          name: string
          operational_hours: string | null
          price: number | null
          rating: number | null
          reviews_count: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          full_location?: string | null
          id?: string
          image_url?: string | null
          location: string
          long_description?: string | null
          name: string
          operational_hours?: string | null
          price?: number | null
          rating?: number | null
          reviews_count?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          full_location?: string | null
          id?: string
          image_url?: string | null
          location?: string
          long_description?: string | null
          name?: string
          operational_hours?: string | null
          price?: number | null
          rating?: number | null
          reviews_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string | null
          destination_id: string | null
          id: string
          question: string
        }
        Insert: {
          answer: string
          created_at?: string | null
          destination_id?: string | null
          id?: string
          question: string
        }
        Update: {
          answer?: string
          created_at?: string | null
          destination_id?: string | null
          id?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "faqs_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      help_articles: {
        Row: {
          answer: string
          category_id: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_featured: boolean | null
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          category_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category_id?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          question?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "help_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "help_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      help_categories: {
        Row: {
          created_at: string | null
          display_order: number | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          alamat: string | null
          created_at: string
          full_name: string
          id: string
          phone_number: string | null
          profile_picture_url: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          alamat?: string | null
          created_at?: string
          full_name: string
          id: string
          phone_number?: string | null
          profile_picture_url?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          alamat?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone_number?: string | null
          profile_picture_url?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          discount_amount: number | null
          discount_percentage: number | null
          end_date: string
          id: string
          image_url: string | null
          is_active: boolean | null
          promo_code: string | null
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          end_date: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          promo_code?: string | null
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          end_date?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          promo_code?: string | null
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          destination_id: string | null
          id: string
          rating: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          destination_id?: string | null
          id?: string
          rating: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          destination_id?: string | null
          id?: string
          rating?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_destinations: {
        Row: {
          destination_id: string
          id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          destination_id: string
          id?: string
          saved_at?: string
          user_id: string
        }
        Update: {
          destination_id?: string
          id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_destinations_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_types: {
        Row: {
          created_at: string | null
          description: string | null
          destination_id: string | null
          id: string
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          destination_id?: string | null
          id?: string
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          destination_id?: string | null
          id?: string
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_types_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          password_hash: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          password_hash: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          password_hash?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
    Enums: {},
  },
} as const
