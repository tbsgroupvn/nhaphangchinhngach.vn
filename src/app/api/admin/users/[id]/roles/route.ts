/**
 * API Route: /api/admin/users/[id]/roles
 * Manage user role assignments
 */

import { NextRequest, NextResponse } from 'next/server';
import { withPermission } from '@/lib/middleware/auth';
import { assignRole, revokeRole, getUserRoles } from '@/lib/supabase/rbac';

// =====================================================
// GET /api/admin/users/[id]/roles
// Get roles for a specific user
// =====================================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withPermission(request, 'users.view');
  if (auth.error) return auth.error;

  try {
    const { id: userId } = params;

    const roles = await getUserRoles(userId);

    return NextResponse.json({
      success: true,
      data: roles,
    });
  } catch (error: any) {
    console.error('GET user roles failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// POST /api/admin/users/[id]/roles
// Assign role to user
// =====================================================
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withPermission(request, 'users.manage');
  if (auth.error) return auth.error;

  try {
    const { id: userId } = params;
    const body = await request.json();
    const { roleCode } = body;

    if (!roleCode) {
      return NextResponse.json(
        { success: false, error: 'Role code is required' },
        { status: 400 }
      );
    }

    // Assign role
    const result = await assignRole(userId, roleCode, auth.user!.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Role ${roleCode} assigned successfully`,
    });
  } catch (error: any) {
    console.error('POST user role failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE /api/admin/users/[id]/roles
// Revoke role from user
// =====================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await withPermission(request, 'users.manage');
  if (auth.error) return auth.error;

  try {
    const { id: userId } = params;
    const { searchParams } = new URL(request.url);
    const roleCode = searchParams.get('roleCode');

    if (!roleCode) {
      return NextResponse.json(
        { success: false, error: 'Role code is required' },
        { status: 400 }
      );
    }

    // Revoke role
    const result = await revokeRole(userId, roleCode, auth.user!.id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Role ${roleCode} revoked successfully`,
    });
  } catch (error: any) {
    console.error('DELETE user role failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
