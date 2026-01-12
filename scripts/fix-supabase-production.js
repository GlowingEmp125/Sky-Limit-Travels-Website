#!/usr/bin/env node

/**
 * Supabase Production Fix Script
 * This script helps diagnose and fix common Supabase connection issues in production
 */

const { PrismaClient } = require('@prisma/client');

console.log('🔍 Supabase Production Diagnostic Tool');
console.log('=====================================\n');

// Environment validation
function validateEnvironment() {
  console.log('1. Checking Environment Variables...\n');
  
  const requiredVars = [
    'POSTGRES_PRISMA_URL',
    'POSTGRES_URL_NON_POOLING',
    'NEXTAUTH_SECRET',
    'NODE_ENV'
  ];
  
  const missingVars = [];
  const presentVars = [];
  
  requiredVars.forEach(envVar => {
    if (process.env[envVar]) {
      presentVars.push(envVar);
    } else {
      missingVars.push(envVar);
    }
  });
  
  console.log('✅ Present variables:');
  presentVars.forEach(v => console.log(`   - ${v}`));
  
  if (missingVars.length > 0) {
    console.log('\n❌ Missing variables:');
    missingVars.forEach(v => console.log(`   - ${v}`));
    console.log('\n⚠️  Please set these in your Vercel environment variables.');
  }
  
  return missingVars.length === 0;
}

// Test database connection with different configurations
async function testDatabaseConnections() {
  console.log('\n2. Testing Database Connections...\n');
  
  const connectionConfigs = [
    {
      name: 'Pooled Connection (Recommended)',
      url: process.env.POSTGRES_PRISMA_URL,
      options: {
        log: ['error'],
        datasources: { db: { url: process.env.POSTGRES_PRISMA_URL } }
      }
    },
    {
      name: 'Direct Connection',
      url: process.env.POSTGRES_URL_NON_POOLING,
      options: {
        log: ['error'],
        datasources: { db: { url: process.env.POSTGRES_URL_NON_POOLING } }
      }
    }
  ];
  
  for (const config of connectionConfigs) {
    if (!config.url) {
      console.log(`❌ ${config.name}: URL not configured`);
      continue;
    }
    
    console.log(`Testing ${config.name}...`);
    
    const prisma = new PrismaClient(config.options);
    
    try {
      // Test connection
      await prisma.$connect();
      console.log(`✅ ${config.name}: Connection successful`);
      
      // Test simple query
      try {
        const userCount = await prisma.user.count();
        console.log(`✅ ${config.name}: Query successful (${userCount} users)`);
      } catch (queryError) {
        if (queryError.code === 'P2021') {
          console.log(`⚠️  ${config.name}: Table doesn't exist yet (normal for first deployment)`);
        } else {
          console.log(`❌ ${config.name}: Query failed - ${queryError.message}`);
        }
      }
      
      await prisma.$disconnect();
    } catch (error) {
      console.log(`❌ ${config.name}: Connection failed`);
      console.log(`   Error: ${error.message}`);
      console.log(`   Code: ${error.code || 'unknown'}`);
    }
  }
}

// Validate connection string format
function validateConnectionStrings() {
  console.log('\n3. Validating Connection String Formats...\n');
  
  const connections = {
    'POSTGRES_PRISMA_URL': process.env.POSTGRES_PRISMA_URL,
    'POSTGRES_URL_NON_POOLING': process.env.POSTGRES_URL_NON_POOLING
  };
  
  Object.entries(connections).forEach(([name, url]) => {
    if (!url) {
      console.log(`❌ ${name}: Not configured`);
      return;
    }
    
    try {
      const parsed = new URL(url);
      console.log(`✅ ${name}: Valid URL format`);
      console.log(`   - Host: ${parsed.host}`);
      console.log(`   - Port: ${parsed.port}`);
      console.log(`   - Database: ${parsed.pathname.substring(1)}`);
      
      // Check for recommended parameters
      const params = new URLSearchParams(parsed.search);
      
      if (name === 'POSTGRES_PRISMA_URL') {
        if (params.has('pgbouncer') && params.get('pgbouncer') === 'true') {
          console.log(`   ✅ pgbouncer=true parameter present`);
        } else {
          console.log(`   ⚠️  Missing pgbouncer=true parameter (recommended)`);
        }
        
        if (params.has('connection_limit')) {
          const limit = params.get('connection_limit');
          console.log(`   ✅ connection_limit=${limit}`);
          if (parseInt(limit) > 5) {
            console.log(`   ⚠️  Connection limit ${limit} might be too high for serverless`);
          }
        } else {
          console.log(`   ⚠️  Missing connection_limit parameter (recommended: 1)`);
        }
      }
      
    } catch (error) {
      console.log(`❌ ${name}: Invalid URL format`);
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
  });
}

// Generate recommended configuration
function generateRecommendedConfig() {
  console.log('\n4. Recommended Configuration...\n');
  
  const pooledUrl = process.env.POSTGRES_PRISMA_URL;
  const directUrl = process.env.POSTGRES_URL_NON_POOLING;
  
  if (pooledUrl && directUrl) {
    try {
      const pooledParsed = new URL(pooledUrl);
      const directParsed = new URL(directUrl);
      
      // Generate optimized URLs
      const optimizedPooled = new URL(pooledParsed);
      optimizedPooled.searchParams.set('pgbouncer', 'true');
      optimizedPooled.searchParams.set('connection_limit', '1');
      
      console.log('Recommended environment variables for Vercel:');
      console.log('');
      console.log('POSTGRES_PRISMA_URL=' + optimizedPooled.toString());
      console.log('POSTGRES_URL_NON_POOLING=' + directParsed.toString());
      console.log('DATABASE_URL=' + optimizedPooled.toString());
      
    } catch (error) {
      console.log('❌ Could not generate recommendations due to invalid URLs');
    }
  } else {
    console.log('❌ Cannot generate recommendations - missing connection URLs');
  }
}

// Main execution
async function main() {
  const envValid = validateEnvironment();
  
  if (envValid) {
    await testDatabaseConnections();
    validateConnectionStrings();
    generateRecommendedConfig();
  }
  
  console.log('\n=====================================');
  console.log('📋 Summary & Next Steps:');
  console.log('=====================================\n');
  
  if (!envValid) {
    console.log('1. ❌ Set missing environment variables in Vercel');
    console.log('2. 🔄 Redeploy your application');
    console.log('3. 🧪 Run this script again');
  } else {
    console.log('1. ✅ Environment variables configured');
    console.log('2. 🔍 Check connection test results above');
    console.log('3. 📝 Use recommended configuration if needed');
    console.log('4. 🚀 Deploy and monitor Vercel function logs');
  }
  
  console.log('\n📚 Additional help: Check VERCEL_DEPLOYMENT_GUIDE.md\n');
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('\n💥 Unhandled error:', error);
  process.exit(1);
});

// Run the diagnostic
main().catch(error => {
  console.error('\n💥 Script failed:', error);
  process.exit(1);
}); 