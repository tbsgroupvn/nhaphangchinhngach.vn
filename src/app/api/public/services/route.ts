/**
 * API Route: /api/public/services
 * Public API for active services
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// =====================================================
// GET /api/public/services
// Get active services (public access)
// =====================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query - ONLY active services
    let query = supabaseAdmin
      .from('services')
      .select(`
        id,
        title,
        slug,
        description,
        icon,
        featured_image,
        price_text,
        price_from,
        price_to,
        features,
        order_index,
        seo_title,
        seo_description,
        created_at
      `, { count: 'exact' })
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: services, error, count } = await query;

    if (error) {
      console.error('Get public services error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch services' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          services: services || [],
          pagination: {
            total: count || 0,
            limit,
            offset,
            hasMore: (count || 0) > offset + limit,
          },
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error: any) {
    console.error('GET public services failed:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
