'use client'

import React, { useState } from 'react'
import { useAdmin } from './AdminProvider'
import Image from 'next/image'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showDemo, setShowDemo] = useState(false)
  const { login, isLoading } = useAdmin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin')
      return
    }

    const success = await login(username, password)
    if (!success) {
      setError('Tên đăng nhập hoặc mật khẩu không đúng')
    }
  }

  const demoCredentials = [
    { username: 'admin', password: 'admin123', role: 'Quản trị viên' },
    { username: 'editor', password: 'editor123', role: 'Biên tập viên' }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl text-white font-bold">TBS</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Hệ thống quản trị
          </h2>
          <p className="text-gray-600">
            Đăng nhập để quản lý nội dung website TBS GROUP
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Nhập tên đăng nhập"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Nhập mật khẩu"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {showDemo ? '🔽' : '▶️'} Xem thông tin đăng nhập demo
            </button>
            
            {showDemo && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-gray-600 mb-2">Tài khoản demo:</p>
                {demoCredentials.map((cred, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700">{cred.role}</span>
                      <button
                        onClick={() => {
                          setUsername(cred.username)
                          setPassword(cred.password)
                        }}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Sử dụng
                      </button>
                    </div>
                    <div className="text-gray-600">
                      <div>👤 {cred.username}</div>
                      <div>🔑 {cred.password}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2025 TBS GROUP. Phát triển bởi TBS IT Team.</p>
        </div>
      </div>
    </div>
  )
} 