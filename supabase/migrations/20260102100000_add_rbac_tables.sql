-- =====================================================
-- Migration: Add RBAC (Role-Based Access Control) Tables
-- Version: 20260102100000
-- Description: Create roles, permissions, and user_roles tables
-- Author: TBS Group Backend Team
-- =====================================================

-- =====================================================
-- 1. USERS PROFILE TABLE (Reference auth.users)
-- This table extends Supabase Auth users with profile data
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users_profile (
  -- Primary key (same as auth.users.id)
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Profile information
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  avatar_url TEXT,

  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive', 'banned')),

  -- Metadata
  last_login_at TIMESTAMP WITH TIME ZONE,
  last_login_ip VARCHAR(45),

  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.users_profile IS 'User profiles linked to Supabase Auth users';
COMMENT ON COLUMN public.users_profile.id IS 'References auth.users(id) - same UUID';
COMMENT ON COLUMN public.users_profile.status IS 'Account status: active, inactive, banned';

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_users_profile_email ON public.users_profile(email);
CREATE INDEX IF NOT EXISTS idx_users_profile_status ON public.users_profile(status);

-- =====================================================
-- 2. ROLES TABLE
-- System roles with permissions
-- =====================================================
CREATE TABLE IF NOT EXISTS public.roles (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Role details
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,

  -- System flag (cannot be deleted)
  is_system BOOLEAN NOT NULL DEFAULT FALSE,

  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.roles IS 'System roles for RBAC';
COMMENT ON COLUMN public.roles.code IS 'Unique role code (e.g., super_admin, admin, editor, viewer)';
COMMENT ON COLUMN public.roles.is_system IS 'System roles cannot be deleted';

-- Index
CREATE INDEX IF NOT EXISTS idx_roles_code ON public.roles(code);

-- =====================================================
-- 3. PERMISSIONS TABLE
-- Granular permissions
-- =====================================================
CREATE TABLE IF NOT EXISTS public.permissions (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Permission details
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  module VARCHAR(50),

  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.permissions IS 'Granular permissions for RBAC';
COMMENT ON COLUMN public.permissions.code IS 'Unique permission code (e.g., users.manage, content.view)';
COMMENT ON COLUMN public.permissions.module IS 'Module grouping (e.g., users, content, services, media)';

-- Index
CREATE INDEX IF NOT EXISTS idx_permissions_code ON public.permissions(code);
CREATE INDEX IF NOT EXISTS idx_permissions_module ON public.permissions(module);

-- =====================================================
-- 4. ROLE_PERMISSIONS TABLE
-- Mapping between roles and permissions
-- =====================================================
CREATE TABLE IF NOT EXISTS public.role_permissions (
  -- Composite primary key
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,

  PRIMARY KEY (role_id, permission_id),

  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.role_permissions IS 'Maps roles to permissions (many-to-many)';

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_perm ON public.role_permissions(permission_id);

-- =====================================================
-- 5. USER_ROLES TABLE
-- Mapping between users and roles
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  -- Composite primary key
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,

  PRIMARY KEY (user_id, role_id),

  -- Assignment metadata
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.user_roles IS 'Maps users to roles (many-to-many)';
COMMENT ON COLUMN public.user_roles.assigned_by IS 'User who assigned this role';

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role_id);

-- =====================================================
-- 6. AUDIT_LOGS TABLE (Enhanced version)
-- Comprehensive audit trail for RBAC actions
-- =====================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Actor
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email VARCHAR(255),

  -- Action
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,

  -- Changes (JSONB for before/after diff)
  diff JSONB,

  -- Context
  ip_address VARCHAR(45),
  user_agent TEXT,

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.audit_logs IS 'Comprehensive audit trail for all RBAC actions';
COMMENT ON COLUMN public.audit_logs.action IS 'Action performed (e.g., create_user, assign_role, publish_post)';
COMMENT ON COLUMN public.audit_logs.diff IS 'Before/after values for data modifications';

-- Indexes for audit queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- =====================================================
-- 7. TRIGGER: Auto-create users_profile on auth.users insert
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profile (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists (for idempotency)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS 'Auto-creates users_profile when auth.users is created';

-- =====================================================
-- 8. TRIGGER: Auto-update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to users_profile
DROP TRIGGER IF EXISTS update_users_profile_updated_at ON public.users_profile;
CREATE TRIGGER update_users_profile_updated_at
  BEFORE UPDATE ON public.users_profile
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Apply to roles
DROP TRIGGER IF EXISTS update_roles_updated_at ON public.roles;
CREATE TRIGGER update_roles_updated_at
  BEFORE UPDATE ON public.roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Success notification
DO $$
BEGIN
  RAISE NOTICE '✓ RBAC tables created successfully';
  RAISE NOTICE '  - users_profile (references auth.users)';
  RAISE NOTICE '  - roles';
  RAISE NOTICE '  - permissions';
  RAISE NOTICE '  - role_permissions';
  RAISE NOTICE '  - user_roles';
  RAISE NOTICE '  - audit_logs (enhanced)';
  RAISE NOTICE '  - Triggers: auto-create profile, auto-update timestamps';
END $$;
