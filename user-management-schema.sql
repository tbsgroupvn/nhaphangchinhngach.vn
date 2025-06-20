-- TBS GROUP User Management Database Schema
-- Version: 1.0
-- Created: 2024-12-20

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'editor', 'viewer') NOT NULL DEFAULT 'viewer',
    status ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(32),
    login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    last_login_ip VARCHAR(45),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    email_verification_token VARCHAR(255),
    email_verification_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Roles table (for dynamic role management)
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(50) DEFAULT 'text-gray-600 bg-gray-100',
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- Permissions table
CREATE TABLE permissions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_category (category)
);

-- Role permissions mapping
CREATE TABLE role_permissions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    role_id VARCHAR(36) NOT NULL,
    permission_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_role_permission (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- User sessions table
CREATE TABLE user_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_expires_at (expires_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User activity log
CREATE TABLE user_activities (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id VARCHAR(36),
    target_name VARCHAR(255),
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at),
    INDEX idx_target_type (target_type),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Password history table (for password reuse prevention)
CREATE TABLE password_history (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User preferences table
CREATE TABLE user_preferences (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    preference_key VARCHAR(100) NOT NULL,
    preference_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_preference (user_id, preference_key),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default roles
INSERT INTO roles (id, name, display_name, description, color, is_system_role) VALUES
('role_super_admin', 'super_admin', 'Super Admin', 'Toàn quyền hệ thống, không thể bị hạn chế', 'text-red-600 bg-red-100', TRUE),
('role_admin', 'admin', 'Administrator', 'Quản trị viên, có thể quản lý hầu hết tính năng', 'text-purple-600 bg-purple-100', TRUE),
('role_editor', 'editor', 'Editor', 'Biên tập viên, quản lý nội dung và media', 'text-blue-600 bg-blue-100', TRUE),
('role_viewer', 'viewer', 'Viewer', 'Chỉ xem, không được chỉnh sửa', 'text-gray-600 bg-gray-100', TRUE);

-- Insert default permissions
INSERT INTO permissions (id, name, display_name, description, category) VALUES
-- Dashboard
('perm_dashboard_view', 'dashboard.view', 'Xem Dashboard', 'Có thể truy cập và xem dashboard', 'dashboard'),

-- Users Management
('perm_users_view', 'users.view', 'Xem người dùng', 'Có thể xem danh sách người dùng', 'users'),
('perm_users_create', 'users.create', 'Tạo người dùng', 'Có thể tạo tài khoản người dùng mới', 'users'),
('perm_users_edit', 'users.edit', 'Sửa người dùng', 'Có thể chỉnh sửa thông tin người dùng', 'users'),
('perm_users_delete', 'users.delete', 'Xóa người dùng', 'Có thể xóa tài khoản người dùng', 'users'),
('perm_users_manage', 'users.manage', 'Quản lý người dùng', 'Toàn quyền quản lý người dùng', 'users'),

-- Content Management
('perm_posts_view', 'posts.view', 'Xem bài viết', 'Có thể xem danh sách bài viết', 'content'),
('perm_posts_create', 'posts.create', 'Tạo bài viết', 'Có thể tạo bài viết mới', 'content'),
('perm_posts_edit', 'posts.edit', 'Sửa bài viết', 'Có thể chỉnh sửa bài viết', 'content'),
('perm_posts_delete', 'posts.delete', 'Xóa bài viết', 'Có thể xóa bài viết', 'content'),
('perm_posts_manage', 'posts.manage', 'Quản lý bài viết', 'Toàn quyền quản lý bài viết', 'content'),

-- Services Management  
('perm_services_view', 'services.view', 'Xem dịch vụ', 'Có thể xem danh sách dịch vụ', 'services'),
('perm_services_create', 'services.create', 'Tạo dịch vụ', 'Có thể tạo dịch vụ mới', 'services'),
('perm_services_edit', 'services.edit', 'Sửa dịch vụ', 'Có thể chỉnh sửa dịch vụ', 'services'),
('perm_services_delete', 'services.delete', 'Xóa dịch vụ', 'Có thể xóa dịch vụ', 'services'),
('perm_services_manage', 'services.manage', 'Quản lý dịch vụ', 'Toàn quyền quản lý dịch vụ', 'services'),

-- Media Management
('perm_media_view', 'media.view', 'Xem media', 'Có thể xem thư viện media', 'media'),
('perm_media_upload', 'media.upload', 'Upload media', 'Có thể upload file media', 'media'),
('perm_media_edit', 'media.edit', 'Sửa media', 'Có thể chỉnh sửa thông tin media', 'media'),
('perm_media_delete', 'media.delete', 'Xóa media', 'Có thể xóa file media', 'media'),
('perm_media_manage', 'media.manage', 'Quản lý media', 'Toàn quyền quản lý media', 'media'),

-- Settings
('perm_settings_view', 'settings.view', 'Xem cài đặt', 'Có thể xem cài đặt hệ thống', 'settings'),
('perm_settings_edit', 'settings.edit', 'Sửa cài đặt', 'Có thể chỉnh sửa cài đặt hệ thống', 'settings'),
('perm_settings_manage', 'settings.manage', 'Quản lý cài đặt', 'Toàn quyền quản lý cài đặt', 'settings'),

-- Analytics
('perm_analytics_view', 'analytics.view', 'Xem báo cáo', 'Có thể xem báo cáo analytics', 'analytics'),

-- Special permission
('perm_all', '*', 'Toàn quyền', 'Có tất cả quyền hạn trong hệ thống', 'system');

-- Assign permissions to roles
-- Super Admin: All permissions
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 'role_super_admin', id FROM permissions WHERE name = '*';

-- Admin: Most permissions except super admin features
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 'role_admin', id FROM permissions WHERE name IN (
    'dashboard.view', 'users.manage', 'posts.manage', 'services.manage', 
    'media.manage', 'settings.manage', 'analytics.view'
);

-- Editor: Content and media management
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 'role_editor', id FROM permissions WHERE name IN (
    'dashboard.view', 'posts.manage', 'services.manage', 'media.manage', 'analytics.view'
);

-- Viewer: Read-only access
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 'role_viewer', id FROM permissions WHERE name IN (
    'dashboard.view', 'posts.view', 'services.view', 'media.view'
);

-- Insert default super admin user
INSERT INTO users (
    id, username, email, full_name, password_hash, role, status, 
    email_verified, created_by
) VALUES (
    'user_super_admin', 
    'admin_tbs', 
    'admin@tbsgroup.vn', 
    'Admin TBS GROUP',
    '$2b$10$example_hashed_password', -- Replace with actual bcrypt hash
    'super_admin',
    'active',
    TRUE,
    'user_super_admin'
);

-- Create indexes for better performance
CREATE INDEX idx_user_activities_user_action ON user_activities(user_id, action);
CREATE INDEX idx_user_activities_created_at_desc ON user_activities(created_at DESC);
CREATE INDEX idx_user_sessions_user_active ON user_sessions(user_id, is_active);
CREATE INDEX idx_password_history_user_created ON password_history(user_id, created_at DESC);

-- Create views for common queries
CREATE VIEW user_summary AS
SELECT 
    u.id,
    u.username,
    u.email,
    u.full_name,
    u.role,
    u.status,
    u.last_login,
    u.created_at,
    r.display_name as role_display_name,
    r.color as role_color,
    COUNT(DISTINCT s.id) as active_sessions,
    COUNT(DISTINCT a.id) as total_activities
FROM users u
LEFT JOIN roles r ON u.role = r.name
LEFT JOIN user_sessions s ON u.id = s.user_id AND s.is_active = TRUE AND s.expires_at > NOW()
LEFT JOIN user_activities a ON u.id = a.user_id
GROUP BY u.id, r.id;

CREATE VIEW role_permission_summary AS
SELECT 
    r.id as role_id,
    r.name as role_name,
    r.display_name,
    GROUP_CONCAT(p.name) as permissions,
    GROUP_CONCAT(p.display_name) as permission_names,
    COUNT(u.id) as user_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
LEFT JOIN permissions p ON rp.permission_id = p.id
LEFT JOIN users u ON r.name = u.role
GROUP BY r.id; 