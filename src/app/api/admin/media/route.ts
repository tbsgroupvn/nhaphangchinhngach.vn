/**
 * API Route: /api/admin/media
 * List and manage media files
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAnyPermission } from '@/lib/middleware/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

// =====================================================
// GET /api/admin/media
// List media files with filters
// =====================================================
export async function GET(request: NextRequest) {
  const auth = await withAnyPermission(request, ['media.view', 'media.manage']);
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // image, video, document, audio
    const search = searchParams.get('search');
    const tags = searchParams.get('tags'); // comma-separated
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    let query = supabaseAdmin
      .from('media_files')
      .select(`
        *,
        uploader:user_id (
          id,
          email,
          full_name
        )
      `, { count: 'exact' })
      .is('deleted_at', null);

    // Apply filters
    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,original_name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      query = query.overlaps('tags', tagArray);
    }

    // Sort
    const ascending = sortOrder === 'asc';
    if (sortBy === 'name') {
      query = query.order('name', { ascending });
    } else if (sortBy === 'size') {
      query = query.order('size', { ascending });
    } else if (sortBy === 'type') {
      query = query.order('type', { ascending });
    } else {
      query = query.order('created_at', { ascending });
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: media, error, count } = await query;

    if (error) {
      console.error('Get media error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Get statistics
    // @ts-ignore - Supabase type inference issue
    const { data: stats } = await supabaseAdmin
      .from('media_files')
      .select('type, size', { count: 'exact' })
      .is('deleted_at', null);

    const typeStats = {
      total: count || 0,
      image: (stats as any)?.filter((m: any) => m.type === 'image').length || 0,
      video: (stats as any)?.filter((m: any) => m.type === 'video').length || 0,
      document: (stats as any)?.filter((m: any) => m.type === 'document').length || 0,
      audio: (stats as any)?.filter((m: any) => m.type === 'audio').length || 0,
      totalSize: (stats as any)?.reduce((sum: number, m: any) => sum + (m.size || 0), 0) || 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        media: media || [],
        pagination: {
          total: count || 0,
          limit,
          offset,
          hasMore: (count || 0) > offset + limit,
        },
        stats: typeStats,
      },
    });
  } catch (error: any) {
    console.error('GET media failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
