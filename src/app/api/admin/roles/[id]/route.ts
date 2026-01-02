/**
 * API Route: /api/admin/roles/[id]
 * Manage individual role
 */

import { NextRequest, NextResponse } from 'next/server';
import { withPermission } from '@/lib/middleware/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';

// =====================================================
// PUT /api/admin/roles/[id]
// Update role
// =====================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withPermission(request, 'settings.manage');
  if (auth.error) return auth.error;

  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, permissionIds } = body;

    // Get current role
    // @ts-ignore - Supabase type inference issue
    const { data: currentRole, error: fetchError } = await supabaseAdmin
      .from('roles')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentRole) {
      return NextResponse.json(
        { success: false, error: 'Role not found' },
        { status: 404 }
      );
    }

    // Prevent editing system roles code
    if ((currentRole as any).is_system && body.code && body.code !== (currentRole as any).code) {
      return NextResponse.json(
        { success: false, error: 'Cannot change system role code' },
        { status: 403 }
      );
    }

    // Update role
    const { data: updatedRole, error: updateError } = await supabaseAdmin
      .from('roles')
      // @ts-ignore - Supabase type inference issue
      .update({
        name: name || (currentRole as any).name,
        description: description !== undefined ? description : (currentRole as any).description,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update role error:', updateError);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    // Update permissions if provided
    if (permissionIds) {
      // Delete existing permissions
      await supabaseAdmin.from('role_permissions').delete().eq('role_id', id);

      // Insert new permissions
      if (permissionIds.length > 0) {
        const rolePermissions = permissionIds.map((permId: string) => ({
          role_id: id,
          permission_id: permId,
        }));

        await supabaseAdmin.from('role_permissions').insert(rolePermissions);
      }
    }

    // Audit log
    await logAudit({
      userId: auth.user!.id,
      action: 'update_role',
      tableName: 'roles',
      recordId: id,
      diff: {
        before: currentRole,
        after: updatedRole,
      },
      request,
    });

    return NextResponse.json({
      success: true,
      data: updatedRole,
      message: 'Role updated successfully',
    });
  } catch (error: any) {
    console.error('PUT role failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE /api/admin/roles/[id]
// Delete role
// =====================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withPermission(request, 'settings.manage');
  if (auth.error) return auth.error;

  try {
    const { id } = params;

    // Get role
    // @ts-ignore - Supabase type inference issue
    const { data: role, error: fetchError } = await supabaseAdmin
      .from('roles')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !role) {
      return NextResponse.json(
        { success: false, error: 'Role not found' },
        { status: 404 }
      );
    }

    // Prevent deleting system roles
    if ((role as any).is_system) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete system role' },
        { status: 403 }
      );
    }

    // Check if role has users
    const { count } = await supabaseAdmin
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role_id', id);

    if (count && count > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete role with ${count} assigned users`,
        },
        { status: 409 }
      );
    }

    // Delete role (cascade will delete role_permissions)
    const { error: deleteError } = await supabaseAdmin
      .from('roles')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete role error:', deleteError);
      return NextResponse.json(
        { success: false, error: deleteError.message },
        { status: 500 }
      );
    }

    // Audit log
    await logAudit({
      userId: auth.user!.id,
      action: 'delete_role',
      tableName: 'roles',
      recordId: id,
      diff: { deleted: role },
      request,
    });

    return NextResponse.json({
      success: true,
      message: 'Role deleted successfully',
    });
  } catch (error: any) {
    console.error('DELETE role failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
