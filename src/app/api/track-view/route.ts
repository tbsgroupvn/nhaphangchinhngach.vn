import { NextRequest, NextResponse } from 'next/server'
import { analyticsService, isSupabaseConfigured } from '../../../lib/supabase/database-service'

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: false,
        message: 'Analytics tracking not configured'
      }, { status: 200 }) // Return 200 to avoid errors on client
    }

    const body = await request.json()
    const {
      page_path,
      page_title,
      content_type,
      content_id
    } = body

    // Get client info
    const ip_address = request.headers.get('x-forwarded-for') ||
                       request.headers.get('x-real-ip') ||
                       'unknown'
    const user_agent = request.headers.get('user-agent') || 'unknown'
    const referrer = request.headers.get('referer') || request.headers.get('referrer') || null

    // Generate visitor ID (in production, you might want to use cookies or a more sophisticated method)
    const visitor_id = request.cookies.get('visitor_id')?.value ||
                       `${ip_address}-${new Date().getTime()}`

    // Track the page view
    await analyticsService.trackPageView({
      page_path,
      page_title,
      content_type,
      content_id,
      visitor_id,
      ip_address,
      user_agent,
      referrer
    })

    // Set visitor cookie if not exists
    const response = NextResponse.json({ success: true })
    if (!request.cookies.get('visitor_id')) {
      response.cookies.set('visitor_id', visitor_id, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        sameSite: 'lax'
      })
    }

    return response

  } catch (error) {
    console.error('Error tracking page view:', error)
    // Don't fail the request, just log the error
    return NextResponse.json({
      success: false,
      error: 'Failed to track view'
    }, { status: 200 })
  }
}
