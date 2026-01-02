#!/usr/bin/env node

/**
 * Generate Admin Password Hash
 *
 * This script generates a bcrypt hash for the admin password
 * Use this hash to update the default admin user in the database
 */

const readline = require('readline');

// Check if bcryptjs is installed
try {
  var bcrypt = require('bcryptjs');
} catch (error) {
  console.error('❌ Error: bcryptjs is not installed');
  console.log('\nPlease install it first:');
  console.log('  npm install bcryptjs');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('='.repeat(60));
console.log('📝 Admin Password Generator');
console.log('='.repeat(60));
console.log('');

rl.question('Enter password for admin user: ', (password) => {
  if (!password || password.length < 8) {
    console.error('❌ Password must be at least 8 characters long');
    rl.close();
    process.exit(1);
  }

  console.log('\n🔐 Generating password hash...\n');

  const hash = bcrypt.hashSync(password, 10);

  console.log('✅ Password hash generated successfully!\n');
  console.log('Hash:');
  console.log('-'.repeat(60));
  console.log(hash);
  console.log('-'.repeat(60));
  console.log('');
  console.log('📋 Copy the hash above and run this SQL in Supabase:\n');
  console.log('UPDATE public.users');
  console.log(`SET password_hash = '${hash}'`);
  console.log("WHERE username = 'admin';");
  console.log('');
  console.log('⚠️  Keep this password safe and change it after first login!');
  console.log('');

  rl.close();
});
