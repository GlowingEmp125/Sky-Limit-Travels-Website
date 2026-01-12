#!/usr/bin/env node

/**
 * API Cost Monitoring Script
 * 
 * Run this script to monitor your Amadeus API costs in real-time
 * Usage: node scripts/monitor-api-costs.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  DAILY_LIMIT: 500,      // $5.00 per day
  MONTHLY_LIMIT: 10000,  // $100.00 per month
  CHECK_INTERVAL: 30000, // Check every 30 seconds
  ALERT_THRESHOLDS: {
    WARNING: 70,   // 70% of limit
    CRITICAL: 90   // 90% of limit
  }
};

const COST_FILE = path.join(process.cwd(), 'logs', 'api-cost-tracking.json');

function readCostData() {
  if (!fs.existsSync(COST_FILE)) {
    return null;
  }
  
  try {
    const data = fs.readFileSync(COST_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading cost data:', error.message);
    return null;
  }
}

function formatCurrency(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatPercentage(value, limit) {
  return `${Math.round((value / limit) * 100)}%`;
}

function getAlertLevel(percentage) {
  if (percentage >= CONFIG.ALERT_THRESHOLDS.CRITICAL) return 'CRITICAL';
  if (percentage >= CONFIG.ALERT_THRESHOLDS.WARNING) return 'WARNING';
  return 'OK';
}

function displayStatus(data) {
  console.clear();
  console.log('🔍 Sky Limit Travels - API Cost Monitor');
  console.log('═'.repeat(50));
  console.log();
  
  if (!data) {
    console.log('❌ No cost data found. API hasn\'t been used yet.');
    return;
  }
  
  const dailyPercentage = (data.dailyCost / CONFIG.DAILY_LIMIT) * 100;
  const monthlyPercentage = (data.monthlyCost / CONFIG.MONTHLY_LIMIT) * 100;
  
  const dailyAlert = getAlertLevel(dailyPercentage);
  const monthlyAlert = getAlertLevel(monthlyPercentage);
  
  // Daily status
  console.log('📅 DAILY USAGE');
  console.log(`   Spent: ${formatCurrency(data.dailyCost)} / ${formatCurrency(CONFIG.DAILY_LIMIT)}`);
  console.log(`   Usage: ${formatPercentage(data.dailyCost, CONFIG.DAILY_LIMIT)}`);
  console.log(`   Status: ${getStatusIcon(dailyAlert)} ${dailyAlert}`);
  console.log();
  
  // Monthly status
  console.log('📊 MONTHLY USAGE');
  console.log(`   Spent: ${formatCurrency(data.monthlyCost)} / ${formatCurrency(CONFIG.MONTHLY_LIMIT)}`);
  console.log(`   Usage: ${formatPercentage(data.monthlyCost, CONFIG.MONTHLY_LIMIT)}`);
  console.log(`   Status: ${getStatusIcon(monthlyAlert)} ${monthlyAlert}`);
  console.log();
  
  // Statistics
  console.log('📈 STATISTICS');
  console.log(`   Total API Calls: ${data.totalCalls || 0}`);
  console.log(`   Average Cost per Call: ${data.totalCalls ? formatCurrency(Math.round(data.monthlyCost / data.totalCalls)) : '$0.00'}`);
  console.log(`   Last Reset: ${data.lastResetDate || 'Never'}`);
  console.log();
  
  // Recent activity
  if (data.records && data.records.length > 0) {
    const recentCalls = data.records.slice(-5);
    console.log('🕐 RECENT ACTIVITY (Last 5 calls)');
    recentCalls.forEach(call => {
      const time = new Date(call.timestamp).toLocaleTimeString();
      console.log(`   ${time} - ${call.endpoint} - ${formatCurrency(call.cost)}`);
    });
    console.log();
  }
  
  // Alerts and recommendations
  const alerts = [];
  if (dailyAlert === 'CRITICAL') {
    alerts.push('🚨 CRITICAL: Daily limit almost reached!');
  } else if (dailyAlert === 'WARNING') {
    alerts.push('⚠️  WARNING: Daily usage high');
  }
  
  if (monthlyAlert === 'CRITICAL') {
    alerts.push('🚨 CRITICAL: Monthly budget nearly depleted!');
  } else if (monthlyAlert === 'WARNING') {
    alerts.push('⚠️  WARNING: Monthly budget usage high');
  }
  
  if (alerts.length > 0) {
    console.log('🚨 ALERTS');
    alerts.forEach(alert => console.log(`   ${alert}`));
    console.log();
  }
  
  // Recommendations
  const recommendations = [];
  if (data.totalCalls > 20) {
    const avgCost = data.monthlyCost / data.totalCalls;
    if (avgCost > 3) {
      recommendations.push('💡 Consider optimizing cache settings (high avg cost per call)');
    }
  }
  
  if (data.records) {
    const recentCallsInLastHour = data.records.filter(
      record => Date.now() - record.timestamp < 60 * 60 * 1000
    ).length;
    
    if (recentCallsInLastHour > 20) {
      recommendations.push('⏰ High API frequency detected - consider request debouncing');
    }
  }
  
  if (recommendations.length > 0) {
    console.log('💡 RECOMMENDATIONS');
    recommendations.forEach(rec => console.log(`   ${rec}`));
    console.log();
  }
  
  console.log(`Last updated: ${new Date().toLocaleString()}`);
  console.log(`Next check in ${CONFIG.CHECK_INTERVAL / 1000} seconds...`);
}

function getStatusIcon(level) {
  switch (level) {
    case 'CRITICAL': return '🚨';
    case 'WARNING': return '⚠️';
    default: return '✅';
  }
}

function startMonitoring() {
  console.log('🚀 Starting API Cost Monitor...');
  console.log(`📊 Monitoring ${COST_FILE}`);
  console.log(`⏰ Check interval: ${CONFIG.CHECK_INTERVAL / 1000} seconds`);
  console.log();
  
  // Initial check
  const data = readCostData();
  displayStatus(data);
  
  // Set up interval checking
  setInterval(() => {
    const data = readCostData();
    displayStatus(data);
  }, CONFIG.CHECK_INTERVAL);
}

// Handle exit gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Cost monitoring stopped.');
  process.exit(0);
});

// Start monitoring
startMonitoring(); 