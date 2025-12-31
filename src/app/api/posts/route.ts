import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * API để lấy danh sách bài viết từ Supabase
 * GET /api/posts?status=published&limit=10&offset=0&category=chinh-sach-moi
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'published';
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        featured_image,
        category,
        tags,
        status,
        published_at,
        views,
        created_at,
        updated_at
      `, { count: 'exact' })
      .eq('status', status)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by category if provided
    if (category) {
      query = query.eq('category', category);
    }

    // Search by title if provided
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Fetch posts error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      posts: data || [],
      total: count || 0,
      limit,
      offset,
    });

  } catch (error: any) {
    console.error('Get posts error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
