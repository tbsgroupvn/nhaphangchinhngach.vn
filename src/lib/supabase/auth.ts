// Authentication helpers for Supabase
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from './server'
import type { Database } from './types'

type User = Database['public']['Tables']['users']['Row']

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
  token?: string
}

/**
 * Authenticate user with username and password
 */
export async function authenticateUser(
  credentials: LoginCredentials
): Promise<AuthResult> {
  try {
    const { username, password } = credentials

    // Get user from database
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !user) {
      return {
        success: false,
        error: 'Tên đăng nhập hoặc mật khẩu không đúng',
      }
    }

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return {
        success: false,
        error: 'Tài khoản đã bị khóa. Vui lòng thử lại sau.',
      }
    }

    // Check if account is active
    if (user.status !== 'active') {
      return {
        success: false,
        error: 'Tài khoản đã bị vô hiệu hóa.',
      }
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      // Increment login attempts
      const newAttempts = user.login_attempts + 1
      const updates: any = { login_attempts: newAttempts }

      // Lock account after 5 failed attempts
      if (newAttempts >= 5) {
        const lockUntil = new Date()
        lockUntil.setMinutes(lockUntil.getMinutes() + 30) // Lock for 30 minutes
        updates.locked_until = lockUntil.toISOString()
      }

      await supabaseAdmin.from('users').update(updates).eq('id', user.id)

      return {
        success: false,
        error: 'Tên đăng nhập hoặc mật khẩu không đúng',
      }
    }

    // Reset login attempts and update last login
    await supabaseAdmin
      .from('users')
      .update({
        login_attempts: 0,
        locked_until: null,
        last_login: new Date().toISOString(),
      })
      .eq('id', user.id)

    // Return success with user data (excluding password hash)
    const { password_hash, ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword as User,
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      error: 'Đã xảy ra lỗi khi đăng nhập',
    }
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

/**
 * Create a new user
 */
export async function createUser(userData: {
  username: string
  email: string
  full_name: string
  password: string
  role?: 'super_admin' | 'admin' | 'editor' | 'viewer'
}): Promise<AuthResult> {
  try {
    // Hash password
    const password_hash = await bcrypt.hash(userData.password, 10)

    // Create user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        username: userData.username,
        email: userData.email,
        full_name: userData.full_name,
        password_hash,
        role: userData.role || 'viewer',
        status: 'active',
        email_verified: false,
      })
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error('Create user error:', error)
    return {
      success: false,
      error: 'Đã xảy ra lỗi khi tạo người dùng',
    }
  }
}

/**
 * Update user password
 */
export async function updatePassword(
  userId: string,
  newPassword: string
): Promise<boolean> {
  try {
    const password_hash = await bcrypt.hash(newPassword, 10)

    const { error } = await supabaseAdmin
      .from('users')
      .update({ password_hash })
      .eq('id', userId)

    return !error
  } catch (error) {
    console.error('Update password error:', error)
    return false
  }
}

/**
 * Log user activity
 */
export async function logActivity(
  userId: string,
  action: string,
  details?: any
): Promise<void> {
  try {
    await supabaseAdmin.from('user_activities').insert({
      user_id: userId,
      action,
      details,
    })
  } catch (error) {
    console.error('Log activity error:', error)
  }
}
