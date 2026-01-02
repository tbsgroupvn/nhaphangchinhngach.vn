/**
 * API Route: /api/admin/posts/[id]/publish
 * Publish or unpublish a post
 */

import { NextRequest, NextResponse } from 'next/server';
import { withPermission } from '@/lib/middleware/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { logPostPublished, logAudit } from '@/lib/audit';

// =====================================================
// POST /api/admin/posts/[id]/publish
// Publish a post (draft → published)
// =====================================================
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withPermission(request, 'content.manage');
  if (auth.error) return auth.error;

  try {
    const { id } = params;
    const body = await request.json();
    const { action = 'publish' } = body; // 'publish' or 'unpublish' or 'archive'

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

    let newStatus: string;
    let publishedAt: string | null = (currentPost as any).published_at;

    switch (action) {
      case 'publish':
        newStatus = 'published';
        publishedAt = publishedAt || new Date().toISOString();
        break;
      case 'unpublish':
        newStatus = 'draft';
        // Keep published_at for history
        break;
      case 'archive':
        newStatus = 'archived';
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use: publish, unpublish, or archive' },
          { status: 400 }
        );
    }

    // Update post
    const { data: updatedPost, error: updateError } = await supabaseAdmin
      .from('posts')
      // @ts-ignore - Supabase type inference issue
      .update({
        status: newStatus,
        published_at: publishedAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update post status error:', updateError);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    // Audit log
    if (action === 'publish') {
      await logPostPublished(
        auth.user!.id,
        id,
        (updatedPost as any).title,
        request
      );
    } else {
      await logAudit({
        userId: auth.user!.id,
        action: action === 'unpublish' ? 'unpublish_post' : 'archive_post',
        tableName: 'posts',
        recordId: id,
        diff: {
          before: { status: (currentPost as any).status },
          after: { status: newStatus },
        },
        request,
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedPost,
      message: `Post ${action === 'publish' ? 'published' : action === 'unpublish' ? 'unpublished' : 'archived'} successfully`,
    });
  } catch (error: any) {
    console.error('POST publish failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
