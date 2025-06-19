interface StatsCardProps {
  title: string
  value: number | string
  subtitle: string
  icon: string
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red'
  trend?: {
    value: number
    label: string
  }
}

export default function StatsCard({ title, value, subtitle, icon, color, trend }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    red: 'bg-red-50 text-red-600 border-red-200'
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <span className="text-xl">{icon}</span>
        </div>
        {trend && (
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {trend.value > 0 ? '+' : ''}{trend.value}
            </div>
            <div className="text-xs text-gray-500">{trend.label}</div>
          </div>
        )}
      </div>
      
      <div>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {value}
        </div>
        <div className="text-sm font-medium text-gray-700 mb-1">
          {title}
        </div>
        <div className="text-sm text-gray-500">
          {subtitle}
        </div>
      </div>
    </div>
  )
} 