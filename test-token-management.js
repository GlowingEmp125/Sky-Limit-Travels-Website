// Test script for the new token management system
require('dotenv').config();

// Token management system (same as in amadeus.ts)
let tokenCache = null;
const TOKEN_BUFFER_TIME = 60 * 1000; // Refresh token 1 minute before expiry

// Function to get a valid access token (with automatic refresh)
async function getValidAccessToken() {
  console.log('🔐 Token check: Checking token validity...');
  
  // Check if we have a cached token that's still valid
  if (tokenCache && tokenCache.expires_at > Date.now() + TOKEN_BUFFER_TIME) {
    console.log('✅ Using cached access token (expires in', Math.floor((tokenCache.expires_at - Date.now()) / 1000), 'seconds)');
    return tokenCache.access_token;
  }

  console.log('🔄 Fetching new Amadeus access token...');
  
  if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
    throw new Error('Missing Amadeus API credentials: AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET are required');
  }

  try {
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

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error('❌ Token request failed:', tokenResponse.status, errorData);
      throw new Error(`Failed to authenticate with Amadeus API: ${tokenResponse.status} ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      console.error('❌ No access token in response:', tokenData);
      throw new Error('Failed to authenticate with Amadeus API: No access token received');
    }

    // Cache the token with expiry time
    tokenCache = {
      access_token: tokenData.access_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000), // Convert seconds to milliseconds
      token_type: tokenData.token_type || 'Bearer'
    };

    console.log(`✅ New access token cached, expires in ${tokenData.expires_in} seconds`);
    return tokenCache.access_token;
  } catch (error) {
    console.error('❌ Error getting access token:', error);
    throw new Error(`Failed to authenticate with Amadeus API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to make authenticated API calls with automatic token refresh
async function makeAuthenticatedRequest(url, options = {}) {
  console.log('🌐 Making authenticated request to:', url.split('?')[0]);
  
  const token = await getValidAccessToken();
  
  const authenticatedOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  };

  const response = await fetch(url, authenticatedOptions);
  
  console.log('📡 API Response status:', response.status, response.statusText);
  
  // If we get a 401 (unauthorized), the token might have expired
  // Try once more with a fresh token
  if (response.status === 401) {
    console.log('🔄 Received 401, refreshing token and retrying...');
    
    // Force token refresh by clearing cache
    tokenCache = null;
    const newToken = await getValidAccessToken();
    
    const retryOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${newToken}`
      }
    };
    
    const retryResponse = await fetch(url, retryOptions);
    console.log('🔁 Retry response status:', retryResponse.status, retryResponse.statusText);
    return retryResponse;
  }
  
  return response;
}

// Test the token management system
async function testTokenManagement() {
  console.log('🧪 Testing token management system...\n');
  
  try {
    // Test 1: Basic token generation
    console.log('Test 1: Basic token generation');
    const token1 = await getValidAccessToken();
    console.log('Token length:', token1.length);
    console.log('✅ Test 1 passed\n');
    
    // Test 2: Token caching (should reuse the same token)
    console.log('Test 2: Token caching');
    const token2 = await getValidAccessToken();
    console.log('Same token?', token1 === token2);
    console.log('✅ Test 2 passed\n');
    
    // Test 3: Authenticated API call
    console.log('Test 3: Authenticated API call');
    const response = await makeAuthenticatedRequest(
      'https://api.amadeus.com/v2/shopping/flight-offers?originLocationCode=LHR&destinationLocationCode=CDG&departureDate=2025-06-10&returnDate=2025-06-17&adults=1&max=2&currencyCode=EUR'
    );
    
    const data = await response.json();
    
    if (response.ok && data.data && Array.isArray(data.data)) {
      console.log('✅ API call successful! Found', data.data.length, 'flights');
      console.log('First flight price: €' + data.data[0].price.total);
      console.log('✅ Test 3 passed\n');
    } else {
      console.log('❌ API call failed:', response.status, data);
      console.log('❌ Test 3 failed\n');
    }
    
    console.log('🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testTokenManagement(); 