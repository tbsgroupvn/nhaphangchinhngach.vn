-- TBS GROUP - Supabase Database Schema
-- Website CMS Management System
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned')),
    email_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(32),
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    last_login_ip VARCHAR(45),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    email_verification_token VARCHAR(255),
    email_verification_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- ROLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(50) DEFAULT 'text-gray-600 bg-gray-100',
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PERMISSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROLE PERMISSIONS MAPPING
-- ============================================
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- ============================================
-- USER SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER ACTIVITIES LOG
-- ============================================
CREATE TABLE IF NOT EXISTS user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id VARCHAR(36),
    target_name VARCHAR(255),
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PASSWORD HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS password_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER PREFERENCES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, preference_key)
);

-- ============================================
-- MEDIA FOLDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    item_count INTEGER DEFAULT 0,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MEDIA FILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS media_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('image', 'video', 'document', 'audio')),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    size BIGINT NOT NULL,
    dimensions JSONB,
    uploaded_at DATE NOT NULL DEFAULT CURRENT_DATE,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',
    downloads INTEGER DEFAULT 0,
    description TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- POSTS/ARTICLES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(500),
    category VARCHAR(100),
    tags TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    views INTEGER DEFAULT 0,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seo_title VARCHAR(200),
    seo_description TEXT,
    seo_keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    icon VARCHAR(100),
    featured_image VARCHAR(500),
    price_text VARCHAR(200),
    price_from DECIMAL(15,2),
    price_to DECIMAL(15,2),
    features JSONB,
    order_index INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seo_title VARCHAR(200),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SITE SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_action ON user_activities(action);
