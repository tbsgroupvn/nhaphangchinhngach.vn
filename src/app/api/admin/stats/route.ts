import { NextResponse } from 'next/server'
import { contentManager } from '../../../../lib/content-manager'
import {
  serviceService,
  postService,
  customerStoryService,
  jobService,
  isSupabaseConfigured
} from '../../../../lib/supabase/database-service'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    // Check if Supabase is configured
    const useSupabase = isSupabaseConfigured()

    let stats

    if (useSupabase) {
      // Get data from Supabase
      stats = await getStatsFromSupabase()
    } else {
      // Fallback to markdown files
      stats = await getStatsFromMarkdown()
    }

    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
      source: useSupabase ? 'supabase' : 'markdown'
    })

  } catch (error) {
    console.error('Error fetching real stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

async function getStatsFromSupabase() {
  // Get all content from Supabase
  const [services, allPosts, customerStories, jobs, pages] = await Promise.all([
    serviceService.getAll(),
    postService.getAll(),
    customerStoryService.getAll(),
    jobService.getAll(),
    getStaticPages()
  ])

  // Filter posts - with proper type handling
  const posts = (allPosts || []) as Array<{ title: string; status: string; category?: string; createdAt?: string; created_at?: string; slug: string; views?: number; [key: string]: any }>
  const publishedPosts = posts.filter(p => p.status === 'published')
  const draftPosts = posts.filter(p => p.status === 'draft')

  // Type assertions for other content types
  const typedServices = (services || []) as Array<{ title: string; slug: string; views?: number; [key: string]: any }>
  const typedCustomerStories = (customerStories || []) as Array<{ title: string; slug: string; status?: string; createdAt?: string; created_at?: string; views?: number; [key: string]: any }>
  const typedJobs = (jobs || []) as Array<{ title: string; createdAt?: string; created_at?: string; category?: string; [key: string]: any }>

  // Calculate statistics
  const stats = {
    // Content counts
    totalServices: typedServices.length,
    totalPosts: posts.length,
    publishedPosts: publishedPosts.length,
    draftPosts: draftPosts.length,
    totalCustomerStories: typedCustomerStories.length,
    totalJobs: typedJobs.length,
    totalPages: pages.length,
    totalContent: typedServices.length + posts.length + typedCustomerStories.length + typedJobs.length + pages.length,

    // Content by category
    contentByCategory: {
      services: typedServices.length,
      news: posts.filter(p => p.category?.includes('tin-tuc')).length,
      guides: posts.filter(p => p.category?.includes('cam-nang')).length,
      customerStories: typedCustomerStories.length,
      jobs: typedJobs.length,
      pages: pages.length
    },

    // Recent activity (last 7 days) - using real data
    recentActivity: getRecentActivity([...posts, ...typedCustomerStories, ...typedJobs]),

    // Popular content - using real view counts from Supabase
    popularContent: getPopularContent(typedServices, posts, typedCustomerStories),

    // Website health
    websiteHealth: {
      totalFiles: typedServices.length + posts.length + typedCustomerStories.length + typedJobs.length + pages.length,
      lastUpdated: new Date().toISOString(),
      contentStatus: 'healthy'
    }
  }

  return stats
}

async function getStatsFromMarkdown() {
  // Original implementation - get from markdown files
  const [services, posts, customerStories, jobs, pages] = await Promise.all([
    contentManager.getServices(),
    contentManager.getPosts(),
    contentManager.getCustomerStories(),
    contentManager.getJobs(),
    getStaticPages()
  ])

  // Calculate real statistics
  const stats = {
    // Content counts
    totalServices: services.length,
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.status === 'published').length,
    draftPosts: posts.filter(p => p.status === 'draft').length,
    totalCustomerStories: customerStories.length,
    totalJobs: jobs.length,
    totalPages: pages.length,
    totalContent: services.length + posts.length + customerStories.length + jobs.length + pages.length,

    // Content by category
    contentByCategory: {
      services: services.length,
      news: posts.filter(p => p.category?.includes('tin-tuc')).length,
      guides: posts.filter(p => p.category?.includes('cam-nang')).length,
      customerStories: customerStories.length,
      jobs: jobs.length,
      pages: pages.length
    },

    // Recent activity (last 7 days)
    recentActivity: getRecentActivity([...posts, ...customerStories, ...jobs]),

    // Popular content (based on content type and recency)
    popularContent: getPopularContent(services, posts, customerStories),

    // Website health
    websiteHealth: {
      totalFiles: services.length + posts.length + customerStories.length + jobs.length + pages.length,
      lastUpdated: new Date().toISOString(),
      contentStatus: 'healthy'
    }
  }

  return stats
}

async function getStaticPages() {
  try {
    const pagesDir = path.join(process.cwd(), 'content', 'pages')
    const files = await fs.readdir(pagesDir)
    return files.filter(file => file.endsWith('.md')).map(file => ({
      id: file.replace('.md', ''),
      title: file.replace('.md', '').replace(/-/g, ' '),
      path: file
    }))
  } catch (error) {
    return []
  }
}

function getRecentActivity(allContent: Array<{createdAt?: string, created_at?: string, title: string, category?: string}>) {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  return allContent
    .filter(item => {
      const itemDate = item.createdAt || item.created_at
      return itemDate && new Date(itemDate) >= sevenDaysAgo
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at || 0).getTime()
      const dateB = new Date(b.createdAt || b.created_at || 0).getTime()
      return dateB - dateA
    })
    .slice(0, 5)
    .map(item => ({
      title: item.title,
      date: item.createdAt || item.created_at || new Date().toISOString(),
      type: item.category || 'content'
    }))
}

function getPopularContent(services: any[], posts: any[], stories: any[]) {
  const allContent = [
    ...services.map(s => ({
      ...s,
      type: 'service',
      views: s.views || 0,
      priority: 10
    })),
    ...posts.map(p => ({
      ...p,
      type: 'post',
      views: p.views || 0,
      priority: 8
    })),
    ...stories.map(s => ({
      ...s,
      type: 'story',
      views: s.views || 0,
      priority: 6
    }))
  ]

  // Sort by views first, then by priority
  return allContent
    .sort((a, b) => {
      if (b.views !== a.views) {
        return b.views - a.views
      }
      return b.priority - a.priority
    })
    .slice(0, 5)
    .map(item => ({
      title: item.title,
      type: item.type,
      slug: item.slug,
      views: item.views
    }))
}
