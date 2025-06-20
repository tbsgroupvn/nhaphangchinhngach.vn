import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// Mock users database - replace with real database
let users = [
  {
    id: '1',
    username: 'admin_tbs',
    email: 'admin@tbsgroup.vn',
    fullName: 'Admin TBS GROUP',
    phone: '0123456789',
    avatar: '/images/avatar-admin.jpg',
    role: 'super_admin',
    status: 'active',
    lastLogin: '2024-12-20T10:30:00',
    createdAt: '2024-01-01',
    createdBy: 'System',
    permissions: ['*'],
    loginAttempts: 0,
    emailVerified: true,
    twoFactorEnabled: true
  },
  {
    id: '2',
    username: 'editor_logistics',
    email: 'editor@tbsgroup.vn',
    fullName: 'Nguyễn Văn Logistics',
    phone: '0987654321',
    role: 'editor',
    status: 'active',
    lastLogin: '2024-12-19T16:45:00',
    createdAt: '2024-03-15',
    createdBy: 'admin_tbs',
    permissions: ['posts.create', 'posts.edit', 'services.edit', 'media.upload'],
    loginAttempts: 0,
    emailVerified: true,
    twoFactorEnabled: false
  },
  {
    id: '3',
    username: 'viewer_intern',
    email: 'intern@tbsgroup.vn',
    fullName: 'Trần Thị Thực tập',
    role: 'viewer',
    status: 'inactive',
    lastLogin: '2024-12-10T09:15:00',
    createdAt: '2024-11-01',
    createdBy: 'editor_logistics',
    permissions: ['dashboard.view', 'posts.view', 'services.view'],
    loginAttempts: 2,
    emailVerified: false,
    twoFactorEnabled: false
  }
];

const roles = [
  {
    id: 'super_admin',
    name: 'super_admin',
    displayName: 'Super Admin',
    description: 'Toàn quyền hệ thống, không thể bị hạn chế',
    permissions: ['*'],
    userCount: 1,
    color: 'text-red-600 bg-red-100'
  },
  {
    id: 'admin',
    name: 'admin',
    displayName: 'Administrator',
    description: 'Quản trị viên, có thể quản lý hầu hết tính năng',
    permissions: ['users.manage', 'content.manage', 'settings.manage', 'analytics.view'],
    userCount: 2,
    color: 'text-purple-600 bg-purple-100'
  },
  {
    id: 'editor',
    name: 'editor',
    displayName: 'Editor',
    description: 'Biên tập viên, quản lý nội dung và media',
    permissions: ['posts.manage', 'services.manage', 'media.manage', 'analytics.view'],
    userCount: 5,
    color: 'text-blue-600 bg-blue-100'
  },
  {
    id: 'viewer',
    name: 'viewer',
    displayName: 'Viewer',
    description: 'Chỉ xem, không được chỉnh sửa',
    permissions: ['dashboard.view', 'posts.view', 'services.view'],
    userCount: 3,
    color: 'text-gray-600 bg-gray-100'
  }
];

// Verify JWT token
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

// Check if user has permission
function hasPermission(userPermissions: string[], requiredPermission: string) {
  if (userPermissions.includes('*')) return true;
  if (userPermissions.includes('users.manage')) return true;
  return userPermissions.includes(requiredPermission);
}

// GET /api/admin/users - Get all users
export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyAuth(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const userPermissions = payload.permissions as string[];
    if (!hasPermission(userPermissions, 'users.view')) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Remove sensitive data
    const safeUsers = users.map(user => {
      const { ...safeUser } = user;
      return safeUser;
    });

    return NextResponse.json({
      success: true,
      data: {
        users: safeUsers,
        roles,
        stats: {
          total: users.length,
          active: users.filter(u => u.status === 'active').length,
          admins: users.filter(u => ['super_admin', 'admin'].includes(u.role)).length,
          recentLogins: users.filter(u => {
            if (!u.lastLogin) return false;
            const loginDate = new Date(u.lastLogin);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return loginDate > weekAgo;
          }).length
        }
      }
    });

  } catch (error) {
    console.error('GET users error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create new user
export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyAuth(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const userPermissions = payload.permissions as string[];
    if (!hasPermission(userPermissions, 'users.create')) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { username, email, fullName, phone, role, password } = await request.json();

    // Validate required fields
    if (!username || !email || !fullName || !password) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if username or email already exists
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Username or email already exists' },
        { status: 409 }
      );
    }

    // Get role permissions
    const roleInfo = roles.find(r => r.name === role);
    if (!roleInfo) {
      return NextResponse.json(
        { success: false, message: 'Invalid role' },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      fullName,
      phone: phone || '',
      role,
      status: 'active' as const,
      lastLogin: '',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: payload.username as string,
      permissions: roleInfo.permissions,
      loginAttempts: 0,
      emailVerified: false,
      twoFactorEnabled: false
    };

    users.push(newUser);

    // Return user without sensitive data
    const { ...safeUser } = newUser;

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: safeUser
    });

  } catch (error) {
    console.error('POST users error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users - Update user
export async function PUT(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyAuth(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const userPermissions = payload.permissions as string[];
    if (!hasPermission(userPermissions, 'users.edit')) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Update user
    users[userIndex] = { ...users[userIndex], ...updateData };

    const { ...safeUser } = users[userIndex];

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: safeUser
    });

  } catch (error) {
    console.error('PUT users error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users - Delete user
export async function DELETE(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyAuth(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const userPermissions = payload.permissions as string[];
    if (!hasPermission(userPermissions, 'users.delete')) {
      return NextResponse.json(
        { success: false, message: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent deleting super admin
    if (users[userIndex].role === 'super_admin') {
      return NextResponse.json(
        { success: false, message: 'Cannot delete super admin' },
        { status: 403 }
      );
    }

    // Delete user
    users.splice(userIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('DELETE users error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 