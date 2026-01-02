/**
 * Audit Logging Utilities
 * Track all user actions for security and compliance
 */

import { supabaseAdmin } from './supabase/server';
import { NextRequest } from 'next/server';
import { getClientIp, getUserAgent } from './middleware/auth';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface AuditLogParams {
  userId: string;
  action: string;
  tableName?: string;
  recordId?: string;
  diff?: any;
  request?: NextRequest;
  actorEmail?: string;
}

export type AuditAction =
  // User actions
  | 'create_user'
  | 'update_user'
  | 'delete_user'
  | 'assign_role'
  | 'revoke_role'
  | 'login'
  | 'logout'
  | 'password_reset'
  // Content actions
  | 'create_post'
  | 'update_post'
  | 'delete_post'
  | 'publish_post'
  | 'unpublish_post'
  | 'archive_post'
  // Service actions
  | 'create_service'
  | 'update_service'
  | 'delete_service'
  | 'publish_service'
  | 'unpublish_service'
  // Media actions
  | 'upload_media'
  | 'delete_media'
  | 'update_media'
  // Settings actions
  | 'update_settings'
  | 'create_role'
  | 'update_role'
  | 'delete_role'
  // Generic
  | string;

// =====================================================
// MAIN AUDIT LOGGING FUNCTION
// =====================================================

/**
 * Log an audit event
 * @param params - Audit log parameters
 */
export async function logAudit(params: AuditLogParams): Promise<void> {
  try {
    const {
      userId,
      action,
      tableName,
      recordId,
      diff,
      request,
      actorEmail,
    } = params;

    // Extract request metadata if provided
    const ipAddress = request ? getClientIp(request) : null;
    const userAgent = request ? getUserAgent(request) : null;

    // Insert audit log
    const { error } = await supabaseAdmin.from('audit_logs')
      // @ts-ignore - Supabase type inference issue
      .insert({
        actor_id: userId,
        actor_email: actorEmail,
        action,
        table_name: tableName,
        record_id: recordId,
        diff: diff ? JSON.parse(JSON.stringify(diff)) : null,
        ip_address: ipAddress,
        user_agent: userAgent,
    });

    if (error) {
      console.error('Failed to log audit:', error);
      // Don't throw - audit logging should not break the main flow
    }
  } catch (error) {
    console.error('Audit logging error:', error);
    // Silent fail - don't break the main operation
  }
}

// =====================================================
// SPECIALIZED AUDIT FUNCTIONS
// =====================================================

/**
 * Log user creation
 */
export async function logUserCreated(
  actorId: string,
  newUserId: string,
  userData: any,
  request?: NextRequest
) {
  await logAudit({
    userId: actorId,
    action: 'create_user',
    tableName: 'users_profile',
    recordId: newUserId,
    diff: {
      created: userData,
    },
    request,
  });
}

/**
 * Log user update
 */
export async function logUserUpdated(
  actorId: string,
  targetUserId: string,
  before: any,
  after: any,
  request?: NextRequest
) {
  await logAudit({
    userId: actorId,
    action: 'update_user',
    tableName: 'users_profile',
    recordId: targetUserId,
    diff: {
      before,
      after,
      changes: getChanges(before, after),
    },
    request,
  });
}

/**
 * Log user deletion
 */
export async function logUserDeleted(
  actorId: string,
  deletedUserId: string,
  userData: any,
  request?: NextRequest
) {
  await logAudit({
    userId: actorId,
    action: 'delete_user',
    tableName: 'users_profile',
    recordId: deletedUserId,
    diff: {
      deleted: userData,
    },
    request,
  });
}

/**
 * Log role assignment
 */
export async function logRoleAssigned(
  actorId: string,
  targetUserId: string,
  roleCode: string,
  request?: NextRequest
) {
  await logAudit({
    userId: actorId,
    action: 'assign_role',
    tableName: 'user_roles',
    recordId: targetUserId,
    diff: {
      user_id: targetUserId,
      role_code: roleCode,
    },
    request,
  });
}

/**
 * Log role revocation
 */
export async function logRoleRevoked(
  actorId: string,
  targetUserId: string,
  roleCode: string,
  request?: NextRequest
) {
  await logAudit({
    userId: actorId,
    action: 'revoke_role',
    tableName: 'user_roles',
    recordId: targetUserId,
    diff: {
      user_id: targetUserId,
      role_code: roleCode,
    },
    request,
  });
}

/**
 * Log post publish
 */
export async function logPostPublished(
  actorId: string,
  postId: string,
  postTitle: string,
  request?: NextRequest
) {
  await logAudit({
    userId: actorId,
    action: 'publish_post',
    tableName: 'posts',
    recordId: postId,
    diff: {
      post_id: postId,
      title: postTitle,
      status: 'published',
      published_at: new Date().toISOString(),
    },
    request,
  });
}

/**
 * Log service publish
 */
export async function logServicePublished(
  actorId: string,
  serviceId: string,
  serviceTitle: string,
  request?: NextRequest
) {
  await logAudit({
    userId: actorId,
    action: 'publish_service',
    tableName: 'services',
    recordId: serviceId,
    diff: {
      service_id: serviceId,
      title: serviceTitle,
      status: 'active',
    },
    request,
  });
}

/**
 * Log media upload
 */
export async function logMediaUploaded(
  actorId: string,
  mediaId: string,
  fileName: string,
  fileSize: number,
  request?: NextRequest
) {
  await logAudit({
    userId: actorId,
    action: 'upload_media',
    tableName: 'media_files',
    recordId: mediaId,
    diff: {
      media_id: mediaId,
      file_name: fileName,
      file_size: fileSize,
    },
    request,
  });
}

/**
 * Log login
 */
export async function logLogin(
  userId: string,
  email: string,
  request?: NextRequest
) {
  await logAudit({
    userId,
    action: 'login',
    actorEmail: email,
    request,
  });
}

/**
 * Log logout
 */
export async function logLogout(
  userId: string,
  email: string,
  request?: NextRequest
) {
  await logAudit({
    userId,
    action: 'logout',
    actorEmail: email,
    request,
  });
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get differences between two objects
 */
function getChanges(before: any, after: any): Record<string, any> {
  const changes: Record<string, any> = {};

  // Get all unique keys
  const keys = new Set([
    ...Object.keys(before || {}),
    ...Object.keys(after || {}),
  ]);

  for (const key of Array.from(keys)) {
    if (before[key] !== after[key]) {
      changes[key] = {
        from: before[key],
        to: after[key],
      };
    }
  }

  return changes;
}

/**
 * Query audit logs
 * @param filters - Filter options
 */
export async function getAuditLogs(filters?: {
  userId?: string;
  action?: string;
  tableName?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    let query = supabaseAdmin
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.userId) {
      query = query.eq('actor_id', filters.userId);
    }

    if (filters?.action) {
      query = query.eq('action', filters.action);
    }

    if (filters?.tableName) {
      query = query.eq('table_name', filters.tableName);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 50) - 1
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Get audit logs error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get audit logs failed:', error);
    return [];
  }
}
