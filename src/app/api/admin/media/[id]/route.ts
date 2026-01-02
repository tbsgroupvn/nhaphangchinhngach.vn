/**
 * API Route: /api/admin/media/[id]
 * Manage individual media file
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAnyPermission, withPermission } from '@/lib/middleware/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';

// =====================================================
// GET /api/admin/media/[id]
// Get single media file
// =====================================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withAnyPermission(request, ['media.view', 'media.manage']);
  if (auth.error) return auth.error;

  try {
    const { id } = params;

    const { data: media, error } = await supabaseAdmin
      .from('media_files')
      .select(`
        *,
        uploader:user_id (
          id,
          email,
          full_name
        )
      `)
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error || !media) {
      return NextResponse.json(
        { success: false, error: 'Media file not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: media,
    });
  } catch (error: any) {
    console.error('GET media failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// PUT /api/admin/media/[id]
// Update media metadata
// =====================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withPermission(request, 'media.manage');
  if (auth.error) return auth.error;

  try {
    const { id } = params;
    const body = await request.json();

    // Get current media
    const { data: currentMedia, error: fetchError } = await supabaseAdmin
      .from('media_files')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (fetchError || !currentMedia) {
      return NextResponse.json(
        { success: false, error: 'Media file not found' },
        { status: 404 }
      );
    }

    // Build update data (only metadata, not the file itself)
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.altText !== undefined) updateData.alt_text = body.altText;
    if (body.tags !== undefined) updateData.tags = body.tags;

    // Update media
    const { data: updatedMedia, error: updateError } = await supabaseAdmin
      .from('media_files')
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update media error:', updateError);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    // Audit log
    await logAudit({
      userId: auth.user!.id,
      action: 'update_media',
      tableName: 'media_files',
      recordId: id,
      diff: {
        before: currentMedia,
        after: updatedMedia,
      },
      request,
    });

    return NextResponse.json({
      success: true,
      data: updatedMedia,
      message: 'Media updated successfully',
    });
  } catch (error: any) {
    console.error('PUT media failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE /api/admin/media/[id]
// Delete media file (both storage and database)
// =====================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withPermission(request, 'media.manage');
  if (auth.error) return auth.error;

  try {
    const { id } = params;

    // Get media before deletion
    const { data: media, error: fetchError } = await supabaseAdmin
      .from('media_files')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (fetchError || !media) {
      return NextResponse.json(
        { success: false, error: 'Media file not found' },
        { status: 404 }
      );
    }

    // Extract storage path from URL
    // URL format: https://xxx.supabase.co/storage/v1/object/public/cms-media/yyyy/mm/userId/filename
    const urlParts = media.url.split('/cms-media/');
    const storagePath = urlParts[1];

    // Delete from storage
    if (storagePath) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('cms-media')
        .remove([storagePath]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
        // Continue even if storage delete fails
      }
    }

    // Soft delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('media_files')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (deleteError) {
      console.error('Delete media error:', deleteError);
      return NextResponse.json(
        { success: false, error: deleteError.message },
        { status: 500 }
      );
    }

    // Audit log
    await logAudit({
      userId: auth.user!.id,
      action: 'delete_media',
      tableName: 'media_files',
      recordId: id,
      diff: { deleted: media },
      request,
    });

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error: any) {
    console.error('DELETE media failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
