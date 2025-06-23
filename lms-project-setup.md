# TBS GROUP - Learning Management System (LMS)

## 🎯 Project Overview

**Domain:** `daotao.nhaphangchinhngach.vn`  
**Tech Stack:** Next.js 14 + TypeScript + Tailwind CSS + Supabase + Meilisearch  
**Purpose:** Internal training platform for TBS GROUP employees

## 🚀 Quick Setup

```bash
# 1. Create new Next.js project
npx create-next-app@latest tbs-lms --typescript --tailwind --eslint --app
cd tbs-lms

# 2. Install required dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @auth/supabase-adapter next-auth
npm install meilisearch
npm install resend
npm install @heroicons/react
npm install react-player
npm install @types/react-player

# 3. Install development dependencies
npm install -D @types/node
```

## 🗃️ Database Schema (Supabase)

### 1. Users Table (Extended from Auth)
```sql
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  department TEXT,
  position TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
```

### 2. Courses Table
```sql
CREATE TABLE public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  department TEXT[], -- Array of departments
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  duration_hours INTEGER,
  is_published BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
);
```

### 3. Lessons Table
```sql
CREATE TABLE public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT, -- Vimeo embed URL
  content TEXT, -- Markdown content
  attachments JSONB, -- PDF files, documents
  lesson_order INTEGER NOT NULL,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view lessons of published courses" ON public.lessons FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND is_published = true)
);
```

### 4. Quiz Questions Table
```sql
CREATE TABLE public.quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('multiple_choice', 'true_false', 'essay')),
  options JSONB, -- For multiple choice
  correct_answer TEXT,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view quiz questions" ON public.quiz_questions FOR SELECT USING (true);
```

### 5. Attempts Table
```sql
CREATE TABLE public.attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  lesson_id UUID REFERENCES public.lessons(id),
  course_id UUID REFERENCES public.courses(id),
  quiz_answers JSONB, -- User answers
  score INTEGER,
  max_score INTEGER,
  passed BOOLEAN,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_spent_minutes INTEGER
);

ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own attempts" ON public.attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own attempts" ON public.attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 6. Progress Tracking
```sql
CREATE TABLE public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  course_id UUID REFERENCES public.courses(id),
  lessons_completed INTEGER DEFAULT 0,
  total_lessons INTEGER,
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);
```

## 🔐 Environment Variables

Create `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth (Google SSO)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Meilisearch
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_MASTER_KEY=your_meilisearch_key

# Resend
RESEND_API_KEY=your_resend_api_key

# Vimeo
VIMEO_ACCESS_TOKEN=your_vimeo_token
```

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── courses/
│   │   ├── lessons/
│   │   └── layout.tsx
│   ├── (admin)/
│   │   ├── admin/
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   ├── courses/
│   │   ├── search/
│   │   └── notifications/
│   └── globals.css
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── course/
│   ├── lesson/
│   ├── admin/
│   └── shared/
├── lib/
│   ├── supabase/
│   ├── auth/
│   ├── meilisearch/
│   └── utils/
├── types/
└── hooks/
```

## 🎨 TBS Brand Colors (Tailwind Config)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        tbs: {
          primary: '#2563eb',   // Blue-600
          secondary: '#1d4ed8', // Blue-700
          accent: '#3b82f6',    // Blue-500
          light: '#dbeafe',     // Blue-100
          dark: '#1e3a8a',      // Blue-900
        }
      }
    }
  }
}
```

## 🔧 Key Features Implementation

### 1. SSO Google Workspace
- NextAuth with Google provider
- Auto-create user profiles
- Department mapping from Google

### 2. Course Management
- Admin course creation/editing
- Department-based access control
- Progress tracking

### 3. Video Learning
- Private Vimeo embeds
- Watch time tracking
- Auto-progress on completion

### 4. Search System
- Meilisearch index for documents
- PDF content extraction
- SOP markdown indexing

### 5. Assessment System
- Quiz creation and management
- Automatic grading
- Progress calculation

### 6. Notifications
- Resend email integration
- Course completion certificates
- Quiz failure remediation

## 🚦 Development Phases

### Phase 1: Core Setup
- [x] Project initialization
- [ ] Database schema
- [ ] Authentication
- [ ] Basic UI components

### Phase 2: Learning Features
- [ ] Course listing
- [ ] Video player
- [ ] Progress tracking
- [ ] Quiz system

### Phase 3: Admin Features
- [ ] Course management
- [ ] User management
- [ ] Analytics dashboard

### Phase 4: Advanced Features
- [ ] Search functionality
- [ ] Email notifications
- [ ] Mobile optimization

## 📖 Next Steps

1. **Setup Supabase project** and run the SQL schema
2. **Configure Google SSO** in Google Cloud Console
3. **Setup Meilisearch** instance (cloud or self-hosted)
4. **Setup Resend** account for email notifications
5. **Start development** with authentication flow

---

**Target Launch:** Internal beta testing within 4 weeks  
**Production:** Full deployment for TBS GROUP training programs 