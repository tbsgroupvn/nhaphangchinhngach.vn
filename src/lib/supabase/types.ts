// Supabase database types
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
      users: {
        Row: {
          id: string
          username: string
          email: string
          full_name: string
          phone: string | null
          avatar_url: string | null
          password_hash: string
          role: 'super_admin' | 'admin' | 'editor' | 'viewer'
          status: 'active' | 'inactive' | 'banned'
          email_verified: boolean
          two_factor_enabled: boolean
          two_factor_secret: string | null
          login_attempts: number
          locked_until: string | null
          last_login: string | null
          last_login_ip: string | null
          password_reset_token: string | null
          password_reset_expires: string | null
          email_verification_token: string | null
          email_verification_expires: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          username: string
          email: string
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          password_hash: string
          role?: 'super_admin' | 'admin' | 'editor' | 'viewer'
          status?: 'active' | 'inactive' | 'banned'
          email_verified?: boolean
          two_factor_enabled?: boolean
          two_factor_secret?: string | null
          login_attempts?: number
          locked_until?: string | null
          last_login?: string | null
          last_login_ip?: string | null
          password_reset_token?: string | null
          password_reset_expires?: string | null
          email_verification_token?: string | null
          email_verification_expires?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          username?: string
          email?: string
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          password_hash?: string
          role?: 'super_admin' | 'admin' | 'editor' | 'viewer'
          status?: 'active' | 'inactive' | 'banned'
          email_verified?: boolean
          two_factor_enabled?: boolean
          two_factor_secret?: string | null
          login_attempts?: number
          locked_until?: string | null
          last_login?: string | null
          last_login_ip?: string | null
          password_reset_token?: string | null
          password_reset_expires?: string | null
          email_verification_token?: string | null
          email_verification_expires?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          featured_image: string | null
          category: string | null
          tags: string[]
          status: 'draft' | 'published' | 'archived'
          published_at: string | null
          views: number
          author_id: string
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          featured_image?: string | null
          category?: string | null
          tags?: string[]
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          views?: number
          author_id: string
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          featured_image?: string | null
          category?: string | null
          tags?: string[]
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          views?: number
          author_id?: string
          seo_title?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          content: string
          icon: string | null
          featured_image: string | null
          price_text: string | null
          price_from: number | null
          price_to: number | null
          features: Json | null
          order_index: number
          status: 'active' | 'inactive'
          author_id: string
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          content: string
          icon?: string | null
          featured_image?: string | null
          price_text?: string | null
          price_from?: number | null
          price_to?: number | null
          features?: Json | null
          order_index?: number
          status?: 'active' | 'inactive'
          author_id: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          content?: string
          icon?: string | null
          featured_image?: string | null
          price_text?: string | null
          price_from?: number | null
          price_to?: number | null
          features?: Json | null
          order_index?: number
          status?: 'active' | 'inactive'
          author_id?: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      media_files: {
        Row: {
          id: string
          name: string
          type: 'image' | 'video' | 'document' | 'audio'
          url: string
          thumbnail_url: string | null
          size: number
          dimensions: Json | null
          uploaded_at: string
          folder_id: string | null
          tags: string[]
          downloads: number
          description: string | null
          alt_text: string | null
          user_id: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          type: 'image' | 'video' | 'document' | 'audio'
          url: string
          thumbnail_url?: string | null
          size: number
          dimensions?: Json | null
          uploaded_at?: string
          folder_id?: string | null
          tags?: string[]
          downloads?: number
          description?: string | null
          alt_text?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          type?: 'image' | 'video' | 'document' | 'audio'
          url?: string
          thumbnail_url?: string | null
          size?: number
          dimensions?: Json | null
          uploaded_at?: string
          folder_id?: string | null
          tags?: string[]
          downloads?: number
          description?: string | null
          alt_text?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
      }
      folders: {
        Row: {
          id: string
          name: string
          parent_id: string | null
          item_count: number
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          item_count?: number
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          item_count?: number
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          description: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: Json
          description?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          setting_key?: string
          setting_value?: Json
          description?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_token: string
          refresh_token: string | null
          ip_address: string | null
          user_agent: string | null
          expires_at: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_token: string
          refresh_token?: string | null
          ip_address?: string | null
          user_agent?: string | null
          expires_at: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_token?: string
          refresh_token?: string | null
          ip_address?: string | null
          user_agent?: string | null
          expires_at?: string
          is_active?: boolean
          created_at?: string
        }
      }
      user_activities: {
        Row: {
          id: string
          user_id: string
          action: string
          target_type: string | null
          target_id: string | null
          target_name: string | null
          details: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          target_type?: string | null
          target_id?: string | null
          target_name?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          target_type?: string | null
          target_id?: string | null
          target_name?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
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
