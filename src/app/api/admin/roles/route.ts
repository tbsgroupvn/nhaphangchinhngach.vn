/**
 * API Route: /api/admin/roles
 * Manage roles and permissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { withPermission } from '@/lib/middleware/auth';
import { getAllRoles } from '@/lib/supabase/rbac';
import { supabaseAdmin } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';

// =====================================================
// GET /api/admin/roles
// Get all roles with their permissions
// =====================================================
export async function GET(request: NextRequest) {
  // Verify authentication and permission
  const auth = await withPermission(request, 'settings.view');
  if (auth.error) return auth.error;

  try {
    // Get all roles with permissions
    // @ts-ignore - Supabase type inference issue
    const { data: roles, error } = await supabaseAdmin
      .from('roles')
      .select(
        `
        id,
        name,
        code,
        description,
        is_system,
        created_at,
        updated_at,
        role_permissions (
          permission:permissions (
            id,
            code,
            description,
            module
          )
        )
      `
      )
      .order('code');

    if (error) {
      console.error('Get roles error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Transform data to include permission count
    const rolesWithStats = await Promise.all(
      (roles || []).map(async (role: any) => {
        // Count users with this role
        const { count } = await supabaseAdmin
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .eq('role_id', role.id);

        return {
          ...role,
          permissions:
            role.role_permissions?.map((rp: any) => rp.permission) || [],
          userCount: count || 0,
        };
      })
    );

    // Remove the nested role_permissions
    const cleanedRoles = rolesWithStats.map((role: any) => {
      const { role_permissions, ...rest } = role;
      return rest;
    });

    return NextResponse.json({
      success: true,
      data: cleanedRoles,
    });
  } catch (error: any) {
    console.error('GET roles failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// POST /api/admin/roles
// Create a new role
// =====================================================
export async function POST(request: NextRequest) {
  // Verify authentication and permission
  const auth = await withPermission(request, 'settings.manage');
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { name, code, description, permissionIds } = body;

    // Validation
    if (!name || !code) {
      return NextResponse.json(
        { success: false, error: 'Name and code are required' },
        { status: 400 }
      );
    }

    // Check if code already exists
    // @ts-ignore - Supabase type inference issue
    const { data: existing } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('code', code)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Role code already exists' },
        { status: 409 }
      );
    }

    // Create role
    const { data: newRole, error: createError } = await supabaseAdmin
      .from('roles')
      // @ts-ignore - Supabase type inference issue
      .insert({
        name,
        code,
        description: description || '',
        is_system: false,
      })
      .select()
      .single();

    if (createError) {
      console.error('Create role error:', createError);
      return NextResponse.json(
        { success: false, error: createError.message },
        { status: 500 }
      );
    }

    // Assign permissions if provided
    if (permissionIds && permissionIds.length > 0) {
      const rolePermissions = permissionIds.map((permId: string) => ({
        role_id: (newRole as any).id,
        permission_id: permId,
      }));

      const { error: permError } = await supabaseAdmin
        .from('role_permissions')
        .insert(rolePermissions);

      if (permError) {
        console.error('Assign permissions error:', permError);
        // Don't fail the entire operation, just log
      }
    }

    // Audit log
    await logAudit({
      userId: auth.user!.id,
      action: 'create_role',
      tableName: 'roles',
      recordId: (newRole as any).id,
      diff: { created: newRole },
      request,
    });

    return NextResponse.json({
      success: true,
      data: newRole,
      message: 'Role created successfully',
    });
  } catch (error: any) {
    console.error('POST roles failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