CREATE INDEX IF NOT EXISTS idx_user_activities_created ON user_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_media_files_type ON media_files(type);
CREATE INDEX IF NOT EXISTS idx_media_files_folder_id ON media_files(folder_id);
CREATE INDEX IF NOT EXISTS idx_media_files_user_id ON media_files(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_files_updated_at BEFORE UPDATE ON media_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSERT DEFAULT ROLES
-- ============================================
INSERT INTO roles (name, display_name, description, color, is_system_role) VALUES
('super_admin', 'Super Admin', 'Toàn quyền hệ thống, không thể bị hạn chế', 'text-red-600 bg-red-100', TRUE),
('admin', 'Administrator', 'Quản trị viên, có thể quản lý hầu hết tính năng', 'text-purple-600 bg-purple-100', TRUE),
('editor', 'Editor', 'Biên tập viên, quản lý nội dung và media', 'text-blue-600 bg-blue-100', TRUE),
('viewer', 'Viewer', 'Chỉ xem, không được chỉnh sửa', 'text-gray-600 bg-gray-100', TRUE)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- INSERT DEFAULT PERMISSIONS
-- ============================================
INSERT INTO permissions (name, display_name, description, category) VALUES
-- Dashboard
('dashboard.view', 'Xem Dashboard', 'Có thể truy cập và xem dashboard', 'dashboard'),
-- Users
('users.view', 'Xem người dùng', 'Có thể xem danh sách người dùng', 'users'),
('users.create', 'Tạo người dùng', 'Có thể tạo tài khoản người dùng mới', 'users'),
('users.edit', 'Sửa người dùng', 'Có thể chỉnh sửa thông tin người dùng', 'users'),
('users.delete', 'Xóa người dùng', 'Có thể xóa tài khoản người dùng', 'users'),
('users.manage', 'Quản lý người dùng', 'Toàn quyền quản lý người dùng', 'users'),
-- Content
('posts.view', 'Xem bài viết', 'Có thể xem danh sách bài viết', 'content'),
('posts.create', 'Tạo bài viết', 'Có thể tạo bài viết mới', 'content'),
('posts.edit', 'Sửa bài viết', 'Có thể chỉnh sửa bài viết', 'content'),
('posts.delete', 'Xóa bài viết', 'Có thể xóa bài viết', 'content'),
('posts.manage', 'Quản lý bài viết', 'Toàn quyền quản lý bài viết', 'content'),
-- Services
('services.view', 'Xem dịch vụ', 'Có thể xem danh sách dịch vụ', 'services'),
('services.create', 'Tạo dịch vụ', 'Có thể tạo dịch vụ mới', 'services'),
('services.edit', 'Sửa dịch vụ', 'Có thể chỉnh sửa dịch vụ', 'services'),
('services.delete', 'Xóa dịch vụ', 'Có thể xóa dịch vụ', 'services'),
('services.manage', 'Quản lý dịch vụ', 'Toàn quyền quản lý dịch vụ', 'services'),
-- Media
('media.view', 'Xem media', 'Có thể xem thư viện media', 'media'),
('media.upload', 'Upload media', 'Có thể upload file media', 'media'),
('media.edit', 'Sửa media', 'Có thể chỉnh sửa thông tin media', 'media'),
('media.delete', 'Xóa media', 'Có thể xóa file media', 'media'),
('media.manage', 'Quản lý media', 'Toàn quyền quản lý media', 'media'),
-- Settings
('settings.view', 'Xem cài đặt', 'Có thể xem cài đặt hệ thống', 'settings'),
('settings.edit', 'Sửa cài đặt', 'Có thể chỉnh sửa cài đặt hệ thống', 'settings'),
('settings.manage', 'Quản lý cài đặt', 'Toàn quyền quản lý cài đặt', 'settings'),
-- Analytics
('analytics.view', 'Xem báo cáo', 'Có thể xem báo cáo analytics', 'analytics'),
-- System
('*', 'Toàn quyền', 'Có tất cả quyền hạn trong hệ thống', 'system')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- ASSIGN PERMISSIONS TO ROLES
-- ============================================
-- Super Admin: All permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'super_admin' AND p.name = '*'
ON CONFLICT DO NOTHING;

-- Admin: Most permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'admin' AND p.name IN (
    'dashboard.view', 'users.manage', 'posts.manage', 'services.manage',
    'media.manage', 'settings.manage', 'analytics.view'
)
ON CONFLICT DO NOTHING;

-- Editor: Content and media
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'editor' AND p.name IN (
    'dashboard.view', 'posts.manage', 'services.manage', 'media.manage', 'analytics.view'
)
ON CONFLICT DO NOTHING;

-- Viewer: Read-only
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'viewer' AND p.name IN (
    'dashboard.view', 'posts.view', 'services.view', 'media.view'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- CREATE DEFAULT ADMIN USER
-- Username: admin
-- Password: Anhcanem2015@
-- Password hash generated with bcrypt
-- ============================================
INSERT INTO users (
    username, email, full_name, password_hash, role, status,
    email_verified, created_by
) VALUES (
    'admin',
    'admin@nhaphangchinhngach.vn',
    'Administrator',
    -- bcrypt hash for 'Anhcanem2015@'
    '$2b$10$m5xO3qdPr.MMMbxxs5b1eu0HVVpaneQlFgD2ulKjCfg7s7feIzaGS',
    'super_admin',
    'active',
    TRUE,
    NULL
)
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- INSERT DEFAULT FOLDERS
-- ============================================
INSERT INTO folders (name, parent_id, user_id)
SELECT 'Hình ảnh', NULL, id FROM users WHERE username = 'admin' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO folders (name, parent_id, user_id)
SELECT 'Tài liệu', NULL, id FROM users WHERE username = 'admin' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO folders (name, parent_id, user_id)
SELECT 'Video', NULL, id FROM users WHERE username = 'admin' LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERT DEFAULT SITE SETTINGS
-- ============================================
INSERT INTO site_settings (setting_key, setting_value, description) VALUES
('site_name', '{"vi": "TBS Group - Nhập hàng chính ngạch", "en": "TBS Group - Official Import"}', 'Tên website'),
('site_description', '{"vi": "Dịch vụ nhập khẩu chính ngạch uy tín, chuyên nghiệp", "en": "Professional official import services"}', 'Mô tả website'),
('contact_email', '"info@nhaphangchinhngach.vn"', 'Email liên hệ'),
('contact_phone', '"0901234567"', 'Số điện thoại liên hệ'),
('contact_address', '{"vi": "Hồ Chí Minh, Việt Nam", "en": "Ho Chi Minh City, Vietnam"}', 'Địa chỉ liên hệ'),
('social_facebook', '"https://facebook.com/tbsgroup"', 'Facebook URL'),
('social_linkedin', '"https://linkedin.com/company/tbsgroup"', 'LinkedIn URL'),
('theme_primary_color', '"#DC2626"', 'Màu chủ đạo'),
('theme_secondary_color', '"#1E40AF"', 'Màu phụ')
ON CONFLICT (setting_key) DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Users can view all users if authenticated
CREATE POLICY "Authenticated users can view users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can manage all users
CREATE POLICY "Admins can manage users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Media files policies
CREATE POLICY "Users can view their own media" ON media_files
  FOR SELECT USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
  ));

CREATE POLICY "Users can insert their own media" ON media_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own media" ON media_files
  FOR UPDATE USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
  ));

CREATE POLICY "Users can delete their own media" ON media_files
  FOR DELETE USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
  ));

-- Similar policies for folders, posts, and services
CREATE POLICY "Users can manage their folders" ON folders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their posts" ON posts FOR ALL USING (auth.uid() = author_id);
CREATE POLICY "Users can manage their services" ON services FOR ALL USING (auth.uid() = author_id);

-- ============================================
-- STORAGE BUCKET SETUP
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view media files" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND auth.uid() = owner);

CREATE POLICY "Users can delete their media" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND auth.uid() = owner);

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Next steps:
-- 1. Copy your Supabase URL and keys to .env.local
-- 2. Update the admin password hash with actual bcrypt hash
-- 3. Configure storage bucket in Supabase dashboard
-- 4. Test authentication flow
