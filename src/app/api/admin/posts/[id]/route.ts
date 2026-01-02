/**
 * API Route: /api/admin/posts/[id]
 * Manage individual post
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAnyPermission, withPermission } from '@/lib/middleware/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';

// =====================================================
// GET /api/admin/posts/[id]
// Get single post
// =====================================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withAnyPermission(request, ['content.view', 'content.manage']);
  if (auth.error) return auth.error;

  try {
    const { id } = params;

    // @ts-ignore - Supabase type inference issue
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
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error || !post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    console.error('GET post failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// PUT /api/admin/posts/[id]
// Update post
// =====================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withPermission(request, 'content.manage');
  if (auth.error) return auth.error;

  try {
    const { id } = params;
    const body = await request.json();

    // Get current post
    // @ts-ignore - Supabase type inference issue
    const { data: currentPost, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (fetchError || !currentPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check slug uniqueness if changed
    if (body.slug && body.slug !== (currentPost as any).slug) {
      // @ts-ignore - Supabase type inference issue
      const { data: existing } = await supabaseAdmin
        .from('posts')
        .select('id')
        .eq('slug', body.slug)
        .is('deleted_at', null)
        .neq('id', id)
        .single();

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Slug already exists' },
          { status: 409 }
        );
      }
    }

    // Build update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.featuredImage !== undefined) updateData.featured_image = body.featuredImage;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.seoTitle !== undefined) updateData.seo_title = body.seoTitle;
    if (body.seoDescription !== undefined) updateData.seo_description = body.seoDescription;
    if (body.seoKeywords !== undefined) updateData.seo_keywords = body.seoKeywords;

    // Don't allow direct status change (use publish endpoint)
    // But allow draft → published if explicitly requested
    if (body.status !== undefined && body.status !== (currentPost as any).status) {
      updateData.status = body.status;
      if (body.status === 'published' && !(currentPost as any).published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }

    // Update post
    const { data: updatedPost, error: updateError } = await supabaseAdmin
      .from('posts')
      // @ts-ignore - Supabase type inference issue
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update post error:', updateError);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    // Audit log
    await logAudit({
      userId: auth.user!.id,
      action: 'update_post',
      tableName: 'posts',
      recordId: id,
      diff: {
        before: currentPost,
        after: updatedPost,
      },
      request,
    });

    return NextResponse.json({
      success: true,
      data: updatedPost,
      message: 'Post updated successfully',
    });
  } catch (error: any) {
    console.error('PUT post failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE /api/admin/posts/[id]
// Delete post (soft delete)
// =====================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withPermission(request, 'content.manage');
  if (auth.error) return auth.error;

  try {
    const { id } = params;

    // Get post before deletion
    // @ts-ignore - Supabase type inference issue
    const { data: post, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (fetchError || !post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Soft delete
    const { error: deleteError } = await supabaseAdmin
      .from('posts')
      // @ts-ignore - Supabase type inference issue
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (deleteError) {
      console.error('Delete post error:', deleteError);
      return NextResponse.json(
        { success: false, error: deleteError.message },
        { status: 500 }
      );
    }

    // Audit log
    await logAudit({
      userId: auth.user!.id,
      action: 'delete_post',
      tableName: 'posts',
      recordId: id,
      diff: { deleted: post },
      request,
    });

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error: any) {
    console.error('DELETE post failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
