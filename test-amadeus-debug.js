const https = require('https');
const { URLSearchParams } = require('url');

// Load environment variables from .env file
require('dotenv').config();

async function testAmadeusAPI() {
  console.log('Testing Amadeus API connection...');
  
  // Check if credentials are loaded
  if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
    console.error('❌ Missing Amadeus API credentials in environment variables');
    console.log('CLIENT_ID:', process.env.AMADEUS_CLIENT_ID ? 'Set' : 'Missing');
    console.log('CLIENT_SECRET:', process.env.AMADEUS_CLIENT_SECRET ? 'Set' : 'Missing');
    return;
  }
  
  console.log('✅ Amadeus credentials found');
  console.log('CLIENT_ID:', process.env.AMADEUS_CLIENT_ID);
  
  try {
    // Step 1: Test authentication
    console.log('\n1. Testing authentication...');
    
    const tokenResponse = await fetch('https://api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': process.env.AMADEUS_CLIENT_ID,
        'client_secret': process.env.AMADEUS_CLIENT_SECRET
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('❌ Authentication failed');
      console.error('Status:', tokenResponse.status);
      console.error('Response:', tokenData);
      return;
    }
    
    if (!tokenData.access_token) {
      console.error('❌ No access token received');
      console.error('Response:', tokenData);
      return;
    }
    
    console.log('✅ Authentication successful');
    console.log('Token type:', tokenData.token_type);
    console.log('Expires in:', tokenData.expires_in, 'seconds');
    
    // Step 2: Test a simple flight search
    console.log('\n2. Testing flight search...');
    
    const today = new Date();
    const departureDate = new Date(today.setDate(today.getDate() + 14)).toISOString().split('T')[0];
    const returnDate = new Date(today.setDate(today.getDate() + 7)).toISOString().split('T')[0];
    
    console.log('Searching for flights:');
    console.log('- From: LON (London)');
    console.log('- To: CDG (Paris)');
    console.log('- Departure:', departureDate);
    console.log('- Return:', returnDate);
    
    const searchUrl = `https://api.amadeus.com/v2/shopping/flight-offers?originLocationCode=LON&destinationLocationCode=CDG&departureDate=${departureDate}&returnDate=${returnDate}&adults=1&max=2&currencyCode=EUR`;
    
    const searchResponse = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });
    
    const searchData = await searchResponse.json();
    
    if (!searchResponse.ok) {
      console.error('❌ Flight search failed');
      console.error('Status:', searchResponse.status);
      console.error('Response:', searchData);
      
      // Check for common error types
      if (searchData.errors) {
        searchData.errors.forEach(error => {
          console.error(`Error ${error.code}: ${error.title}`);
          console.error('Detail:', error.detail);
        });
      }
      return;
    }
    
    if (!searchData.data || searchData.data.length === 0) {
      console.log('⚠️  No flights found');
      console.log('Response data:', searchData);
      return;
    }
    
    console.log('✅ Flight search successful');
    console.log('Found', searchData.data.length, 'flights');
    console.log('First flight price: €' + searchData.data[0].price.total);
    console.log('Currency:', searchData.data[0].price.currency);
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testAmadeusAPI(); 