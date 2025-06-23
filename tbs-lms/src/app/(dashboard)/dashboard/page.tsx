import { Suspense } from 'react'
import { 
  AcademicCapIcon, 
  ClockIcon, 
  TrophyIcon, 
  FireIcon,
  ChartBarIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import DashboardStats from '@/components/dashboard/DashboardStats'
import CourseGrid from '@/components/dashboard/CourseGrid'
import RecentActivity from '@/components/dashboard/RecentActivity'
import LearningStreak from '@/components/dashboard/LearningStreak'

// Mock data - sẽ được thay thế bằng real data từ Supabase
const mockStats = {
  total_courses: 12,
  completed_courses: 5,
  in_progress_courses: 3,
  total_hours_learned: 24,
  certificates_earned: 5,
  current_streak: 7,
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bảng điều khiển học tập
              </h1>
              <p className="mt-1 text-gray-600">
                Theo dõi tiến độ và khám phá khóa học mới
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="flex items-center text-gray-600">
                  <AcademicCapIcon className="w-5 h-5 mr-2 text-tbs-primary" />
                  <span className="font-medium">{mockStats.completed_courses}</span>
                  <span className="ml-1">hoàn thành</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FireIcon className="w-5 h-5 mr-2 text-orange-500" />
                  <span className="font-medium">{mockStats.current_streak}</span>
                  <span className="ml-1">ngày liên tiếp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Khóa học đã tham gia"
            value={mockStats.total_courses}
            icon={BookOpenIcon}
            color="blue"
            change="+2 tháng này"
          />
          <StatCard
            title="Hoàn thành"
            value={mockStats.completed_courses}
            icon={AcademicCapIcon}
            color="green"
            change="+1 tuần này"
          />
          <StatCard
            title="Tổng thời gian học"
            value={`${mockStats.total_hours_learned}h`}
            icon={ClockIcon}
            color="purple"
            change="+5h tuần này"
          />
          <StatCard
            title="Chứng chỉ"
            value={mockStats.certificates_earned}
            icon={TrophyIcon}
            color="yellow"
            change="Mới nhất: 2 ngày"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Courses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Tiếp tục học tập
                </h2>
                <button className="text-tbs-primary hover:text-tbs-secondary font-medium text-sm">
                  Xem tất cả →
                </button>
              </div>
              
              <Suspense fallback={<CourseGridSkeleton />}>
                <CourseGrid type="in-progress" limit={4} />
              </Suspense>
            </section>

            {/* Recommended Courses */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Khuyến nghị cho bạn
                </h2>
                <button className="text-tbs-primary hover:text-tbs-secondary font-medium text-sm">
                  Xem thêm →
                </button>
              </div>
              
              <Suspense fallback={<CourseGridSkeleton />}>
                <CourseGrid type="recommended" limit={4} />
              </Suspense>
            </section>
          </div>

          {/* Right Column - Activity & Stats */}
          <div className="space-y-6">
            {/* Learning Streak */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Chuỗi học tập</h3>
                <FireIcon className="w-6 h-6 text-orange-500" />
              </div>
              
              <Suspense fallback={<div className="animate-pulse bg-gray-200 h-20 rounded"></div>}>
                <LearningStreak streak={mockStats.current_streak} />
              </Suspense>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Hoạt động gần đây</h3>
                <ChartBarIcon className="w-5 h-5 text-gray-400" />
              </div>
              
              <Suspense fallback={<ActivitySkeleton />}>
                <RecentActivity />
              </Suspense>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
              
              <div className="space-y-3">
                <QuickActionButton
                  title="Tìm khóa học"
                  description="Khám phá khóa học mới"
                  href="/courses"
                />
                <QuickActionButton
                  title="Lịch sử học tập"
                  description="Xem tiến độ chi tiết"
                  href="/progress"
                />
                <QuickActionButton
                  title="Chứng chỉ của tôi"
                  description="Tải về chứng chỉ"
                  href="/certificates"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  change 
}: {
  title: string
  value: string | number
  icon: any
  color: 'blue' | 'green' | 'purple' | 'yellow'
  change: string
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{change}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

// Quick Action Button Component
function QuickActionButton({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <a
      href={href}
      className="block p-3 rounded-lg border border-gray-200 hover:border-tbs-primary hover:bg-tbs-light/50 transition-all group"
    >
      <h4 className="font-medium text-gray-900 group-hover:text-tbs-primary transition-colors">
        {title}
      </h4>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </a>
  )
}

// Loading Skeletons
function CourseGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-card p-6 animate-pulse">
          <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
          <div className="bg-gray-200 h-4 rounded mb-2"></div>
          <div className="bg-gray-200 h-3 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  )
}

function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 animate-pulse">
          <div className="bg-gray-200 w-8 h-8 rounded-full"></div>
          <div className="flex-1">
            <div className="bg-gray-200 h-3 rounded mb-1"></div>
            <div className="bg-gray-200 h-2 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
} 