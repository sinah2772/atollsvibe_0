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
      islands: {
        Row: {
          id: number
          name: string
          name_en: string
          slug: string
          island_code: string | null
          island_category: string | null
          island_category_en: string | null
          island_details: string | null
          longitude: string | null
          latitude: string | null
          election_commission_code: string | null
          postal_code: string | null
          other_name_en: string | null
          other_name_dv: string | null
          list_order: number | null
          atoll_id: number | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          name_en: string
          slug: string
          island_code?: string | null
          island_category?: string | null
          island_category_en?: string | null
          island_details?: string | null
          longitude?: string | null
          latitude?: string | null
          election_commission_code?: string | null
          postal_code?: string | null
          other_name_en?: string | null
          other_name_dv?: string | null
          list_order?: number | null
          atoll_id?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          name_en?: string
          slug?: string
          island_code?: string | null
          island_category?: string | null
          island_category_en?: string | null
          island_details?: string | null
          longitude?: string | null
          latitude?: string | null
          election_commission_code?: string | null
          postal_code?: string | null
          other_name_en?: string | null
          other_name_dv?: string | null
          list_order?: number | null
          atoll_id?: number | null
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          heading: string
          social_heading: string | null
          content: Json
          category_id: number
          subcategory_id: number | null
          atoll_ids: number[]
          island_ids: number[]
          government_ids: string[] | null
          cover_image: string | null
          image_caption: string | null
          status: string
          publish_date: string | null
          views: number
          likes: number
          comments: number
          user_id: string
          created_at: string
          updated_at: string
          is_breaking: boolean
          is_featured: boolean
          is_developing: boolean
          is_exclusive: boolean
          is_sponsored: boolean
          sponsored_by: string | null
          sponsored_url: string | null
          news_type: string | null
          news_priority: number | null
          news_source: string | null
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string[] | null
          related_articles: string[] | null
          tags: string[] | null
          author_notes: string | null
          editor_notes: string | null
          fact_checked: boolean | null
          fact_checker_id: string | null
          fact_checked_at: string | null
          approved_by_id: string | null
          approved_at: string | null
          published_by_id: string | null
          last_updated_by_id: string | null
          original_source_url: string | null
          translation_source_url: string | null
          translation_source_lang: string | null
          translation_notes: string | null
          revision_history: Json | null
          scheduled_notifications: Json | null
          notification_sent: boolean | null
          notification_sent_at: string | null
        }
        Insert: {
          id?: string
          title: string
          heading: string
          social_heading?: string | null
          content: Json
          category_id: number
          subcategory_id?: number | null
          atoll_ids?: number[]
          island_ids?: number[]
          government_ids?: string[] | null
          cover_image?: string | null
          image_caption?: string | null
          status?: string
          publish_date?: string | null
          views?: number
          likes?: number
          comments?: number
          user_id: string
          created_at?: string
          updated_at?: string
          is_breaking?: boolean
          is_featured?: boolean
          is_developing?: boolean
          is_exclusive?: boolean
          is_sponsored?: boolean
          sponsored_by?: string | null
          sponsored_url?: string | null
          news_type?: string | null
          news_priority?: number | null
          news_source?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          related_articles?: string[] | null
          tags?: string[] | null
          author_notes?: string | null
          editor_notes?: string | null
          fact_checked?: boolean | null
          fact_checker_id?: string | null
          fact_checked_at?: string | null
          approved_by_id?: string | null
          approved_at?: string | null
          published_by_id?: string | null
          last_updated_by_id?: string | null
          original_source_url?: string | null
          translation_source_url?: string | null
          translation_source_lang?: string | null
          translation_notes?: string | null
          revision_history?: Json | null
          scheduled_notifications?: Json | null
          notification_sent?: boolean | null
          notification_sent_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          heading?: string
          social_heading?: string | null
          content?: Json
          category_id?: number
          subcategory_id?: number | null
          atoll_ids?: number[]
          island_ids?: number[]
          government_ids?: string[] | null
          cover_image?: string | null
          image_caption?: string | null
          status?: string
          publish_date?: string | null
          views?: number
          likes?: number
          comments?: number
          user_id?: string
          created_at?: string
          updated_at?: string
          is_breaking?: boolean
          is_featured?: boolean
          is_developing?: boolean
          is_exclusive?: boolean
          is_sponsored?: boolean
          sponsored_by?: string | null
          sponsored_url?: string | null
          news_type?: string | null
          news_priority?: number | null
          news_source?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          related_articles?: string[] | null
          tags?: string[] | null
          author_notes?: string | null
          editor_notes?: string | null
          fact_checked?: boolean | null
          fact_checker_id?: string | null
          fact_checked_at?: string | null
          approved_by_id?: string | null
          approved_at?: string | null
          published_by_id?: string | null
          last_updated_by_id?: string | null
          original_source_url?: string | null
          translation_source_url?: string | null
          translation_source_lang?: string | null
          translation_notes?: string | null
          revision_history?: Json | null
          scheduled_notifications?: Json | null
          notification_sent?: boolean | null
          notification_sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: number
          name: string
          name_en: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          name_en: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          name_en?: string
          slug?: string
          created_at?: string
        }
      }
      atolls: {
        Row: {
          id: number
          name: string
          name_en: string
          slug: string
          created_at: string
          island_reference: string | null
          island_reference_dv: string | null
          island_category: string | null
          island_category_en: string | null
        }
        Insert: {
          id?: number
          name: string
          name_en: string
          slug: string
          created_at?: string
          island_reference?: string | null
          island_reference_dv?: string | null
          island_category?: string | null
          island_category_en?: string | null
        }
        Update: {
          id?: number
          name?: string
          name_en?: string
          slug?: string
          created_at?: string
          island_reference?: string | null
          island_reference_dv?: string | null
          island_category?: string | null
          island_category_en?: string | null
        }
      }
    }
  }
}