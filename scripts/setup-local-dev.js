#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up local development environment...');

// Check if we're in development mode
if (process.env.NODE_ENV === 'production') {
  console.error('❌ This script is for development only!');
  process.exit(1);
}

// Backup current schema if it exists
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const backupPath = path.join(__dirname, '..', 'prisma', 'schema.prisma.backup');
const localSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.local.prisma');

try {
  // Create backup of current schema
  if (fs.existsSync(schemaPath)) {
    fs.copyFileSync(schemaPath, backupPath);
    console.log('✅ Backed up current schema');
  }

  // Copy local SQLite schema to main schema
  if (fs.existsSync(localSchemaPath)) {
    fs.copyFileSync(localSchemaPath, schemaPath);
    console.log('✅ Switched to SQLite schema for local development');
  } else {
    console.error('❌ Local schema file not found');
    process.exit(1);
  }

  // Generate Prisma client
  console.log('🔄 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');

  // Push schema to database (creates SQLite file if it doesn't exist)
  console.log('🔄 Setting up database...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Database schema updated');

  console.log('\n🎉 Local development environment is ready!');
  console.log('📝 You can now run: npm run dev');
  console.log('\n💡 To restore production schema, run: npm run restore-prod-schema');

} catch (error) {
  console.error('❌ Error setting up local development:', error.message);
  
  // Try to restore backup if something went wrong
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, schemaPath);
    console.log('🔄 Restored backup schema');
  }
  
  process.exit(1);
} 