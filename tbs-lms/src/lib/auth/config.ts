import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { SupabaseAdapter } from '@auth/supabase-adapter'
import { createAdminClient } from '@/lib/supabase/client'

// Department mapping từ Google domain
const getDepartmentFromEmail = (email: string): string => {
  const domain = email.split('@')[1]
  
  if (domain !== 'tbsgroup.com.vn') {
    return 'external' // External users
  }
  
  // Map department based on email prefix or other logic
  const username = email.split('@')[0].toLowerCase()
  
  if (username.includes('logistics') || username.includes('vantai')) return 'logistics'
  if (username.includes('customs') || username.includes('hq')) return 'customs'
  if (username.includes('sales') || username.includes('kinh-doanh')) return 'sales'
  if (username.includes('admin') || username.includes('hanh-chinh')) return 'admin'
  if (username.includes('finance') || username.includes('tai-chinh')) return 'finance'
  if (username.includes('hr') || username.includes('nhan-su')) return 'hr'
  if (username.includes('it') || username.includes('tech')) return 'it'
  
  return 'all' // Default department
}

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          hd: 'tbsgroup.com.vn', // Restrict to TBS domain only
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Kiểm tra domain email
      if (!user.email?.endsWith('@tbsgroup.com.vn')) {
        console.log('Unauthorized domain:', user.email)
        return false
      }

      // Tạo hoặc update user profile trong Supabase
      try {
        const supabase = createAdminClient()
        
        const { data: existingProfile, error: fetchError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', user.email)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching user profile:', fetchError)
          return false
        }

        const department = getDepartmentFromEmail(user.email)
        const profileData = {
          email: user.email,
          full_name: user.name || '',
          avatar_url: user.image || '',
          department,
          position: '', // Will be updated manually by admin
          is_admin: false, // Default to false, admin will grant permissions
        }

        if (!existingProfile) {
          // Create new profile
          const { error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              ...profileData,
            })

          if (insertError) {
            console.error('Error creating user profile:', insertError)
            return false
          }
        } else {
          // Update existing profile
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
              ...profileData,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

          if (updateError) {
            console.error('Error updating user profile:', updateError)
            return false
          }
        }

        return true
      } catch (error) {
        console.error('Error in signIn callback:', error)
        return false
      }
    },

    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const supabase = createAdminClient()
          
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('email', session.user.email)
            .single()

          if (profile) {
            session.user.id = profile.id
            session.user.department = profile.department
            session.user.position = profile.position
            session.user.isAdmin = profile.is_admin
          }
        } catch (error) {
          console.error('Error fetching user profile in session:', error)
        }
      }
      
      return session
    },

    async jwt({ token, user, account }) {
      if (user && account) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
}

// Department configurations
export const DEPARTMENTS = {
  logistics: {
    id: 'logistics',
    name: 'Logistics & Vận tải',
    color: '#3b82f6',
    description: 'Quản lý vận chuyển và kho bãi',
  },
  customs: {
    id: 'customs',
    name: 'Hải quan',
    color: '#10b981',
    description: 'Thủ tục hải quan và pháp lý',
  },
  sales: {
    id: 'sales',
    name: 'Kinh doanh',
    color: '#f59e0b',
    description: 'Bán hàng và chăm sóc khách hàng',
  },
  admin: {
    id: 'admin',
    name: 'Hành chính',
    color: '#8b5cf6',
    description: 'Quản lý và hành chính',
  },
  finance: {
    id: 'finance',
    name: 'Tài chính',
    color: '#ef4444',
    description: 'Kế toán và tài chính',
  },
  hr: {
    id: 'hr',
    name: 'Nhân sự',
    color: '#06b6d4',
    description: 'Quản lý nhân sự và đào tạo',
  },
  it: {
    id: 'it',
    name: 'Công nghệ',
    color: '#84cc16',
    description: 'Phát triển và vận hành hệ thống',
  },
  all: {
    id: 'all',
    name: 'Tất cả bộ phận',
    color: '#6b7280',
    description: 'Áp dụng cho toàn công ty',
  },
} as const

export type DepartmentKey = keyof typeof DEPARTMENTS