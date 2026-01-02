/**
 * API Route: /api/public/posts/[slug]
 * Get single published post by slug
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// =====================================================
// GET /api/public/posts/[slug]
// Get published post by slug (public access)
// =====================================================
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Get post - ONLY if published
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        author:author_id (
          id,
          email,
          full_name
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .is('deleted_at', null)
      .single();

    if (error || !post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Increment view count (async, don't wait)
    void (async () => {
      try {
        await supabaseAdmin
          .from('posts')
          // @ts-ignore - Supabase type inference issue
          .update({ views: ((post as any).views || 0) + 1 })
          .eq('id', (post as any).id);
      } catch (e) {
        // Ignore errors
      }
    })();

    return NextResponse.json(
      {
        success: true,
        data: post,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error: any) {
    console.error('GET public post failed:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
