/**
 * Authentication & Authorization Middleware
 * For Next.js API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { checkPermission } from '../supabase/rbac';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

export interface AuthResult {
  user: {
    id: string;
    email?: string;
    [key: string]: any;
  } | null;
  error?: NextResponse;
}

// =====================================================
// VERIFY TOKEN
// =====================================================

/**
 * Verify authentication token from request
 * Supports both Authorization header and cookie
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, error: 'Unauthorized - No token provided' },
          { status: 401 }
        ),
      };
    }

    // Create Supabase client with anon key (for token verification)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: () => undefined,
          set: () => {},
          remove: () => {},
        },
      }
    );

    // Verify token and get user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, error: 'Unauthorized - Invalid token' },
          { status: 401 }
        ),
      };
    }

    return { user };
  } catch (error) {
    console.error('Auth verification error:', error);
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: 'Internal server error during auth' },
        { status: 500 }
      ),
    };
  }
}

// =====================================================
// WITH AUTH MIDDLEWARE
// =====================================================

/**
 * Middleware wrapper for API routes with authentication
 * Usage:
 *   const auth = await withAuth(request);
 *   if (auth.error) return auth.error;
 *   const userId = auth.user!.id;
 */
export async function withAuth(
  request: NextRequest
): Promise<AuthResult> {
  return verifyAuth(request);
}

// =====================================================
// WITH PERMISSION MIDDLEWARE
// =====================================================

/**
 * Middleware wrapper with permission check
 * Usage:
 *   const auth = await withPermission(request, 'users.manage');
 *   if (auth.error) return auth.error;
 *   const userId = auth.user!.id;
 */
export async function withPermission(
  request: NextRequest,
  requiredPermission: string
): Promise<AuthResult> {
  // First verify authentication
  const authResult = await verifyAuth(request);
  if (authResult.error || !authResult.user) {
    return authResult;
  }

  // Check permission
  const hasPermission = await checkPermission(
    authResult.user.id,
    requiredPermission
  );

  if (!hasPermission) {
    return {
      user: authResult.user,
      error: NextResponse.json(
        {
          success: false,
          error: `Forbidden - Required permission: ${requiredPermission}`,
        },
        { status: 403 }
      ),
    };
  }

  return authResult;
}

// =====================================================
// MULTIPLE PERMISSIONS (ANY)
// =====================================================

/**
 * Check if user has ANY of the specified permissions
 * Usage:
 *   const auth = await withAnyPermission(request, ['users.view', 'users.manage']);
 */
export async function withAnyPermission(
  request: NextRequest,
  permissions: string[]
): Promise<AuthResult> {
  const authResult = await verifyAuth(request);
  if (authResult.error || !authResult.user) {
    return authResult;
  }

  // Check if user has any of the permissions
  for (const permission of permissions) {
    const hasPermission = await checkPermission(
      authResult.user.id,
      permission
    );
    if (hasPermission) {
      return authResult;
    }
  }

  return {
    user: authResult.user,
    error: NextResponse.json(
      {
        success: false,
        error: `Forbidden - Required any of: ${permissions.join(', ')}`,
      },
      { status: 403 }
    ),
  };
}

// =====================================================
// MULTIPLE PERMISSIONS (ALL)
// =====================================================

/**
 * Check if user has ALL of the specified permissions
 * Usage:
 *   const auth = await withAllPermissions(request, ['users.view', 'users.manage']);
 */
export async function withAllPermissions(
  request: NextRequest,
  permissions: string[]
): Promise<AuthResult> {
  const authResult = await verifyAuth(request);
  if (authResult.error || !authResult.user) {
    return authResult;
  }

  // Check if user has all permissions
  for (const permission of permissions) {
    const hasPermission = await checkPermission(
      authResult.user.id,
      permission
    );
    if (!hasPermission) {
      return {
        user: authResult.user,
        error: NextResponse.json(
          {
            success: false,
            error: `Forbidden - Required all: ${permissions.join(', ')}`,
          },
          { status: 403 }
        ),
      };
    }
  }

  return authResult;
}

// =====================================================
// HELPER: Extract User ID
// =====================================================

/**
 * Quick helper to get user ID from request
 * Returns null if not authenticated
 */
export async function getUserId(request: NextRequest): Promise<string | null> {
  const authResult = await verifyAuth(request);
  return authResult.user?.id || null;
}

// =====================================================
// HELPER: Get Client IP
// =====================================================

/**
 * Extract client IP address from request
 */
export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

// =====================================================
// HELPER: Get User Agent
// =====================================================

/**
 * Extract user agent from request
 */
export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}
