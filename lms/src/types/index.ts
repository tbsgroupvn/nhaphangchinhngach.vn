// Database Types
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  department?: string;
  position?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  department: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration_hours?: number;
  is_published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  // Computed fields
  lessons_count?: number;
  enrolled_count?: number;
  user_progress?: UserProgress;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  video_url?: string;
  content?: string; // Markdown content
  attachments?: AttachmentFile[];
  lesson_order: number;
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
  // Computed fields
  quiz_questions?: QuizQuestion[];
  is_completed?: boolean;
}

export interface QuizQuestion {
  id: string;
  lesson_id: string;
  question: string;
  question_type: 'multiple_choice' | 'true_false' | 'essay';
  options?: string[]; // For multiple choice
  correct_answer: string;
  explanation?: string;
  points: number;
  created_at: string;
}

export interface Attempt {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  quiz_answers: QuizAnswer[];
  score: number;
  max_score: number;
  passed: boolean;
  completed_at: string;
  time_spent_minutes?: number;
}

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  lessons_completed: number;
  total_lessons: number;
  progress_percentage: number;
  started_at: string;
  completed_at?: string;
  last_accessed: string;
}

// UI Types
export interface QuizAnswer {
  question_id: string;
  answer: string;
  is_correct?: boolean;
  points_earned?: number;
}

export interface AttachmentFile {
  id: string;
  filename: string;
  url: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'course' | 'lesson' | 'document';
  url: string;
  course_title?: string;
  lesson_title?: string;
  highlight?: string;
}

export interface DashboardStats {
  total_courses: number;
  completed_courses: number;
  in_progress_courses: number;
  total_hours_learned: number;
  certificates_earned: number;
  current_streak: number;
}

// Form Types
export interface CourseFormData {
  title: string;
  description: string;
  department: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  thumbnail_url?: string;
  is_published: boolean;
}

export interface LessonFormData {
  title: string;
  description: string;
  video_url?: string;
  content: string;
  lesson_order: number;
  duration_minutes: number;
  attachments: File[];
}

export interface QuestionFormData {
  question: string;
  question_type: 'multiple_choice' | 'true_false' | 'essay';
  options: string[];
  correct_answer: string;
  explanation: string;
  points: number;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Component Props Types
export interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'red';
  className?: string;
}

export interface VideoPlayerProps {
  url: string;
  onProgress?: (progress: number) => void;
  onEnded?: () => void;
  autoPlay?: boolean;
  controls?: boolean;
}

export interface QuizProps {
  questions: QuizQuestion[];
  onSubmit: (answers: QuizAnswer[]) => void;
  onQuestionChange?: (questionIndex: number, answer: string) => void;
  timeLimit?: number; // in minutes
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  action_url?: string;
  created_at: string;
}

// Email Types
export interface EmailTemplate {
  to: string;
  subject: string;
  template: 'course_completion' | 'quiz_failed' | 'course_enrolled' | 'reminder';
  data: {
    user_name: string;
    course_title?: string;
    lesson_title?: string;
    score?: number;
    certificate_url?: string;
    [key: string]: any;
  };
}

// Department Types
export type Department = 
  | 'logistics'
  | 'customs'
  | 'sales'
  | 'admin'
  | 'finance'
  | 'hr'
  | 'it'
  | 'all';

export interface DepartmentConfig {
  id: Department;
  name: string;
  color: string;
  description?: string;
}

// Analytics Types
export interface CourseAnalytics {
  course_id: string;
  total_enrollments: number;
  completion_rate: number;
  average_score: number;
  average_completion_time: number;
  popular_lessons: Array<{
    lesson_id: string;
    lesson_title: string;
    view_count: number;
  }>;
  difficulty_feedback: {
    too_easy: number;
    just_right: number;
    too_hard: number;
  };
}

export interface UserAnalytics {
  user_id: string;
  total_courses_enrolled: number;
  total_courses_completed: number;
  total_hours_learned: number;
  average_quiz_score: number;
  learning_streak: number;
  preferred_learning_time: string;
  completion_trend: Array<{
    date: string;
    courses_completed: number;
  }>;
}

// File Upload Types
export interface UploadProgress {
  filename: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

// Search Types
export interface SearchFilters {
  type?: 'course' | 'lesson' | 'document';
  department?: Department[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: {
    min: number;
    max: number;
  };
}

export interface SearchQuery {
  query: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
} 