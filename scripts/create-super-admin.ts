#!/usr/bin/env ts-node

/**
 * Create Super Admin Script
 *
 * Usage:
 *   npx tsx scripts/create-super-admin.ts <USER_ID>
 *
 * Prerequisites:
 *   1. User must exist in Supabase Auth (create via Dashboard)
 *   2. Copy the User ID (UUID)
 *   3. Run this script with that ID
 *
 * Example:
 *   npx tsx scripts/create-super-admin.ts abc123-def456-789-ghi
 */

import { createClient } from '@supabase/supabase-js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing environment variables');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Check your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createSuperAdmin(userId: string) {
  console.log('🚀 Creating super admin...\n');

  try {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      throw new Error('Invalid UUID format');
    }

    // Check if user exists in auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);

    if (authError || !authUser) {
      throw new Error(`User not found in Supabase Auth: ${userId}`);
    }

    console.log(`✓ Found user in Auth: ${authUser.user.email}`);

    // Check if users_profile exists
    const { data: profile, error: profileError } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw new Error(`Error checking profile: ${profileError.message}`);
    }

    if (!profile) {
      console.log('⚠ No profile found, creating...');
      const { error: createError } = await supabase
        .from('users_profile')
        .insert({
          id: userId,
          email: authUser.user.email!,
          full_name: authUser.user.user_metadata?.full_name || '',
        });

      if (createError) {
        throw new Error(`Failed to create profile: ${createError.message}`);
      }
      console.log('✓ Profile created');
    } else {
      console.log('✓ Profile exists');
    }

    // Get super_admin role
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .select('id, code, name')
      .eq('code', 'super_admin')
      .single();

    if (roleError || !role) {
      throw new Error('Super admin role not found. Did you run migrations?');
    }

    console.log(`✓ Found role: ${role.name} (${role.code})`);

    // Check if already has super_admin role
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role_id', role.id)
      .single();

    if (existingRole) {
      console.log('\n⚠ User already has super_admin role!');
      console.log('   No changes made.');
      return;
    }

    // Assign super_admin role using RPC
    const { data: result, error: assignError } = await supabase.rpc('assign_role_to_user', {
      p_user_id: userId,
      p_role_code: 'super_admin',
      p_assigned_by: userId,
    });

    if (assignError) {
      throw new Error(`Failed to assign role: ${assignError.message}`);
    }

    console.log('✓ Super admin role assigned');

    // Verify
    const { data: userRoles } = await supabase.rpc('get_user_roles', {
      p_user_id: userId,
    });

    console.log('\n✅ Success! User roles:');
    if (userRoles && userRoles.length > 0) {
      userRoles.forEach((ur: any) => {
        console.log(`   - ${ur.role_name} (${ur.role_code})`);
      });
    }

    // Get permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: userId,
    });

    console.log('\n📋 Permissions granted:');
    if (permissions && permissions.length > 0) {
      console.log(`   Total: ${permissions.length} permissions`);
      console.log('   (All permissions - super admin has full access)');
    }

    console.log('\n✨ Setup complete!');
    console.log('\nNext steps:');
    console.log(`   1. Login at: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin`);
    console.log(`   2. Email: ${authUser.user.email}`);
    console.log('   3. Password: (the one you set in Supabase Auth)');
    console.log('\n🔒 Security reminder:');
    console.log('   - Keep super admin credentials secure');
    console.log('   - Limit super admin accounts to 1-2 people');
    console.log('   - Use strong passwords');
    console.log('   - Enable 2FA when available');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('   1. Ensure user exists in Supabase Auth Dashboard');
    console.error('   2. Check environment variables are set correctly');
    console.error('   3. Verify database migrations have been run');
    console.error('   4. Check Supabase project is accessible');
    process.exit(1);
  }
}

// Main execution
const userId = process.argv[2];

if (!userId) {
  console.error('❌ Error: Missing user ID');
  console.error('\nUsage:');
  console.error('   npx tsx scripts/create-super-admin.ts <USER_ID>');
  console.error('\nSteps:');
  console.error('   1. Go to Supabase Dashboard → Authentication → Users');
  console.error('   2. Create a new user (or use existing)');
  console.error('   3. Copy the User ID (UUID format)');
  console.error('   4. Run: npx tsx scripts/create-super-admin.ts <USER_ID>');
  console.error('\nExample:');
  console.error('   npx tsx scripts/create-super-admin.ts abc12345-def6-7890-ghij-klmnopqrstuv');
  process.exit(1);
}

createSuperAdmin(userId);
