'use client'

import { useState, useEffect } from 'react'
import { 
  FaSync, FaCheckCircle, FaExclamationTriangle, FaSpinner,
  FaDatabase, FaNewspaper, FaCog, FaCloudUploadAlt
} from 'react-icons/fa'

interface SyncStatus {
  lastSync: string
  contentHealth: Array<{
    type: string
    count?: number
    status: 'ok' | 'error'
  }>
  overallStatus: 'healthy' | 'needs_attention'
}

export default function SyncStatus() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncType, setSyncType] = useState<'all' | 'services' | 'posts'>('all')

  useEffect(() => {
    fetchSyncStatus()
    // Refresh every 30 seconds
    const interval = setInterval(fetchSyncStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch('/api/admin/sync')
      const result = await response.json()
      
      if (result.success) {
        setSyncStatus(result.data)
      }
    } catch (error) {
      console.error('Error fetching sync status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async (type: 'all' | 'services' | 'posts') => {
    setSyncing(true)
    setSyncType(type)
    
    try {
      const response = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syncType: type })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Show success notification
        alert(`✅ ${type} sync completed successfully!`)
        await fetchSyncStatus() // Refresh status
      } else {
        alert(`❌ Sync failed: ${result.errors?.join(', ') || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Sync error:', error)
      alert('❌ Sync operation failed')
    } finally {
      setSyncing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': 
      case 'healthy':
        return <FaCheckCircle className="text-green-500" />
      case 'error':
      case 'needs_attention':
        return <FaExclamationTriangle className="text-yellow-500" />
      default:
        return <FaSpinner className="animate-spin text-gray-400" />
    }
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'services': return <FaDatabase className="text-blue-500" />
      case 'posts': return <FaNewspaper className="text-purple-500" />
      case 'settings': return <FaCog className="text-gray-500" />
      default: return <FaDatabase className="text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaCloudUploadAlt className="text-red-600 text-xl" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Trạng thái đồng bộ</h3>
            <p className="text-sm text-gray-600">
              Kiểm tra tính nhất quán giữa Admin CMS và Website
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {syncStatus && getStatusIcon(syncStatus.overallStatus)}
          <span className={`text-sm font-medium ${
            syncStatus?.overallStatus === 'healthy' ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {syncStatus?.overallStatus === 'healthy' ? 'Đồng bộ tốt' : 'Cần kiểm tra'}
          </span>
        </div>
      </div>

      {/* Content Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {syncStatus?.contentHealth.map(item => (
          <div key={item.type} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            {getContentIcon(item.type)}
            <div className="flex-1">
              <p className="font-medium text-gray-900 capitalize">
                {item.type === 'services' ? 'Dịch vụ' : 
                 item.type === 'posts' ? 'Bài viết' : 'Cài đặt'}
              </p>
              <p className="text-sm text-gray-600">
                {item.count !== undefined ? `${item.count} items` : 'Configured'}
              </p>
            </div>
            {getStatusIcon(item.status)}
          </div>
        ))}
      </div>

      {/* Last Sync Info */}
      {syncStatus && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-blue-800">
            <FaSync className="text-sm" />
            <span className="text-sm font-medium">
              Lần sync cuối: {new Date(syncStatus.lastSync).toLocaleString('vi-VN')}
            </span>
          </div>
        </div>
      )}

      {/* Sync Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleSync('all')}
          disabled={syncing}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            syncing && syncType === 'all'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {syncing && syncType === 'all' ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaSync />
          )}
          Đồng bộ tất cả
        </button>

        <button
          onClick={() => handleSync('services')}
          disabled={syncing}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            syncing && syncType === 'services'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {syncing && syncType === 'services' ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaDatabase />
          )}
          Sync dịch vụ
        </button>

        <button
          onClick={() => handleSync('posts')}
          disabled={syncing}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            syncing && syncType === 'posts'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {syncing && syncType === 'posts' ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaNewspaper />
          )}
          Sync bài viết
        </button>

        <button
          onClick={fetchSyncStatus}
          disabled={syncing}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <FaSync className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Integration Status */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-3">Tích hợp hoàn thành:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <FaCheckCircle className="text-green-500" />
            <span>Services API</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FaCheckCircle className="text-green-500" />
            <span>Posts API</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FaCheckCircle className="text-green-500" />
            <span>Settings API</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <FaCheckCircle className="text-green-500" />
            <span>Content Manager</span>
          </div>
        </div>
      </div>
    </div>
  )
} 