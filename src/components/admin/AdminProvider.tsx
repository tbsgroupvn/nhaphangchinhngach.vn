'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from './AdminSidebar'
import AdminLogin from './AdminLogin'

interface User {
  id: string
  username: string
  role: 'admin' | 'editor'
  email?: string
}

interface AdminContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AdminContext = createContext<AdminContextType | null>(null)

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}

export default function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Demo credentials - trong thực tế sẽ kết nối với backend
  const demoCredentials = {
    admin: { password: 'admin123', role: 'admin' as const, email: 'admin@tbsgroup.vn' },
    editor: { password: 'editor123', role: 'editor' as const, email: 'editor@tbsgroup.vn' }
  }

  useEffect(() => {
    // Kiểm tra token trong localStorage
    const token = localStorage.getItem('admin_token')
    const userData = localStorage.getItem('admin_user')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const credential = demoCredentials[username as keyof typeof demoCredentials]
    
    if (credential && credential.password === password) {
      const userData: User = {
        id: Math.random().toString(36),
        username,
        role: credential.role,
        email: credential.email
      }
      
      const token = 'demo_token_' + Math.random().toString(36)
      
      localStorage.setItem('admin_token', token)
      localStorage.setItem('admin_user', JSON.stringify(userData))
      
      setUser(userData)
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setUser(null)
    router.push('/admin')
  }

  const contextValue: AdminContextType = {
    user,
    login,
    logout,
    isLoading
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminContext.Provider value={contextValue}>
      {!user ? (
        <AdminLogin />
      ) : (
        <div className="flex h-screen bg-gray-50">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      )}
    </AdminContext.Provider>
  )
} 