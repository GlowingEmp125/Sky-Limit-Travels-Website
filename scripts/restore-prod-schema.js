#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Restoring production schema...');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const backupPath = path.join(__dirname, '..', 'prisma', 'schema.prisma.backup');
const prodSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.production.prisma');

try {
  // Check if we have a production schema or backup
  let sourceSchema = null;
  
  if (fs.existsSync(prodSchemaPath)) {
    sourceSchema = prodSchemaPath;
    console.log('✅ Found production schema file');
  } else if (fs.existsSync(backupPath)) {
    sourceSchema = backupPath;
    console.log('✅ Found backup schema file');
  } else {
    console.error('❌ No production schema or backup found');
    process.exit(1);
  }

  // Restore the schema
  fs.copyFileSync(sourceSchema, schemaPath);
  console.log('✅ Restored production PostgreSQL schema');

  // Generate Prisma client
  console.log('🔄 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');

  console.log('\n🎉 Production schema restored!');
  console.log('📝 Make sure to set your PostgreSQL environment variables for production');

} catch (error) {
  console.error('❌ Error restoring production schema:', error.message);
  process.exit(1);
} 