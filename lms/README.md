# TBS GROUP - Learning Management System (LMS)

> **Hệ thống quản lý đào tạo nội bộ cho TBS GROUP**  
> Built with Next.js 14, TypeScript, Tailwind CSS, Supabase, và Meilisearch

![TBS LMS Preview](https://via.placeholder.com/1200x600/2563eb/ffffff?text=TBS+LMS+Dashboard)

## 🎯 Tổng quan dự án

**Domain:** `daotao.nhaphangchinhngach.vn`  
**Mục đích:** Hệ thống đào tạo nội bộ cho nhân viên TBS GROUP với quản lý khóa học, video private, quiz system, và search engine.

### ✨ Tính năng chính

- 🔐 **SSO Google Workspace** - Đăng nhập bằng email @tbsgroup.com.vn
- 📚 **Quản lý khóa học** - Tạo, chỉnh sửa, và phân quyền theo bộ phận
- 🎥 **Video Vimeo private** - Embed video bảo mật với tracking
- 📊 **Dashboard tiến độ** - Theo dõi progress bar và thống kê học tập
- 🔍 **Search Meilisearch** - Tìm kiếm trong PDF, SOP markdown, courses
- 📧 **Email Resend** - Thông báo hoàn thành khóa học và quiz fail
- 👨‍💼 **Admin panel** - Upload bài học và gán quyền bộ phận
- 📱 **Responsive design** - Giao diện tối ưu cho mobile và desktop

## 🚀 Cài đặt nhanh

### Yêu cầu hệ thống

- Node.js 18+ 
- npm hoặc yarn
- Supabase account
- Google Cloud Console (for SSO)
- Meilisearch instance
- Resend account
- Vimeo Pro account

### 1. Clone và cài đặt

```bash
git clone https://github.com/tbsgroup/tbs-lms.git
cd tbs-lms
npm install
```

### 2. Environment Variables

Copy `.env.example` thành `.env.local` và điền các thông tin:

```bash
# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google OAuth (Google Workspace SSO)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration (Resend)
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@tbsgroup.com.vn

# Meilisearch Configuration
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_MASTER_KEY=your-meilisearch-master-key

# Vimeo Configuration
VIMEO_ACCESS_TOKEN=your-vimeo-access-token
```

### 3. Database Setup (Supabase)

1. Tạo project mới trên [Supabase](https://supabase.com)
2. Copy SQL schema từ `lms-project-setup.md`
3. Chạy SQL commands trong Supabase SQL Editor
4. Enable Row Level Security (RLS) cho tất cả tables

### 4. Google SSO Setup

1. Tạo project trong [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google+ API
3. Tạo OAuth 2.0 credentials
4. Set authorized domains: `tbsgroup.com.vn`
5. Add callback URL: `{your-domain}/api/auth/callback/google`

### 5. Meilisearch Setup

**Option A: Cloud (Recommended)**
```bash
# Sign up at https://cloud.meilisearch.com
# Get your API keys and URL
```

**Option B: Self-hosted**
```bash
# Install Meilisearch locally
curl -L https://install.meilisearch.com | sh
./meilisearch --master-key=your-master-key
```

### 6. Start Development

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 📁 Cấu trúc dự án

```
src/
├── app/
│   ├── (auth)/                 # Authentication pages
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (dashboard)/            # Main app pages
│   │   ├── dashboard/          # Dashboard overview
│   │   ├── courses/            # Course listing & details
│   │   ├── lessons/            # Lesson content & video
│   │   └── layout.tsx          # Dashboard layout with sidebar
│   ├── (admin)/                # Admin panel
│   │   ├── admin/
│   │   │   ├── courses/        # Course management
│   │   │   ├── users/          # User management
│   │   │   └── analytics/      # Learning analytics
│   │   └── layout.tsx
│   ├── api/                    # API routes
│   │   ├── auth/               # NextAuth configuration
│   │   ├── courses/            # Course CRUD operations
│   │   ├── search/             # Meilisearch integration
│   │   ├── notifications/      # Email notifications
│   │   └── upload/             # File upload handling
│   └── globals.css
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── ProgressBar.tsx
│   │   ├── Button.tsx
│   │   └── Modal.tsx
│   ├── dashboard/              # Dashboard-specific components
│   │   ├── CourseCard.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── course/                 # Course-related components
│   │   ├── VideoPlayer.tsx
│   │   ├── QuizComponent.tsx
│   │   └── LessonList.tsx
│   ├── admin/                  # Admin panel components
│   │   ├── CourseForm.tsx
│   │   ├── UserTable.tsx
│   │   └── Analytics.tsx
│   └── shared/                 # Shared components
│       ├── SearchBar.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
├── lib/                        # Utility libraries
│   ├── supabase/               # Supabase configuration
│   │   ├── client.ts
│   │   └── types.ts
│   ├── auth/                   # Authentication logic
│   │   └── config.ts
│   ├── meilisearch/            # Search configuration
│   │   └── client.ts
│   └── utils.ts                # Helper functions
├── types/                      # TypeScript type definitions
│   └── index.ts
└── hooks/                      # Custom React hooks
    ├── useAuth.ts
    ├── useCourses.ts
    └── useSearch.ts
```

## 🔧 API Endpoints

### Courses API
```
GET    /api/courses              # Get courses for user
POST   /api/courses              # Create new course (admin)
GET    /api/courses/[id]         # Get course details
PUT    /api/courses/[id]         # Update course (admin)
DELETE /api/courses/[id]         # Delete course (admin)
```

### Lessons API
```
GET    /api/lessons              # Get lessons for course
POST   /api/lessons              # Create new lesson (admin)
GET    /api/lessons/[id]         # Get lesson content
PUT    /api/lessons/[id]         # Update lesson (admin)
```

### Search API
```
GET    /api/search               # Search content
POST   /api/search/index         # Index new content (admin)
DELETE /api/search/index         # Remove from index (admin)
```

### Progress API
```
GET    /api/progress             # Get user progress
POST   /api/progress             # Update progress
GET    /api/progress/stats       # Get learning statistics
```

## 🎨 Design System

### TBS Brand Colors

```css
:root {
  --tbs-primary: #2563eb;     /* Blue-600 */
  --tbs-secondary: #1d4ed8;   /* Blue-700 */
  --tbs-accent: #3b82f6;      /* Blue-500 */
  --tbs-light: #dbeafe;       /* Blue-100 */
  --tbs-dark: #1e3a8a;        /* Blue-900 */
  --tbs-success: #10b981;     /* Green-500 */
  --tbs-warning: #f59e0b;     /* Amber-500 */
  --tbs-error: #ef4444;       /* Red-500 */
}
```

### Typography
- **Font:** Inter (Google Fonts)
- **Headings:** Font weights 600-700
- **Body:** Font weight 400-500
- **Scale:** 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
sm: '640px',   /* Tablet */
md: '768px',   /* Small laptop */
lg: '1024px',  /* Desktop */
xl: '1280px',  /* Large desktop */
2xl: '1536px'  /* Extra large */
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure custom domain: `daotao.nhaphangchinhngach.vn`

### Netlify

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Set environment variables
4. Configure domain and SSL

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Analytics & Monitoring

### Built-in Analytics
- Course completion rates
- User learning time
- Popular lessons
- Department performance
- Quiz score trends

### External Integrations
- Google Analytics 4
- Supabase Analytics
- Custom event tracking

## 🔒 Security Features

- **Authentication:** NextAuth.js with Google SSO
- **Authorization:** Role-based access control (RBAC)
- **Database:** Row Level Security (RLS) với Supabase
- **API Protection:** Session-based authentication
- **File Upload:** Type và size validation
- **CORS:** Restricted to TBS domains

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📈 Performance Optimizations

- **Image Optimization:** Next.js Image component
- **Code Splitting:** Automatic với Next.js App Router
- **Caching:** ISR (Incremental Static Regeneration)
- **Database:** Indexed queries và connection pooling
- **CDN:** Static assets served through Vercel Edge Network

## 🛠️ Development Guidelines

### Code Style
- **ESLint:** Airbnb configuration
- **Prettier:** Code formatting
- **TypeScript:** Strict mode enabled
- **Git Hooks:** Pre-commit linting

### Component Structure
```tsx
// Example component structure
interface ComponentProps {
  // Props interface
}

export default function Component({ props }: ComponentProps) {
  // Component logic
  return (
    <div className="component-class">
      {/* JSX content */}
    </div>
  )
}
```

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [NextAuth.js Guide](https://next-auth.js.org/)
- [Meilisearch Documentation](https://docs.meilisearch.com/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Create Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Lead Developer:** TBS IT Team
- **UI/UX Design:** TBS Design Team  
- **Project Manager:** TBS HR Team
- **QA Testing:** TBS QA Team

## 📞 Support

Nếu gặp vấn đề hoặc cần hỗ trợ:

- **Email:** it@tbsgroup.com.vn
- **Internal Slack:** #lms-support
- **Documentation:** [Internal Wiki](https://wiki.tbsgroup.com.vn/lms)

---

**© 2024 TBS GROUP. All rights reserved.** 