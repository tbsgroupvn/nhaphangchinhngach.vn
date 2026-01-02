/**
 * API Route: /api/public/posts
 * Public API for published posts
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// =====================================================
// GET /api/public/posts
// Get published posts (public access)
// =====================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const featured = searchParams.get('featured');

    // Build query - ONLY published posts
    let query = supabaseAdmin
      .from('posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        category,
        tags,
        published_at,
        views,
        seo_title,
        seo_description,
        author:author_id (
          id,
          email,
          full_name
        )
      `, { count: 'exact' })
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('published_at', { ascending: false });

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }

    if (tag) {
      query = query.contains('tags', [tag]);
    }

    if (featured === 'true') {
      // If you have a featured flag, add it here
      // query = query.eq('featured', true);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: posts, error, count } = await query;

    if (error) {
      console.error('Get public posts error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    // Increment view count for each post (async, don't wait)
    if (posts && posts.length > 0) {
      posts.forEach((post: any) => {
        void (async () => {
          try {
            await supabaseAdmin
              .from('posts')
              // @ts-ignore - Supabase type inference issue
              .update({ views: (post.views || 0) + 1 })
              .eq('id', post.id);
          } catch (e) {
            // Ignore errors
          }
        })();
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          posts: posts || [],
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
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch (error: any) {
    console.error('GET public posts failed:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
