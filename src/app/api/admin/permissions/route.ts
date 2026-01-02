/**
 * API Route: /api/admin/permissions
 * Get all available permissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { withPermission } from '@/lib/middleware/auth';
import { getAllPermissions } from '@/lib/supabase/rbac';

// =====================================================
// GET /api/admin/permissions
// Get all permissions grouped by module
// =====================================================
export async function GET(request: NextRequest) {
  // Verify authentication and permission
  const auth = await withPermission(request, 'settings.view');
  if (auth.error) return auth.error;

  try {
    const permissions = await getAllPermissions();

    // Group by module
    const groupedByModule: Record<string, any[]> = {};

    permissions.forEach((perm) => {
      const moduleName = perm.module || 'other';
      if (!groupedByModule[moduleName]) {
        groupedByModule[moduleName] = [];
      }
      groupedByModule[moduleName].push(perm);
    });

    return NextResponse.json({
      success: true,
      data: {
        all: permissions,
        byModule: groupedByModule,
      },
    });
  } catch (error: any) {
    console.error('GET permissions failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
