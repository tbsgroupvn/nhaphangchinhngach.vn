interface Activity {
  id: number
  type: string
  action: string
  title: string
  user: string
  time: string
  icon: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActionColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'text-green-600 bg-green-50'
      case 'updated':
        return 'text-blue-600 bg-blue-50'
      case 'activated':
        return 'text-orange-600 bg-orange-50'
      case 'uploaded':
        return 'text-purple-600 bg-purple-50'
      case 'deleted':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getActionText = (action: string) => {
    switch (action) {
      case 'created':
        return 'Tạo mới'
      case 'updated':
        return 'Cập nhật'
      case 'activated':
        return 'Kích hoạt'
      case 'uploaded':
        return 'Tải lên'
      case 'deleted':
        return 'Xóa'
      default:
        return action
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          📋 Hoạt động gần đây
        </h3>
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Xem tất cả
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-lg">{activity.icon}</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
                  {getActionText(activity.action)}
                </span>
                <span className="text-xs text-gray-500">
                  bởi {activity.user}
                </span>
              </div>
              
              <p className="text-sm text-gray-900 font-medium">
                {activity.title}
              </p>
              
              <p className="text-xs text-gray-500 mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-4xl mb-4">📝</div>
          <p className="text-gray-500">Chưa có hoạt động nào</p>
        </div>
      )}
    </div>
  )
} 