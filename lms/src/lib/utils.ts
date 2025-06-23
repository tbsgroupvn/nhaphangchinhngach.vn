import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility function for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format duration in minutes to human readable
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} phút`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours} giờ`
  }
  
  return `${hours} giờ ${remainingMinutes} phút`
}

// Format date to Vietnamese format
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format relative time (e.g., "2 giờ trước")
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Vừa xong'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} tuần trước`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths} tháng trước`
}

// Calculate reading time for text content
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200 // Average reading speed
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Generate random color for user avatars
export function generateAvatarColor(seed: string): string {
  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // yellow
    '#ef4444', // red
    '#8b5cf6', // purple
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
  ]
  
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Check if email is TBS domain
export function isTBSDomain(email: string): boolean {
  return email.endsWith('@tbsgroup.com.vn')
}

// Slugify text for URLs
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple hyphens
    .trim()
}

// Parse Vimeo URL to get video ID
export function parseVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:channels\/[^\/]+\/|groups\/[^\/]+\/videos\/|album\/[^\/]+\/video\/|video\/|)(\d+)(?:$|\/|\?)/)
  return match ? match[1] : null
}

// Generate Vimeo embed URL
export function generateVimeoEmbedUrl(videoId: string): string {
  return `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479`
}

// Check if user has permission for course
export function hasPermissionForCourse(
  userDepartment: string | null,
  courseDepartments: string[]
): boolean {
  if (!userDepartment || courseDepartments.includes('all')) {
    return true
  }
  
  return courseDepartments.includes(userDepartment)
}

// Calculate quiz score
export function calculateQuizScore(
  answers: Array<{ questionId: string; answer: string }>,
  questions: Array<{ id: string; correctAnswer: string; points: number }>
): { score: number; maxScore: number; passed: boolean } {
  let score = 0
  let maxScore = 0

  questions.forEach(question => {
    maxScore += question.points
    const userAnswer = answers.find(a => a.questionId === question.id)
    
    if (userAnswer && userAnswer.answer === question.correctAnswer) {
      score += question.points
    }
  })

  const passed = score >= maxScore * 0.7 // 70% passing score

  return { score, maxScore, passed }
}

// Debounce function for search
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Local storage helpers with error handling
export const storage = {
  get: (key: string): any => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Silently fail if localStorage is not available
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch {
      // Silently fail if localStorage is not available
    }
  },
} 