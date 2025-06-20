import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Paths that require authentication
const protectedPaths = [
  '/admin/dashboard',
  '/admin/posts',
  '/admin/services',
  '/admin/media',
  '/admin/users',
  '/admin/roles',
  '/admin/settings',
  '/admin/analytics',
  '/admin/ai-assistant',
  '/admin/help'
];

// Admin-only paths (require admin or super_admin role)
const adminOnlyPaths = [
  '/admin/users',
  '/admin/roles',
  '/admin/settings'
];

// Super admin only paths
const superAdminOnlyPaths = [
  '/admin/users/delete',
  '/admin/roles/delete'
];

async function verifyAuth(token: string) {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'tbs-group-secret-key-2024'
    );
    
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and other excluded paths
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/public/')
  ) {
    return NextResponse.next();
  }

  // Check if the path requires protection
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAdminOnlyPath = adminOnlyPaths.some(path => pathname.startsWith(path));
  const isSuperAdminOnlyPath = superAdminOnlyPaths.some(path => pathname.startsWith(path));

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    // Redirect to login if no token
    const loginUrl = new URL('/admin', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  const payload = await verifyAuth(token);
  
  if (!payload) {
    // Redirect to login if invalid token
    const loginUrl = new URL('/admin', request.url);
    const response = NextResponse.redirect(loginUrl);
    
    // Clear invalid token
    response.cookies.delete('auth-token');
    return response;
  }

  const userRole = payload.role as string;
  const userPermissions = payload.permissions as string[];

  // Check admin-only paths
  if (isAdminOnlyPath) {
    const hasAdminAccess = userRole === 'super_admin' || 
                          userRole === 'admin' || 
                          userPermissions.includes('*') ||
                          userPermissions.includes('users.manage');

    if (!hasAdminAccess) {
      // Redirect to dashboard with error message
      const dashboardUrl = new URL('/admin/dashboard?error=insufficient_permissions', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Check super admin only paths
  if (isSuperAdminOnlyPath) {
    if (userRole !== 'super_admin' && !userPermissions.includes('*')) {
      const dashboardUrl = new URL('/admin/dashboard?error=super_admin_required', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Add user info to request headers for API routes
  const response = NextResponse.next();
  response.headers.set('x-user-id', payload.userId as string);
  response.headers.set('x-user-role', userRole);
  response.headers.set('x-user-permissions', JSON.stringify(userPermissions));

  return response;
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/posts/:path*',
    '/admin/services/:path*',
    '/admin/media/:path*',
    '/admin/users/:path*',
    '/admin/roles/:path*',
    '/admin/settings/:path*',
    '/admin/analytics/:path*',
    '/admin/ai-assistant/:path*',
    '/admin/help/:path*'
  ],
}; 