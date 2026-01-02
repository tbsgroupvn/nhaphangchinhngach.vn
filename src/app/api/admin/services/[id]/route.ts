/**
 * API Route: /api/admin/services/[id]
 * Manage individual service
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAnyPermission, withPermission } from '@/lib/middleware/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';

// =====================================================
// GET /api/admin/services/[id]
// Get single service
// =====================================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withAnyPermission(request, ['services.view', 'services.manage']);
  if (auth.error) return auth.error;

  try {
    const { id } = params;

    const { data: service, error } = await supabaseAdmin
      .from('services')
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

    if (error || !service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error: any) {
    console.error('GET service failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// PUT /api/admin/services/[id]
// Update service
// =====================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withPermission(request, 'services.manage');
  if (auth.error) return auth.error;

  try {
    const { id } = params;
    const body = await request.json();

    // Get current service
    const { data: currentService, error: fetchError } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (fetchError || !currentService) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    // Check slug uniqueness if changed
    if (body.slug && body.slug !== currentService.slug) {
      const { data: existing } = await supabaseAdmin
        .from('services')
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
    if (body.description !== undefined) updateData.description = body.description;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.featuredImage !== undefined) updateData.featured_image = body.featuredImage;
    if (body.priceText !== undefined) updateData.price_text = body.priceText;
    if (body.priceFrom !== undefined) updateData.price_from = body.priceFrom;
    if (body.priceTo !== undefined) updateData.price_to = body.priceTo;
    if (body.features !== undefined) updateData.features = body.features;
    if (body.orderIndex !== undefined) updateData.order_index = body.orderIndex;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.seoTitle !== undefined) updateData.seo_title = body.seoTitle;
    if (body.seoDescription !== undefined) updateData.seo_description = body.seoDescription;

    // Update service
    const { data: updatedService, error: updateError } = await supabaseAdmin
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update service error:', updateError);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    // Audit log
    await logAudit({
      userId: auth.user!.id,
      action: 'update_service',
      tableName: 'services',
      recordId: id,
      diff: {
        before: currentService,
        after: updatedService,
      },
      request,
    });

    return NextResponse.json({
      success: true,
      data: updatedService,
      message: 'Service updated successfully',
    });
  } catch (error: any) {
    console.error('PUT service failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE /api/admin/services/[id]
// Delete service (soft delete)
// =====================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withPermission(request, 'services.manage');
  if (auth.error) return auth.error;

  try {
    const { id } = params;

    // Get service before deletion
    const { data: service, error: fetchError } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (fetchError || !service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    // Soft delete
    const { error: deleteError } = await supabaseAdmin
      .from('services')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (deleteError) {
      console.error('Delete service error:', deleteError);
      return NextResponse.json(
        { success: false, error: deleteError.message },
        { status: 500 }
      );
    }

    // Audit log
    await logAudit({
      userId: auth.user!.id,
      action: 'delete_service',
      tableName: 'services',
      recordId: id,
      diff: { deleted: service },
      request,
    });

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error: any) {
    console.error('DELETE service failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
