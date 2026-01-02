# 🔐 RBAC Guide - Role-Based Access Control

Complete guide to understanding and managing permissions in TBS Group CMS.

---

## 📚 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Roles](#roles)
3. [Permissions](#permissions)
4. [User Management](#user-management)
5. [API Authorization](#api-authorization)
6. [Best Practices](#best-practices)

---

## 🎯 OVERVIEW

The CMS uses a **Role-Based Access Control (RBAC)** system where:

- **Users** are assigned **Roles**
- **Roles** contain **Permissions**
- **Permissions** grant access to specific features

### Architecture

```
User → user_roles → Role → role_permissions → Permission
```

Example:
```
John (user)
  → Editor (role)
    → content.manage (permission)
    → media.manage (permission)
```

---

## 👥 ROLES

### 1. Super Admin
**Code**: `super_admin`

**Description**: Ultimate authority. Has ALL permissions and cannot be restricted.

**Permissions**: All (13 permissions)

**Use Case**:
- System owner
- Technical lead
- Should be limited to 1-2 people

**Can**:
- ✅ Manage all users
- ✅ Manage all roles and permissions
- ✅ Manage all content
- ✅ Access all settings
- ✅ View all analytics
- ✅ Delete system roles

**Count**: Should have **1-2 users maximum**

---

### 2. Admin
**Code**: `admin`

**Description**: Site administrator with broad management access.

**Permissions**: 11 permissions
- `dashboard.view`
- `users.view`, `users.manage`
- `content.view`, `content.manage`
- `services.view`, `services.manage`
- `media.view`, `media.manage`
- `settings.view`
- `analytics.view`

**Cannot**:
- ❌ Manage system settings (reserved for super_admin)
- ❌ Delete system roles

**Use Case**:
- Content managers
- Marketing team lead
- Site administrators

**Count**: **2-5 users recommended**

---

### 3. Editor
**Code**: `editor`

**Description**: Content creator and manager.

**Permissions**: 7 permissions
- `dashboard.view`
- `content.view`, `content.manage`
- `services.view`, `services.manage`
- `media.view`, `media.manage`
- `analytics.view`

**Can**:
- ✅ Create/edit/delete posts
- ✅ Create/edit/delete services
- ✅ Upload/manage media
- ✅ Publish content
- ✅ View analytics

**Cannot**:
- ❌ Manage users
- ❌ Manage roles
- ❌ Change system settings

**Use Case**:
- Blog writers
- Content creators
- Marketing team members

**Count**: **5-20 users typical**

---

### 4. Viewer
**Code**: `viewer`

**Description**: Read-only access to admin panel.

**Permissions**: 6 permissions
- `dashboard.view`
- `users.view`
- `content.view`
- `services.view`
- `media.view`
- `settings.view`

**Can**:
- ✅ View all content
- ✅ View user list
- ✅ View media library
- ✅ View dashboard stats

**Cannot**:
- ❌ Create/edit/delete anything
- ❌ Upload media
- ❌ Publish content
- ❌ Manage users

**Use Case**:
- Interns
- External reviewers
- Stakeholders who need visibility

**Count**: **Unlimited**

---

## 🔑 PERMISSIONS

### Complete Permission List

| Code | Description | Module | Roles |
|------|-------------|--------|-------|
| `dashboard.view` | View dashboard and statistics | dashboard | All |
| `users.view` | View user list | users | super_admin, admin, viewer |
| `users.manage` | Create/edit/delete users, assign roles | users | super_admin, admin |
| `content.view` | View posts list | content | All |
| `content.manage` | Create/edit/delete/publish posts | content | super_admin, admin, editor |
| `services.view` | View services list | services | All |
| `services.manage` | Create/edit/delete/publish services | services | super_admin, admin, editor |
| `media.view` | View media library | media | All |
| `media.manage` | Upload/delete media files | media | super_admin, admin, editor |
| `settings.view` | View system settings | settings | super_admin, admin, viewer |
| `settings.manage` | Manage roles, permissions, system config | settings | super_admin only |
| `analytics.view` | View analytics and reports | analytics | super_admin, admin, editor |

### Permission Naming Convention

Format: `<module>.<action>`

- **module**: Feature area (users, content, services, media, settings)
- **action**:
  - `view` - Read-only access
  - `manage` - Full CRUD access

---

## 👤 USER MANAGEMENT

### Creating a New User

**Via Admin UI** (Recommended):

1. Login as super_admin or admin
2. Go to **Users** → **Create User**
3. Fill in:
   - Email
   - Password (generate strong password)
   - Full name
   - Role (select from dropdown)
4. Click **Create**
5. User receives email with credentials

**Via Supabase Dashboard**:

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter email and password
4. Confirm email automatically
5. Copy User ID
6. Run SQL to assign role:
   ```sql
   SELECT assign_role_to_user(
     '<USER_ID>'::uuid,
     'editor',
     '<YOUR_ADMIN_ID>'::uuid
   );
   ```

### Changing User Role

**Via Admin UI**:

1. Go to **Users**
2. Click on user
3. **Manage Roles** section
4. Select new role
5. Click **Assign**
6. Old roles are NOT automatically removed - must revoke manually

**Via API**:

```bash
# Assign role
POST /api/admin/users/<USER_ID>/roles
{
  "roleCode": "editor"
}

# Revoke role
DELETE /api/admin/users/<USER_ID>/roles?roleCode=viewer
```

### Deactivating a User

**Via Admin UI**:

1. Go to **Users**
2. Click on user
3. Change status to **Inactive**
4. User cannot login

**Via SQL**:

```sql
UPDATE users_profile
SET status = 'inactive'
WHERE email = 'user@example.com';
```

### Deleting a User

⚠️ **Warning**: This permanently removes the user from Supabase Auth.

**Via Admin UI**:

1. Go to **Users**
2. Click **Delete** icon
3. Confirm deletion

**Important**:
- User's content (posts, services) is preserved
- `author_id` is set to NULL
- Audit logs remain

---

## 🔒 API AUTHORIZATION

### How It Works

1. **User logs in** → Receives JWT token
2. **Frontend sends request** → Includes token in `Authorization` header
3. **API verifies token** → Calls `withPermission(request, 'permission.code')`
4. **Permission check** → Queries database via `has_permission()` RPC
5. **Allow or deny** → 200 OK or 403 Forbidden

### Example Flow

```typescript
// Frontend
const response = await fetch('/api/admin/posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ title: 'New Post', ... })
});

// Backend (API route)
export async function POST(request: NextRequest) {
  // Verify token + check permission
  const auth = await withPermission(request, 'content.manage');
  if (auth.error) return auth.error; // 401 or 403

  // User has permission, proceed
  const userId = auth.user!.id;
  // ... create post
}
```

### Permission Levels

**Public Routes** (No auth required):
- `/api/public/posts`
- `/api/public/services`

**View Routes** (Read-only):
- `/api/admin/posts` (GET) - requires `content.view` or `content.manage`
- `/api/admin/users` (GET) - requires `users.view` or `users.manage`

**Manage Routes** (CRUD):
- `/api/admin/posts` (POST/PUT/DELETE) - requires `content.manage`
- `/api/admin/media/upload` (POST) - requires `media.manage`

---

## ✅ BEST PRACTICES

### 1. Principle of Least Privilege

- Give users ONLY the permissions they need
- Start with `viewer`, upgrade as needed
- Don't make everyone `admin`

### 2. Role Assignment

| User Type | Recommended Role |
|-----------|------------------|
| Company owner | super_admin |
| Tech lead | super_admin |
| Marketing manager | admin |
| Content writer | editor |
| Intern/Temp | viewer |
| External contractor | editor (limited time) |

### 3. Super Admin Limits

- **Maximum 2 super admins**
- Use for:
  - Initial setup
  - Emergency access
  - System configuration
- Don't use for daily content work

### 4. Regular Audits

Check quarterly:

```sql
-- Users by role
SELECT r.name, COUNT(ur.user_id) as user_count
FROM roles r
LEFT JOIN user_roles ur ON r.id = ur.role_id
GROUP BY r.id, r.name
ORDER BY user_count DESC;

-- Super admins
SELECT up.email, up.full_name
FROM users_profile up
JOIN user_roles ur ON up.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE r.code = 'super_admin';
```

### 5. Audit Logs

Monitor critical actions:

```sql
-- Recent role assignments
SELECT
  al.created_at,
  actor.email as assigned_by,
  al.diff->>'user_id' as user_id,
  al.diff->>'role_code' as role_code
FROM audit_logs al
JOIN users_profile actor ON al.actor_id = actor.id
WHERE al.action IN ('assign_role', 'revoke_role')
ORDER BY al.created_at DESC
LIMIT 20;
```

### 6. Password Policy

- Minimum 12 characters
- Mix of upper/lower/numbers/symbols
- Use password manager (LastPass, 1Password)
- Rotate super admin passwords every 90 days

### 7. Multi-Factor Authentication (Future)

- Enable 2FA for super_admin
- Consider for admin role
- Optional for editor/viewer

---

## 🚨 TROUBLESHOOTING

### User Can't Access Feature

**Check**:

1. User has correct role assigned:
   ```sql
   SELECT r.code, r.name
   FROM user_roles ur
   JOIN roles r ON ur.role_id = r.id
   WHERE ur.user_id = '<USER_ID>';
   ```

2. Role has required permission:
   ```sql
   SELECT p.code, p.description
   FROM role_permissions rp
   JOIN permissions p ON rp.permission_id = p.id
   WHERE rp.role_id = (SELECT id FROM roles WHERE code = 'editor');
   ```

3. Test permission directly:
   ```sql
   SELECT has_permission('<USER_ID>'::uuid, 'content.manage');
   -- Should return true
   ```

### Can't Create Super Admin

**Solution**:

```sql
-- Manual assignment
INSERT INTO user_roles (user_id, role_id, assigned_by)
VALUES (
  '<USER_ID>'::uuid,
  (SELECT id FROM roles WHERE code = 'super_admin'),
  '<USER_ID>'::uuid
);
```

---

## 📊 REFERENCE

### Database Schema

```
users_profile (extends auth.users)
  ├─ id (UUID, references auth.users)
  ├─ email
  ├─ full_name
  └─ status (active/inactive/banned)

roles
  ├─ id (UUID)
  ├─ code (unique: super_admin, admin, editor, viewer)
  ├─ name
  └─ is_system (boolean)

permissions
  ├─ id (UUID)
  ├─ code (unique: users.manage, content.view, etc.)
  └─ module (users, content, services, media, settings)

user_roles (many-to-many)
  ├─ user_id (references auth.users)
  ├─ role_id (references roles)
  └─ assigned_by (references auth.users)

role_permissions (many-to-many)
  ├─ role_id (references roles)
  └─ permission_id (references permissions)
```

### RPC Functions

- `has_permission(user_id, permission_code)` → boolean
- `get_user_permissions(user_id)` → table of permissions
- `get_user_roles(user_id)` → table of roles
- `assign_role_to_user(user_id, role_code, assigned_by)` → boolean
- `revoke_role_from_user(user_id, role_code, revoked_by)` → boolean

---

**Last Updated**: 2026-01-02
**Version**: 1.0.0
