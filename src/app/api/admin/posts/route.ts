/**
 * API Route: /api/admin/posts
 * Manage blog posts and articles
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAnyPermission, withPermission } from '@/lib/middleware/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';

// =====================================================
// GET /api/admin/posts
// List all posts with filters
// =====================================================
export async function GET(request: NextRequest) {
  const auth = await withAnyPermission(request, ['content.view', 'content.manage']);
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabaseAdmin
      .from('posts')
      .select(`
        *,
        author:author_id (
          id,
          email,
          full_name
        )
      `, { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: posts, error, count } = await query;

    if (error) {
      console.error('Get posts error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Get statistics
    const { data: stats } = await supabaseAdmin
      .from('posts')
      .select('status', { count: 'exact' })
      .is('deleted_at', null);

    const statusCounts = {
      total: count || 0,
      draft: stats?.filter(p => p.status === 'draft').length || 0,
      published: stats?.filter(p => p.status === 'published').length || 0,
      archived: stats?.filter(p => p.status === 'archived').length || 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        posts: posts || [],
        pagination: {
          total: count || 0,
          limit,
          offset,
          hasMore: (count || 0) > offset + limit,
        },
        stats: statusCounts,
      },
    });
  } catch (error: any) {
    console.error('GET posts failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// POST /api/admin/posts
// Create new post
// =====================================================
export async function POST(request: NextRequest) {
  const auth = await withPermission(request, 'content.manage');
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      status = 'draft',
      seoTitle,
      seoDescription,
      seoKeywords,
    } = body;

    // Validation
    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const { data: existing } = await supabaseAdmin
      .from('posts')
      .select('id')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 409 }
      );
    }

    // Create post
    const { data: newPost, error: createError } = await supabaseAdmin
      .from('posts')
      .insert({
        title,
        slug,
        excerpt: excerpt || '',
        content,
        featured_image: featuredImage || null,
        category: category || null,
        tags: tags || [],
        status: status,
        published_at: status === 'published' ? new Date().toISOString() : null,
        seo_title: seoTitle || title,
        seo_description: seoDescription || excerpt || '',
        seo_keywords: seoKeywords || [],
        author_id: auth.user!.id,
      })
      .select()
      .single();

    if (createError) {
      console.error('Create post error:', createError);
      return NextResponse.json(
        { success: false, error: createError.message },
        { status: 500 }
      );
    }

    // Audit log
    await logAudit({
      userId: auth.user!.id,
      action: 'create_post',
      tableName: 'posts',
      recordId: newPost.id,
      diff: { created: newPost },
      request,
    });

    return NextResponse.json({
      success: true,
      data: newPost,
      message: 'Post created successfully',
    });
  } catch (error: any) {
    console.error('POST posts failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
