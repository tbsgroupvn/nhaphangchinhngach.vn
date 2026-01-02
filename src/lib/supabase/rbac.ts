/**
 * RBAC (Role-Based Access Control) Utilities
 * Handles permission checking, role assignment, and user authorization
 */

import { supabaseAdmin } from './server';
import { supabase } from './client';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface Permission {
  code: string;
  description: string;
  module: string;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  role_id: string;
  role_code: string;
  role_name: string;
  role_description: string;
  assigned_at: string;
}

// =====================================================
// PERMISSION CHECKING (Server-side)
// =====================================================

/**
 * Check if user has a specific permission
 * @param userId - User UUID
 * @param permissionCode - Permission code (e.g., 'users.manage')
 * @returns boolean
 */
export async function checkPermission(
  userId: string,
  permissionCode: string
): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.rpc('has_permission', {
      p_user_id: userId,
      p_permission_code: permissionCode,
    });

    if (error) {
      console.error('Permission check error:', error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error('Permission check failed:', error);
    return false;
  }
}

/**
 * Get all permissions for a user
 * @param userId - User UUID
 * @returns Array of permission codes
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_user_permissions', {
      p_user_id: userId,
    });

    if (error) {
      console.error('Get permissions error:', error);
      return [];
    }

    return data?.map((row: Permission) => row.code) || [];
  } catch (error) {
    console.error('Get permissions failed:', error);
    return [];
  }
}

/**
 * Get detailed permissions for a user
 * @param userId - User UUID
 * @returns Array of Permission objects
 */
export async function getUserPermissionsDetailed(
  userId: string
): Promise<Permission[]> {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_user_permissions', {
      p_user_id: userId,
    });

    if (error) {
      console.error('Get permissions error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get permissions failed:', error);
    return [];
  }
}

// =====================================================
// ROLE MANAGEMENT (Server-side)
// =====================================================

/**
 * Get all roles for a user
 * @param userId - User UUID
 * @returns Array of UserRole objects
 */
export async function getUserRoles(userId: string): Promise<UserRole[]> {
  try {
    const { data, error } = await supabaseAdmin.rpc('get_user_roles', {
      p_user_id: userId,
    });

    if (error) {
      console.error('Get roles error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get roles failed:', error);
    return [];
  }
}

/**
 * Assign a role to user (with audit logging)
 * @param userId - User UUID
 * @param roleCode - Role code (e.g., 'admin', 'editor')
 * @param assignedBy - UUID of user performing the action
 */
export async function assignRole(
  userId: string,
  roleCode: string,
  assignedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin.rpc('assign_role_to_user', {
      p_user_id: userId,
      p_role_code: roleCode,
      p_assigned_by: assignedBy,
    });

    if (error) {
      console.error('Assign role error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Assign role failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Revoke a role from user (with audit logging)
 * @param userId - User UUID
 * @param roleCode - Role code to revoke
 * @param revokedBy - UUID of user performing the action
 */
export async function revokeRole(
  userId: string,
  roleCode: string,
  revokedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabaseAdmin.rpc('revoke_role_from_user', {
      p_user_id: userId,
      p_role_code: roleCode,
      p_revoked_by: revokedBy,
    });

    if (error) {
      console.error('Revoke role error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Revoke role failed:', error);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ROLE & PERMISSION QUERIES (Server-side)
// =====================================================

/**
 * Get all available roles
 */
export async function getAllRoles(): Promise<Role[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('roles')
      .select('*')
      .order('code');

    if (error) {
      console.error('Get all roles error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get all roles failed:', error);
    return [];
  }
}

/**
 * Get all available permissions
 */
export async function getAllPermissions(): Promise<Permission[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('permissions')
      .select('*')
      .order('module, code');

    if (error) {
      console.error('Get all permissions error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get all permissions failed:', error);
    return [];
  }
}

/**
 * Get role with permissions
 */
export async function getRoleWithPermissions(roleId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('roles')
      .select(
        `
        *,
        role_permissions (
          permission:permissions (*)
        )
      `
      )
      .eq('id', roleId)
      .single();

    if (error) {
      console.error('Get role with permissions error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get role with permissions failed:', error);
    return null;
  }
}

// =====================================================
// CLIENT-SIDE HELPERS (for frontend)
// =====================================================

/**
 * Client-side: Check if current user has permission
 * (Uses the session from browser client)
 */
export async function clientCheckPermission(
  permissionCode: string
): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data, error } = await supabase.rpc('has_permission', {
      p_user_id: user.id,
      p_permission_code: permissionCode,
    });

    if (error) {
      console.error('Client permission check error:', error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error('Client permission check failed:', error);
    return false;
  }
}

/**
 * Client-side: Get current user's permissions
 */
export async function clientGetUserPermissions(): Promise<string[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id,
    });

    if (error) {
      console.error('Client get permissions error:', error);
      return [];
    }

    return data?.map((row: Permission) => row.code) || [];
  } catch (error) {
    console.error('Client get permissions failed:', error);
    return [];
  }
}

// =====================================================
// BUSINESS LOGIC HELPERS
// =====================================================

/**
 * Check if user can publish content
 */
export async function canUserPublish(userId: string): Promise<boolean> {
  return checkPermission(userId, 'content.manage');
}

/**
 * Check if user can manage users
 */
export async function canManageUsers(userId: string): Promise<boolean> {
  return checkPermission(userId, 'users.manage');
}

/**
 * Check if user can manage settings
 */
export async function canManageSettings(userId: string): Promise<boolean> {
  return checkPermission(userId, 'settings.manage');
}

/**
 * Check if user can upload media
 */
export async function canUploadMedia(userId: string): Promise<boolean> {
  return checkPermission(userId, 'media.manage');
}
