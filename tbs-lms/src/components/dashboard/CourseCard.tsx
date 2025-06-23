'use client'

import { useState } from 'react'
import { ClockIcon, UserGroupIcon, BookOpenIcon, CheckBadgeIcon } from '@heroicons/react/24/outline'
import { Course } from '@/types'
import { cn, formatDuration } from '@/lib/utils'
import ProgressBar from '@/components/ui/ProgressBar'

interface CourseCardProps {
  course: Course
  showProgress?: boolean
  onClick?: () => void
  className?: string
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
}

const difficultyLabels = {
  beginner: 'Cơ bản',
  intermediate: 'Trung bình',
  advanced: 'Nâng cao',
}

export default function CourseCard({
  course,
  showProgress = true,
  onClick,
  className,
}: CourseCardProps) {
  const [imageError, setImageError] = useState(false)
  const progress = course.user_progress?.progress_percentage || 0
  const isCompleted = progress >= 100

  return (
    <div
      className={cn(
        'group bg-white rounded-xl shadow-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden',
        'hover:border-tbs-primary/20 hover:-translate-y-1',
        className
      )}
      onClick={onClick}
    >
      {/* Course Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-tbs-light to-tbs-primary/20 overflow-hidden">
        {course.thumbnail_url && !imageError ? (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpenIcon className="w-16 h-16 text-tbs-primary/40" />
          </div>
        )}
        
        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-tbs-success text-white p-2 rounded-full">
            <CheckBadgeIcon className="w-5 h-5" />
          </div>
        )}

        {/* Difficulty Badge */}
        <div className="absolute top-3 left-3">
          <span className={cn(
            'px-2 py-1 text-xs font-medium rounded-full',
            difficultyColors[course.difficulty_level]
          )}>
            {difficultyLabels[course.difficulty_level]}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-5">
        {/* Course Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-tbs-primary transition-colors">
          {course.title}
        </h3>

        {/* Course Description */}
        {course.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>
        )}

        {/* Course Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          {course.duration_hours && (
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>{formatDuration(course.duration_hours * 60)}</span>
            </div>
          )}
          
          {course.lessons_count && (
            <div className="flex items-center gap-1">
              <BookOpenIcon className="w-4 h-4" />
              <span>{course.lessons_count} bài học</span>
            </div>
          )}

          {course.enrolled_count && (
            <div className="flex items-center gap-1">
              <UserGroupIcon className="w-4 h-4" />
              <span>{course.enrolled_count} học viên</span>
            </div>
          )}
        </div>

        {/* Departments */}
        <div className="flex flex-wrap gap-1 mb-4">
          {course.department.slice(0, 3).map((dept) => (
            <span
              key={dept}
              className="px-2 py-1 bg-tbs-light text-tbs-primary text-xs rounded-md font-medium"
            >
              {dept === 'all' ? 'Tất cả' : dept}
            </span>
          ))}
          {course.department.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              +{course.department.length - 3}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="space-y-2">
            <ProgressBar
              progress={progress}
              size="sm"
              color={isCompleted ? 'green' : 'blue'}
            />
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600">
                {course.user_progress?.lessons_completed || 0} / {course.user_progress?.total_lessons || course.lessons_count || 0} bài học
              </span>
              <span className="font-medium text-gray-900">
                {progress.toFixed(0)}%
              </span>
            </div>
          </div>
        )}

        {/* Action Area */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {course.user_progress?.last_accessed && (
              <span>
                Học lần cuối: {new Date(course.user_progress.last_accessed).toLocaleDateString('vi-VN')}
              </span>
            )}
          </div>
          
          <button className="text-tbs-primary font-medium text-sm hover:text-tbs-secondary transition-colors group-hover:translate-x-1 duration-200">
            {isCompleted ? 'Xem lại' : progress > 0 ? 'Tiếp tục' : 'Bắt đầu'} →
          </button>
        </div>
      </div>
    </div>
  )
} 