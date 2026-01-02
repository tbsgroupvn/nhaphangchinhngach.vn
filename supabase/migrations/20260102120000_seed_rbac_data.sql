-- =====================================================
-- Migration: Seed RBAC Data
-- Version: 20260102120000
-- Description: Insert initial roles, permissions, and mappings
-- Author: TBS Group Backend Team
-- =====================================================

-- =====================================================
-- 1. INSERT PERMISSIONS
-- =====================================================
INSERT INTO public.permissions (code, description, module) VALUES
  -- Dashboard
  ('dashboard.view', 'Xem dashboard và thống kê', 'dashboard'),

  -- Users module
  ('users.view', 'Xem danh sách người dùng', 'users'),
  ('users.manage', 'Quản lý người dùng (tạo/sửa/xóa/gán role)', 'users'),

  -- Content module (Posts)
  ('content.view', 'Xem danh sách posts', 'content'),
  ('content.manage', 'Quản lý posts (tạo/sửa/xóa/publish)', 'content'),

  -- Services module
  ('services.view', 'Xem danh sách services', 'services'),
  ('services.manage', 'Quản lý services (tạo/sửa/xóa/publish)', 'services'),

  -- Media module
  ('media.view', 'Xem thư viện media', 'media'),
  ('media.manage', 'Upload và quản lý media', 'media'),

  -- Settings module
  ('settings.view', 'Xem cài đặt hệ thống', 'settings'),
  ('settings.manage', 'Quản lý cài đặt, roles, permissions', 'settings'),

  -- Analytics module
  ('analytics.view', 'Xem báo cáo và phân tích', 'analytics')

ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 2. INSERT ROLES
-- =====================================================
INSERT INTO public.roles (name, code, description, is_system) VALUES
  (
    'Super Administrator',
    'super_admin',
    'Toàn quyền hệ thống, không thể bị hạn chế. Có mọi quyền.',
    TRUE
  ),
  (
    'Administrator',
    'admin',
    'Quản trị viên với quyền quản lý hầu hết tính năng (trừ system settings).',
    TRUE
  ),
  (
    'Editor',
    'editor',
    'Biên tập viên, quản lý nội dung và media.',
    TRUE
  ),
  (
    'Viewer',
    'viewer',
    'Chỉ xem, không được chỉnh sửa.',
    TRUE
  )
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 3. MAP PERMISSIONS TO ROLES
-- =====================================================

-- 3.1 Super Admin: ALL PERMISSIONS
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT
  r.id as role_id,
  p.id as permission_id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.code = 'super_admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 3.2 Admin: All except some system-level settings
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT
  r.id as role_id,
  p.id as permission_id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.code = 'admin'
  AND p.code IN (
    'dashboard.view',
    'users.view',
    'users.manage',
    'content.view',
    'content.manage',
    'services.view',
    'services.manage',
    'media.view',
    'media.manage',
    'settings.view',
    'analytics.view'
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 3.3 Editor: Content, Services, Media management
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT
  r.id as role_id,
  p.id as permission_id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.code = 'editor'
  AND p.code IN (
    'dashboard.view',
    'content.view',
    'content.manage',
    'services.view',
    'services.manage',
    'media.view',
    'media.manage',
    'analytics.view'
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 3.4 Viewer: Read-only access
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT
  r.id as role_id,
  p.id as permission_id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.code = 'viewer'
  AND p.code IN (
    'dashboard.view',
    'users.view',
    'content.view',
    'services.view',
    'media.view',
    'settings.view'
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- =====================================================
-- 4. VERIFICATION QUERIES (For Admin Reference)
-- =====================================================

-- Count permissions per role
DO $$
DECLARE
  v_super_admin_count INTEGER;
  v_admin_count INTEGER;
  v_editor_count INTEGER;
  v_viewer_count INTEGER;
BEGIN
  -- Count permissions for each role
  SELECT COUNT(*) INTO v_super_admin_count
  FROM public.role_permissions rp
  JOIN public.roles r ON rp.role_id = r.id
  WHERE r.code = 'super_admin';

  SELECT COUNT(*) INTO v_admin_count
  FROM public.role_permissions rp
  JOIN public.roles r ON rp.role_id = r.id
  WHERE r.code = 'admin';

  SELECT COUNT(*) INTO v_editor_count
  FROM public.role_permissions rp
  JOIN public.roles r ON rp.role_id = r.id
  WHERE r.code = 'editor';

  SELECT COUNT(*) INTO v_viewer_count
  FROM public.role_permissions rp
  JOIN public.roles r ON rp.role_id = r.id
  WHERE r.code = 'viewer';

  -- Display summary
  RAISE NOTICE '✓ RBAC seed data created successfully';
  RAISE NOTICE '';
  RAISE NOTICE '📊 PERMISSIONS SUMMARY:';
  RAISE NOTICE '  - Total permissions: 13';
  RAISE NOTICE '';
  RAISE NOTICE '👥 ROLES & PERMISSION COUNTS:';
  RAISE NOTICE '  - super_admin: % permissions (ALL)', v_super_admin_count;
  RAISE NOTICE '  - admin: % permissions', v_admin_count;
  RAISE NOTICE '  - editor: % permissions', v_editor_count;
  RAISE NOTICE '  - viewer: % permissions (read-only)', v_viewer_count;
  RAISE NOTICE '';
  RAISE NOTICE '📝 NEXT STEPS:';
  RAISE NOTICE '  1. Create your first user in Supabase Auth UI';
  RAISE NOTICE '  2. Copy the user ID';
  RAISE NOTICE '  3. Assign super_admin role using:';
  RAISE NOTICE '     SELECT assign_role_to_user(';
  RAISE NOTICE '       ''<user-id>''::uuid,';
  RAISE NOTICE '       ''super_admin'',';
  RAISE NOTICE '       ''<user-id>''::uuid';
  RAISE NOTICE '     );';
  RAISE NOTICE '';
END $$;
