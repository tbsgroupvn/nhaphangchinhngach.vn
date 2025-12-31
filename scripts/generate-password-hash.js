// Script to generate bcrypt password hash for admin user
// Usage: node scripts/generate-password-hash.js

const bcrypt = require('bcryptjs');

const password = 'Anhcanem2015@';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }

  console.log('\n==================================');
  console.log('Password Hash Generated Successfully');
  console.log('==================================\n');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nCopy this hash to supabase-setup.sql file');
  console.log('Replace the password_hash value in the INSERT INTO users statement\n');
});
