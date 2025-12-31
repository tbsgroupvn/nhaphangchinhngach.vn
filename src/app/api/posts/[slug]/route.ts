import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/server';

/**
 * API để lấy chi tiết một bài viết theo slug
 * GET /api/posts/[slug]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Fetch post by slug
    const { data: post, error } = await supabase
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
        seo_title,
        seo_description,
        seo_keywords,
        created_at,
        updated_at
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Increment view count (using admin client to bypass RLS)
    await (supabaseAdmin as any)
      .from('posts')
      .update({ views: ((post as any).views || 0) + 1 })
      .eq('id', (post as any).id);

    return NextResponse.json({
      success: true,
      post: {
        ...(post as any),
        views: ((post as any).views || 0) + 1, // Return updated view count
      },
    });

  } catch (error: any) {
    console.error('Get post error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
