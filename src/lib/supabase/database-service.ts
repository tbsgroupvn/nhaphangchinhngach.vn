/**
 * Supabase Database Service
 * Provides CRUD operations for all content types
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Use service role key for server-side operations
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseServiceKey &&
    supabaseUrl !== 'https://placeholder.supabase.co' &&
    supabaseServiceKey !== 'placeholder-key')
}

// SERVICES
export const serviceService = {
  async getAll(status?: 'active' | 'inactive') {
    let query = supabaseAdmin.from('services').select('*').order('order_index', { ascending: true })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  },

  async create(service: Database['public']['Tables']['services']['Insert']) {
    const { data, error } = await supabaseAdmin
      .from('services')
      .insert(service)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, service: Database['public']['Tables']['services']['Update']) {
    const { data, error } = await supabaseAdmin
      .from('services')
      .update(service)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('services')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// POSTS
export const postService = {
  async getAll(filters?: { status?: string; category?: string; limit?: number }) {
    let query = supabaseAdmin
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  },

  async create(post: Database['public']['Tables']['posts']['Insert']) {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert(post)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, post: Database['public']['Tables']['posts']['Update']) {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .update(post)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async incrementViews(id: string) {
    const { error } = await supabaseAdmin.rpc('increment_post_views', { post_id: id })
    if (error) throw error
  }
}

// CUSTOMER STORIES
export const customerStoryService = {
  async getAll(status?: 'published' | 'draft' | 'archived') {
    let query = supabaseAdmin
      .from('customer_stories')
      .select('*')
      .order('published_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabaseAdmin
      .from('customer_stories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  },

  async create(story: Database['public']['Tables']['customer_stories']['Insert']) {
    const { data, error } = await supabaseAdmin
      .from('customer_stories')
      .insert(story)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, story: Database['public']['Tables']['customer_stories']['Update']) {
    const { data, error } = await supabaseAdmin
      .from('customer_stories')
      .update(story)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('customer_stories')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// JOBS
export const jobService = {
  async getAll(status?: 'open' | 'closed' | 'draft') {
    let query = supabaseAdmin
      .from('jobs')
      .select('*')
      .order('published_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  },

  async create(job: Database['public']['Tables']['jobs']['Insert']) {
    const { data, error } = await supabaseAdmin
      .from('jobs')
      .insert(job)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, job: Database['public']['Tables']['jobs']['Update']) {
    const { data, error } = await supabaseAdmin
      .from('jobs')
      .update(job)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('jobs')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// SITE SETTINGS
export const settingsService = {
  async get(key: string) {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('*')
      .eq('setting_key', key)
      .single()

    if (error) throw error
    return data
  },

  async getAll() {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('*')

    if (error) throw error
    return data
  },

  async set(key: string, value: any, description?: string) {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .upsert({
        setting_key: key,
        setting_value: value,
        description
      }, {
        onConflict: 'setting_key'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// ANALYTICS & PAGE VIEWS
export const analyticsService = {
  async trackPageView(pageView: {
    page_path: string
    page_title?: string
    content_type?: string
    content_id?: string
    visitor_id?: string
    session_id?: string
    ip_address?: string
    user_agent?: string
    referrer?: string
  }) {
    const { error } = await supabaseAdmin
      .from('page_views')
      .insert(pageView)

    if (error) throw error
  },

  async getPageViews(filters: {
    page_path?: string
    content_type?: string
    content_id?: string
    startDate?: string
    endDate?: string
    limit?: number
  }) {
    let query = supabaseAdmin
      .from('page_views')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters.page_path) {
      query = query.eq('page_path', filters.page_path)
    }

    if (filters.content_type) {
      query = query.eq('content_type', filters.content_type)
    }

    if (filters.content_id) {
      query = query.eq('content_id', filters.content_id)
    }

    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate)
    }

    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  async getStats(filters: {
    startDate?: string
    endDate?: string
  }) {
    // Get total views
    let viewsQuery = supabaseAdmin
      .from('page_views')
      .select('*', { count: 'exact', head: true })

    if (filters.startDate) {
      viewsQuery = viewsQuery.gte('created_at', filters.startDate)
    }

    if (filters.endDate) {
      viewsQuery = viewsQuery.lte('created_at', filters.endDate)
    }

    const { count: totalViews } = await viewsQuery

    // Get unique visitors
    const { data: uniqueVisitors } = await supabaseAdmin
      .from('page_views')
      .select('visitor_id')
      .gte('created_at', filters.startDate || new Date(0).toISOString())
      .lte('created_at', filters.endDate || new Date().toISOString())

    const uniqueCount = new Set(uniqueVisitors?.map(v => v.visitor_id)).size

    // Get popular content
    const { data: popularPages } = await supabaseAdmin
      .from('page_views')
      .select('page_path, page_title, content_type, content_id')
      .gte('created_at', filters.startDate || new Date(0).toISOString())
      .lte('created_at', filters.endDate || new Date().toISOString())

    // Count views per page
    const pageViewCounts = popularPages?.reduce((acc: any, view) => {
      const key = view.page_path
      if (!acc[key]) {
        acc[key] = {
          page_path: view.page_path,
          page_title: view.page_title,
          content_type: view.content_type,
          views: 0
        }
      }
      acc[key].views++
      return acc
    }, {})

    const topPages = Object.values(pageViewCounts || {})
      .sort((a: any, b: any) => b.views - a.views)
      .slice(0, 10)

    return {
      totalViews: totalViews || 0,
      uniqueVisitors: uniqueCount,
      topPages
    }
  }
}

// USER ACTIVITIES
export const activityService = {
  async log(activity: {
    user_id: string
    action: string
    target_type?: string
    target_id?: string
    target_name?: string
    details?: any
    ip_address?: string
    user_agent?: string
  }) {
    const { error } = await supabaseAdmin
      .from('user_activities')
      .insert(activity)

    if (error) throw error
  },

  async getRecent(userId?: string, limit = 50) {
    let query = supabaseAdmin
      .from('user_activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }
}
