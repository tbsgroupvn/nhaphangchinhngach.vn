/**
 * API Route: /api/admin/users
 * Manage users
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAnyPermission, withPermission } from '@/lib/middleware/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getUserPermissions, getUserRoles } from '@/lib/supabase/rbac';
import { logUserCreated, logUserUpdated, logUserDeleted } from '@/lib/audit';

// =====================================================
// GET /api/admin/users
// Get all users with their roles and permissions
// =====================================================
export async function GET(request: NextRequest) {
  // Users can view if they have either permission
  const auth = await withAnyPermission(request, ['users.view', 'users.manage']);
  if (auth.error) return auth.error;

  try {
    // Get all users from users_profile
    const { data: users, error } = await supabaseAdmin
      .from('users_profile')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get users error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Enrich with roles and permissions
    const enrichedUsers = await Promise.all(
      (users || []).map(async (user) => {
        const roles = await getUserRoles(user.id);
        const permissions = await getUserPermissions(user.id);

        return {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          phone: user.phone,
          avatar: user.avatar_url,
          status: user.status,
          lastLogin: user.last_login_at,
          lastLoginIp: user.last_login_ip,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          roles: roles.map((r) => r.role_code),
          permissions,
        };
      })
    );

    // Get statistics
    const stats = {
      total: enrichedUsers.length,
      active: enrichedUsers.filter((u) => u.status === 'active').length,
      inactive: enrichedUsers.filter((u) => u.status === 'inactive').length,
      banned: enrichedUsers.filter((u) => u.status === 'banned').length,
      recentLogins: enrichedUsers.filter((u) => {
        if (!u.lastLogin) return false;
        const loginDate = new Date(u.lastLogin);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return loginDate > weekAgo;
      }).length,
    };

    return NextResponse.json({
      success: true,
      data: {
        users: enrichedUsers,
        stats,
      },
    });
  } catch (error: any) {
    console.error('GET users failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// POST /api/admin/users
// Create new user (via Supabase Auth)
// =====================================================
export async function POST(request: NextRequest) {
  const auth = await withPermission(request, 'users.manage');
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { email, password, fullName, phone, roleCode } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName || '',
        },
      });

    if (authError) {
      console.error('Create auth user error:', authError);
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 500 }
      );
    }

    const newUserId = authData.user.id;

    // Update profile with additional info
    if (fullName || phone) {
      await supabaseAdmin
        .from('users_profile')
        .update({
          full_name: fullName || '',
          phone: phone || '',
        })
        .eq('id', newUserId);
    }

    // Assign role if provided
    if (roleCode) {
      const { data: role } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('code', roleCode)
        .single();

      if (role) {
        await supabaseAdmin.from('user_roles').insert({
          user_id: newUserId,
          role_id: role.id,
          assigned_by: auth.user!.id,
        });
      }
    }

    // Audit log
    await logUserCreated(
      auth.user!.id,
      newUserId,
      {
        email,
        full_name: fullName,
        phone,
        role_code: roleCode,
      },
      request
    );

    return NextResponse.json({
      success: true,
      data: {
        id: newUserId,
        email,
        fullName,
        phone,
      },
      message: 'User created successfully',
    });
  } catch (error: any) {
    console.error('POST users failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// PUT /api/admin/users
// Update user
// =====================================================
export async function PUT(request: NextRequest) {
  const auth = await withPermission(request, 'users.manage');
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { id, fullName, phone, status, avatarUrl } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get current user data
    const { data: currentUser } = await supabaseAdmin
      .from('users_profile')
      .select('*')
      .eq('id', id)
      .single();

    // Update profile
    const updateData: any = {};
    if (fullName !== undefined) updateData.full_name = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (status !== undefined) updateData.status = status;
    if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl;

    const { data: updatedUser, error } = await supabaseAdmin
      .from('users_profile')
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update user error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Audit log
    await logUserUpdated(
      auth.user!.id,
      id,
      currentUser,
      updatedUser,
      request
    );

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully',
    });
  } catch (error: any) {
    console.error('PUT users failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE /api/admin/users
// Delete user
// =====================================================
export async function DELETE(request: NextRequest) {
  const auth = await withPermission(request, 'users.manage');
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prevent self-deletion
    if (userId === auth.user!.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete yourself' },
        { status: 403 }
      );
    }

    // Get user data before deletion
    const { data: userData } = await supabaseAdmin
      .from('users_profile')
      .select('*')
      .eq('id', userId)
      .single();

    // Delete from Supabase Auth (cascade will delete profile)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    );

    if (authError) {
      console.error('Delete auth user error:', authError);
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 500 }
      );
    }

    // Audit log
    await logUserDeleted(auth.user!.id, userId, userData, request);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error('DELETE users failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
