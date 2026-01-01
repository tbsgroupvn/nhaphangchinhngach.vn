-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned')),
  email_verified BOOLEAN DEFAULT FALSE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  last_login_ip VARCHAR(45),
  password_reset_token TEXT,
  password_reset_expires TIMESTAMP WITH TIME ZONE,
  email_verification_token TEXT,
  email_verification_expires TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id)
);

-- Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  seo_title VARCHAR(500),
  seo_description TEXT,
  seo_keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  icon VARCHAR(100),
  featured_image TEXT,
  price_text VARCHAR(200),
  price_from NUMERIC(15, 2),
  price_to NUMERIC(15, 2),
  features JSONB,
  order_index INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  seo_title VARCHAR(500),
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer_stories table
CREATE TABLE IF NOT EXISTS public.customer_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  customer_name VARCHAR(255),
  customer_company VARCHAR(255),
  customer_avatar TEXT,
  featured_image TEXT,
  tags TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  location VARCHAR(255),
  job_type VARCHAR(50), -- full-time, part-time, contract, etc.
  salary_range VARCHAR(200),
  requirements TEXT[],
  benefits TEXT[],
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'draft')),
  published_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create folders table
CREATE TABLE IF NOT EXISTS public.folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
  item_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create media_files table
CREATE TABLE IF NOT EXISTS public.media_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(500) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('image', 'video', 'document', 'audio')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  size BIGINT NOT NULL,
  dimensions JSONB,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  downloads INTEGER DEFAULT 0,
  description TEXT,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  refresh_token TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_activities table
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  target_type VARCHAR(100),
  target_id UUID,
  target_name VARCHAR(500),
  details JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_views table for tracking analytics
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path VARCHAR(500) NOT NULL,
  page_title VARCHAR(500),
  content_type VARCHAR(50), -- post, service, story, job, page
  content_id UUID,
  visitor_id TEXT, -- anonymized visitor identifier
  session_id TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer TEXT,
  country VARCHAR(100),
  city VARCHAR(100),
  device_type VARCHAR(50),
  browser VARCHAR(100),
  os VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);

CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_services_order ON public.services(order_index);

CREATE INDEX IF NOT EXISTS idx_customer_stories_slug ON public.customer_stories(slug);
CREATE INDEX IF NOT EXISTS idx_customer_stories_status ON public.customer_stories(status);

CREATE INDEX IF NOT EXISTS idx_jobs_slug ON public.jobs(slug);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);

CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_content ON public.page_views(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON public.page_views(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_activities_user ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created ON public.user_activities(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_stories_updated_at BEFORE UPDATE ON public.customer_stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_files_updated_at BEFORE UPDATE ON public.media_files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (anyone can view published content)
CREATE POLICY "Public can view published posts" ON public.posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view active services" ON public.services
  FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view published customer stories" ON public.customer_stories
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view open jobs" ON public.jobs
  FOR SELECT USING (status = 'open');

-- Page views are public for analytics
CREATE POLICY "Anyone can insert page views" ON public.page_views
  FOR INSERT WITH CHECK (true);

-- Admin policies (authenticated users with proper roles)
-- Note: You'll need to implement authentication logic separately
CREATE POLICY "Authenticated users can view all users" ON public.users
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view all content" ON public.posts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create content" ON public.posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their content" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id OR auth.role() = 'admin');

-- Similar policies for other tables
CREATE POLICY "Authenticated users can manage services" ON public.services
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage customer stories" ON public.customer_stories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage jobs" ON public.jobs
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage media" ON public.media_files
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, description) VALUES
  ('site_name', '"TBS GROUP"', 'Tên website'),
  ('site_description', '"Công ty xuất nhập khẩu hàng đầu Việt Nam"', 'Mô tả website'),
  ('site_url', '"https://nhaphangchinhngach.vn"', 'URL website'),
  ('primary_color', '"#dc2626"', 'Màu chủ đạo'),
  ('secondary_color', '"#2563eb"', 'Màu phụ')
ON CONFLICT (setting_key) DO NOTHING;
