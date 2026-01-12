/**
 * Script to clean up migration history
 * Use this when you need to start fresh with Prisma migrations
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function cleanupMigrations() {
  console.log('Cleaning up Prisma migration history...');
  
  try {
    const prismaDir = path.join(process.cwd(), 'prisma');
    const migrationsDir = path.join(prismaDir, 'migrations');
    
    // Check if migrations directory exists
    if (fs.existsSync(migrationsDir)) {
      // Create backup directory
      const backupDir = path.join(prismaDir, 'migrations-backup-' + Date.now());
      fs.mkdirSync(backupDir, { recursive: true });
      
      // Backup migrations
      console.log(`Backing up migrations to ${backupDir}`);
      fs.cpSync(migrationsDir, backupDir, { recursive: true });
      
      // Remove migrations directory to start fresh
      fs.rmSync(migrationsDir, { recursive: true, force: true });
      fs.mkdirSync(migrationsDir, { recursive: true });
      
      // Create a new migration_lock.toml file with postgresql provider
      const lockFile = path.join(migrationsDir, 'migration_lock.toml');
      fs.writeFileSync(lockFile, `# This is a Prisma Migrate lockfile v1.
# Manual changes to this file will be ignored.
# It should be committed to version control.

provider = "postgresql"
`);
      
      console.log('Migration history cleaned ✓');
    } else {
      console.log('No migrations directory found. Creating one...');
      fs.mkdirSync(migrationsDir, { recursive: true });
      
      // Create a new migration_lock.toml file with postgresql provider
      const lockFile = path.join(migrationsDir, 'migration_lock.toml');
      fs.writeFileSync(lockFile, `# This is a Prisma Migrate lockfile v1.
# Manual changes to this file will be ignored.
# It should be committed to version control.

provider = "postgresql"
`);
      
      console.log('Created fresh migrations directory ✓');
    }
    
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('\n✅ Migration cleanup completed successfully');
    return true;
  } catch (error) {
    console.error('\n❌ Migration cleanup failed:', error.message);
    console.error(error.stack);
    return false;
  }
}

// Run directly if this script is executed directly
if (require.main === module) {
  const success = cleanupMigrations();
  process.exit(success ? 0 : 1);
}

module.exports = { cleanupMigrations }; 