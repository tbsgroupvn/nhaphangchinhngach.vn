/**
 * API Route: /api/admin/services/[id]/publish
 * Activate or deactivate a service
 */

import { NextRequest, NextResponse } from 'next/server';
import { withPermission } from '@/lib/middleware/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { logServicePublished, logAudit } from '@/lib/audit';

// =====================================================
// POST /api/admin/services/[id]/publish
// Activate or deactivate a service
// =====================================================
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withPermission(request, 'services.manage');
  if (auth.error) return auth.error;

  try {
    const { id } = params;
    const body = await request.json();
    const { action = 'activate' } = body; // 'activate' or 'deactivate'

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

    const newStatus = action === 'activate' ? 'active' : 'inactive';

    // Update service
    const { data: updatedService, error: updateError } = await supabaseAdmin
      .from('services')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update service status error:', updateError);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    // Audit log
    if (action === 'activate') {
      await logServicePublished(
        auth.user!.id,
        id,
        updatedService.title,
        request
      );
    } else {
      await logAudit({
        userId: auth.user!.id,
        action: 'unpublish_service',
        tableName: 'services',
        recordId: id,
        diff: {
          before: { status: currentService.status },
          after: { status: newStatus },
        },
        request,
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedService,
      message: `Service ${action === 'activate' ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error: any) {
    console.error('POST publish failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
