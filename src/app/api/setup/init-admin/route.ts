import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';

/**
 * API để setup admin user ban đầu
 * POST /api/setup/init-admin
 *
 * QUAN TRỌNG: Chỉ chạy lần đầu tiên để tạo admin user!
 */
export async function POST(request: NextRequest) {
  try {
    // Check if admin user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, username, email, role')
      .eq('username', 'admin')
      .single();

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'Admin user already exists',
        user: {
          username: (existingUser as any).username,
          email: (existingUser as any).email,
          role: (existingUser as any).role,
        },
      });
    }

    // Generate password hash for: Anhcanem2015@
    const password = 'Anhcanem2015@';
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const { data: newUser, error } = await (supabaseAdmin as any)
      .from('users')
      .insert({
        username: 'admin',
        email: 'admin@nhaphangchinhngach.vn',
        full_name: 'Administrator',
        password_hash: passwordHash,
        role: 'super_admin',
        status: 'active',
        email_verified: true,
        created_by: null,
      })
      .select()
      .single();

    if (error) {
      console.error('Create admin user error:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create admin user',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: (newUser as any).id,
        username: (newUser as any).username,
        email: (newUser as any).email,
        role: (newUser as any).role,
      },
      credentials: {
        username: 'admin',
        password: 'Anhcanem2015@',
      },
    });

  } catch (error: any) {
    console.error('Init admin error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Kiểm tra trạng thái admin user
 */
export async function GET(request: NextRequest) {
  try {
    const { data: adminUser, error } = await supabaseAdmin
      .from('users')
      .select('id, username, email, role, status, created_at')
      .eq('username', 'admin')
      .single();

    if (error || !adminUser) {
      return NextResponse.json({
        success: false,
        exists: false,
        message: 'Admin user not found. Run POST /api/setup/init-admin to create.',
      });
    }

    return NextResponse.json({
      success: true,
      exists: true,
      user: adminUser,
    });

  } catch (error: any) {
    console.error('Check admin error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
