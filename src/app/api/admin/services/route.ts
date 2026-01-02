/**
 * API Route: /api/admin/services
 * Manage services and offerings
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAnyPermission, withPermission } from '@/lib/middleware/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { logAudit } from '@/lib/audit';

// =====================================================
// GET /api/admin/services
// List all services with filters
// =====================================================
export async function GET(request: NextRequest) {
  const auth = await withAnyPermission(request, ['services.view', 'services.manage']);
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabaseAdmin
      .from('services')
      .select(`
        *,
        author:author_id (
          id,
          email,
          full_name
        )
      `, { count: 'exact' })
      .is('deleted_at', null)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: services, error, count } = await query;

    if (error) {
      console.error('Get services error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Get statistics
    // @ts-ignore - Supabase type inference issue
    const { data: stats } = await supabaseAdmin
      .from('services')
      .select('status', { count: 'exact' })
      .is('deleted_at', null);

    const statusCounts = {
      total: count || 0,
      active: (stats as any)?.filter((s: any) => s.status === 'active').length || 0,
      inactive: (stats as any)?.filter((s: any) => s.status === 'inactive').length || 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        services: services || [],
        pagination: {
          total: count || 0,
          limit,
          offset,
          hasMore: (count || 0) > offset + limit,
        },
        stats: statusCounts,
      },
    });
  } catch (error: any) {
    console.error('GET services failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// =====================================================
// POST /api/admin/services
// Create new service
// =====================================================
export async function POST(request: NextRequest) {
  const auth = await withPermission(request, 'services.manage');
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      content,
      icon,
      featuredImage,
      priceText,
      priceFrom,
      priceTo,
      features,
      orderIndex,
      status = 'active',
      seoTitle,
      seoDescription,
    } = body;

    // Validation
    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    // @ts-ignore - Supabase type inference issue
    const { data: existing } = await supabaseAdmin
      .from('services')
      .select('id')
      .eq('slug', slug)
      .is('deleted_at', null)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 409 }
      );
    }

    // Create service
    // @ts-ignore - Supabase type inference issue
    const { data: newService, error: createError } = await supabaseAdmin
      .from('services')
      // @ts-ignore - Supabase type inference issue
      .insert({
        title,
        slug,
        description: description || '',
        content,
        icon: icon || null,
        featured_image: featuredImage || null,
        price_text: priceText || null,
        price_from: priceFrom || null,
        price_to: priceTo || null,
        features: features || [],
        order_index: orderIndex || 0,
        status: status,
        seo_title: seoTitle || title,
        seo_description: seoDescription || description || '',
        author_id: auth.user!.id,
      })
      .select()
      .single();

    if (createError) {
      console.error('Create service error:', createError);
      return NextResponse.json(
        { success: false, error: createError.message },
        { status: 500 }
      );
    }

    // Audit log
    await logAudit({
      userId: auth.user!.id,
      action: 'create_service',
      tableName: 'services',
      recordId: (newService as any).id,
      diff: { created: newService },
      request,
    });

    return NextResponse.json({
      success: true,
      data: newService,
      message: 'Service created successfully',
    });
  } catch (error: any) {
    console.error('POST services failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
