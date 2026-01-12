#!/usr/bin/env node

/**
 * Utility script to generate an API key for admin endpoints
 * Usage: node scripts/generate-api-key.js
 */

// Simple hash function (same as in api-rate-limiter.ts)
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

// Get API secret from .env file or use default
function getApiSecret() {
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(process.cwd(), '.env');
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envLines = envContent.split('\n');
      
      for (const line of envLines) {
        if (line.startsWith('API_KEY_SECRET=')) {
          return line.split('=')[1].trim().replace(/^"|"$/g, '');
        }
      }
    }
    
    // Fallback to default secret
    return 'skylimit-default-secret-key';
  } catch (error) {
    console.error('Error reading API secret:', error);
    return 'skylimit-default-secret-key';
  }
}

// Generate API key
function generateApiKey() {
  const secret = getApiSecret();
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return simpleHash(`${secret}-${today}`);
}

// Output generated key
const apiKey = generateApiKey();
console.log('\n--- ADMIN API KEY ---');
console.log(`\nKey: ${apiKey}`);
console.log('\nThis key is valid for today only and will expire at midnight.');
console.log('\nTo use this key:');
console.log('  curl -H "x-api-key: ' + apiKey + '" http://localhost:3000/api/admin/usage\n'); 