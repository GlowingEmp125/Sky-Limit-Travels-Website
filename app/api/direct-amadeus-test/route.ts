import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Extract credentials to display (safely)
    const clientId = process.env.AMADEUS_CLIENT_ID || 'Not set';
    const clientSecret = process.env.AMADEUS_CLIENT_SECRET || 'Not set';
    
    // Check for missing credentials
    if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
      return NextResponse.json({
        status: 'error',
        message: 'API credentials are missing',
        details: {
          clientIdPresent: !!process.env.AMADEUS_CLIENT_ID,
          clientSecretPresent: !!process.env.AMADEUS_CLIENT_SECRET
        }
      }, { status: 400 });
    }
    
    // Step 1: Get auth token (manual approach)
    console.log('Attempting to get Amadeus auth token...');
    
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
    
    // Check for auth errors
    if (!tokenResponse.ok || !tokenData.access_token) {
      return NextResponse.json({
        status: 'error',
        message: 'Authentication failed',
        details: {
          statusCode: tokenResponse.status,
          tokenResponse: tokenData
        }
      }, { status: 401 });
    }
    
    console.log('Successfully obtained access token');
    
    // Step 2: Make a simple API call with the token
    const flightResponse = await fetch(
      'https://api.amadeus.com/v2/shopping/flight-offers?originLocationCode=LON&destinationLocationCode=CDG&departureDate=2025-06-15&adults=1&max=1', 
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      }
    );
    
    const flightData = await flightResponse.json();
    
    // Return full details for debugging
    return NextResponse.json({
      status: 'success',
      message: 'API test completed successfully',
      details: {
        authentication: {
          success: true,
          tokenType: tokenData.token_type,
          expiresIn: tokenData.expires_in
        },
        flightSearch: {
          status: flightResponse.status,
          success: flightResponse.ok,
          resultCount: flightData.data?.length || 0,
          sampleData: flightData.data?.[0] ? {
            id: flightData.data[0].id,
            price: flightData.data[0].price
          } : null
        }
      }
    });
  } catch (error) {
    console.error('Error in direct Amadeus test:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'API test failed',
      details: {
        error: error instanceof Error ? error.message : String(error)
      }
    }, { status: 500 });
  }
} 