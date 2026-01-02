-- =====================================================
-- Migration: Create RBAC Functions
-- Version: 20260102110000
-- Description: RPC functions for permission checking
-- Author: TBS Group Backend Team
-- =====================================================

-- =====================================================
-- 1. FUNCTION: has_permission
-- Check if user has a specific permission
-- =====================================================
CREATE OR REPLACE FUNCTION public.has_permission(
  p_user_id UUID,
  p_permission_code TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_has_permission BOOLEAN;
BEGIN
  -- Check if user has the permission through their roles
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = p_user_id
      AND p.code = p_permission_code
  ) INTO v_has_permission;

  RETURN COALESCE(v_has_permission, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.has_permission(UUID, TEXT) IS 'Check if user has specific permission';

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.has_permission(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission(UUID, TEXT) TO service_role;

-- =====================================================
-- 2. FUNCTION: get_user_permissions
-- Get all permissions for a user
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_permissions(
  p_user_id UUID
) RETURNS TABLE(
  code TEXT,
  description TEXT,
  module VARCHAR(50)
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    p.code,
    p.description,
    p.module
  FROM public.user_roles ur
  JOIN public.role_permissions rp ON ur.role_id = rp.role_id
  JOIN public.permissions p ON rp.permission_id = p.id
  WHERE ur.user_id = p_user_id
  ORDER BY p.module, p.code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.get_user_permissions(UUID) IS 'Get all permissions for a user';

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_permissions(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_permissions(UUID) TO service_role;

-- =====================================================
-- 3. FUNCTION: get_user_roles
-- Get all roles for a user with details
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_roles(
  p_user_id UUID
) RETURNS TABLE(
  role_id UUID,
  role_code VARCHAR(50),
  role_name VARCHAR(100),
  role_description TEXT,
  assigned_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.code,
    r.name,
    r.description,
    ur.assigned_at
  FROM public.user_roles ur
  JOIN public.roles r ON ur.role_id = r.id
  WHERE ur.user_id = p_user_id
  ORDER BY ur.assigned_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.get_user_roles(UUID) IS 'Get all roles for a user with details';

-- Grant execute
GRANT EXECUTE ON FUNCTION public.get_user_roles(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_roles(UUID) TO service_role;

-- =====================================================
-- 4. FUNCTION: assign_role_to_user
-- Assign a role to user (with audit logging)
-- =====================================================
CREATE OR REPLACE FUNCTION public.assign_role_to_user(
  p_user_id UUID,
  p_role_code VARCHAR(50),
  p_assigned_by UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_role_id UUID;
BEGIN
  -- Get role ID from code
  SELECT id INTO v_role_id
  FROM public.roles
  WHERE code = p_role_code;

  -- Check if role exists
  IF v_role_id IS NULL THEN
    RAISE EXCEPTION 'Role with code % does not exist', p_role_code;
  END IF;

  -- Insert user_role (or do nothing if already exists)
  INSERT INTO public.user_roles (user_id, role_id, assigned_by)
  VALUES (p_user_id, v_role_id, p_assigned_by)
  ON CONFLICT (user_id, role_id) DO NOTHING;

  -- Log the action
  INSERT INTO public.audit_logs (actor_id, action, table_name, record_id, diff)
  VALUES (
    p_assigned_by,
    'assign_role',
    'user_roles',
    p_user_id,
    jsonb_build_object(
      'user_id', p_user_id,
      'role_code', p_role_code,
      'assigned_by', p_assigned_by
    )
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.assign_role_to_user(UUID, VARCHAR, UUID) IS 'Assign role to user with audit logging';

-- Grant execute (only service_role for security)
GRANT EXECUTE ON FUNCTION public.assign_role_to_user(UUID, VARCHAR, UUID) TO service_role;

-- =====================================================
-- 5. FUNCTION: revoke_role_from_user
-- Revoke a role from user (with audit logging)
-- =====================================================
CREATE OR REPLACE FUNCTION public.revoke_role_from_user(
  p_user_id UUID,
  p_role_code VARCHAR(50),
  p_revoked_by UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_role_id UUID;
BEGIN
  -- Get role ID from code
  SELECT id INTO v_role_id
  FROM public.roles
  WHERE code = p_role_code;

  -- Check if role exists
  IF v_role_id IS NULL THEN
    RAISE EXCEPTION 'Role with code % does not exist', p_role_code;
  END IF;

  -- Delete user_role
  DELETE FROM public.user_roles
  WHERE user_id = p_user_id AND role_id = v_role_id;

  -- Log the action
  INSERT INTO public.audit_logs (actor_id, action, table_name, record_id, diff)
  VALUES (
    p_revoked_by,
    'revoke_role',
    'user_roles',
    p_user_id,
    jsonb_build_object(
      'user_id', p_user_id,
      'role_code', p_role_code,
      'revoked_by', p_revoked_by
    )
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.revoke_role_from_user(UUID, VARCHAR, UUID) IS 'Revoke role from user with audit logging';

-- Grant execute (only service_role for security)
GRANT EXECUTE ON FUNCTION public.revoke_role_from_user(UUID, VARCHAR, UUID) TO service_role;

-- =====================================================
-- 6. FUNCTION: check_user_can_publish
-- Business logic: Check if user can publish content
-- =====================================================
CREATE OR REPLACE FUNCTION public.check_user_can_publish(
  p_user_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.has_permission(p_user_id, 'content.manage');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

COMMENT ON FUNCTION public.check_user_can_publish(UUID) IS 'Check if user can publish content';

-- Grant execute
GRANT EXECUTE ON FUNCTION public.check_user_can_publish(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_user_can_publish(UUID) TO service_role;

-- Success notification
DO $$
BEGIN
  RAISE NOTICE '✓ RBAC functions created successfully';
  RAISE NOTICE '  - has_permission(user_id, permission_code)';
  RAISE NOTICE '  - get_user_permissions(user_id)';
  RAISE NOTICE '  - get_user_roles(user_id)';
  RAISE NOTICE '  - assign_role_to_user(user_id, role_code, assigned_by)';
  RAISE NOTICE '  - revoke_role_from_user(user_id, role_code, revoked_by)';
  RAISE NOTICE '  - check_user_can_publish(user_id)';
END $$;
