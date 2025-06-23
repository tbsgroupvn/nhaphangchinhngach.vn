import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Browser client for client components
export const createBrowserClient = () => 
  createClientComponentClient()

// Server client for server components
export const createServerClient = () =>
  createServerComponentClient({ cookies })

// Admin client with service role (for server-side operations)
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Database types (will be generated from Supabase CLI)
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          department: string | null
          position: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          department?: string | null
          position?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          department?: string | null
          position?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          thumbnail_url: string | null
          department: string[]
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          duration_hours: number | null
          is_published: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          department: string[]
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          duration_hours?: number | null
          is_published?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          department?: string[]
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          duration_hours?: number | null
          is_published?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          video_url: string | null
          content: string | null
          attachments: any | null
          lesson_order: number
          duration_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          video_url?: string | null
          content?: string | null
          attachments?: any | null
          lesson_order: number
          duration_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          video_url?: string | null
          content?: string | null
          attachments?: any | null
          lesson_order?: number
          duration_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      quiz_questions: {
        Row: {
          id: string
          lesson_id: string
          question: string
          question_type: 'multiple_choice' | 'true_false' | 'essay'
          options: any | null
          correct_answer: string
          explanation: string | null
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          question: string
          question_type: 'multiple_choice' | 'true_false' | 'essay'
          options?: any | null
          correct_answer: string
          explanation?: string | null
          points?: number
          created_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          question?: string
          question_type?: 'multiple_choice' | 'true_false' | 'essay'
          options?: any | null
          correct_answer?: string
          explanation?: string | null
          points?: number
          created_at?: string
        }
      }
      attempts: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          course_id: string
          quiz_answers: any
          score: number
          max_score: number
          passed: boolean
          completed_at: string
          time_spent_minutes: number | null
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          course_id: string
          quiz_answers: any
          score: number
          max_score: number
          passed: boolean
          completed_at?: string
          time_spent_minutes?: number | null
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          course_id?: string
          quiz_answers?: any
          score?: number
          max_score?: number
          passed?: boolean
          completed_at?: string
          time_spent_minutes?: number | null
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string
          lessons_completed: number
          total_lessons: number
          progress_percentage: number
          started_at: string
          completed_at: string | null
          last_accessed: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          lessons_completed?: number
          total_lessons: number
          progress_percentage?: number
          started_at?: string
          completed_at?: string | null
          last_accessed?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          lessons_completed?: number
          total_lessons?: number
          progress_percentage?: number
          started_at?: string
          completed_at?: string | null
          last_accessed?: string
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