'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'green' | 'yellow' | 'red'
  className?: string
  animated?: boolean
}

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
}

const colorClasses = {
  blue: 'bg-tbs-primary',
  green: 'bg-tbs-success',
  yellow: 'bg-tbs-warning',
  red: 'bg-tbs-error',
}

export default function ProgressBar({
  progress,
  showLabel = false,
  size = 'md',
  color = 'blue',
  className,
  animated = false,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Tiến độ học tập
          </span>
          <span className="text-sm font-medium text-gray-900">
            {clampedProgress.toFixed(0)}%
          </span>
        </div>
      )}
      
      <div className={cn(
        'w-full bg-gray-200 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out rounded-full',
            colorClasses[color],
            animated && 'animate-pulse'
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  )
} 