import { NextRequest, NextResponse } from 'next/server';
import Amadeus from 'amadeus';
import { LogLevel, logAmadeusEvent } from '@/lib/amadeus-error-logger';

export async function GET(request: NextRequest) {
  // Test ID for tracking
  const testId = crypto.randomUUID().substring(0, 8);
  
  // Log test attempt
  logAmadeusEvent(
    LogLevel.INFO,
    'test-amadeus-credentials',
    `Testing Amadeus credentials [${testId}]`,
    { url: request.url }
  );
  
  // Extract credentials to display (safely)
  const clientId = process.env.AMADEUS_CLIENT_ID || 'Not set';
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET || 'Not set';
  
  // Log credentials info (without exposing full values)
  const credentialInfo = {
    clientIdPresent: !!process.env.AMADEUS_CLIENT_ID,
    clientIdFirstChars: process.env.AMADEUS_CLIENT_ID ? process.env.AMADEUS_CLIENT_ID.substring(0, 4) + '...' : 'Not set',
    clientIdLength: process.env.AMADEUS_CLIENT_ID?.length || 0,
    clientSecretPresent: !!process.env.AMADEUS_CLIENT_SECRET,
    clientSecretFirstChars: process.env.AMADEUS_CLIENT_SECRET ? process.env.AMADEUS_CLIENT_SECRET.substring(0, 4) + '...' : 'Not set',
    clientSecretLength: process.env.AMADEUS_CLIENT_SECRET?.length || 0
  };
  
  logAmadeusEvent(
    LogLevel.DEBUG,
    'test-amadeus-credentials',
    `Amadeus credential info [${testId}]`,
    credentialInfo
  );
  
  try {
    // Create Amadeus client
    const amadeus = new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET
    });
    
    // Test with a simple API call
    const startTime = Date.now();
    logAmadeusEvent(
      LogLevel.INFO,
      'test-amadeus-credentials',
      `Making test API call [${testId}]`
    );
    
    // Use a minimal API call that should work regardless of search parameters
    const testResponse = await amadeus.shopping.flightDestinations.get({
      origin: 'LON',
      maxPrice: 200,
      max: 1
    });
    
    const callDuration = Date.now() - startTime;
    
    // Log success
    logAmadeusEvent(
      LogLevel.INFO,
      'test-amadeus-credentials',
      `API call succeeded [${testId}]`,
      { 
        duration: `${callDuration}ms`,
        status: testResponse.result?.status,
        dataLength: testResponse.data?.length || 0 
      }
    );
    
    // Return detailed success info
    return NextResponse.json({
      status: 'success',
      message: 'Amadeus API credentials are valid and working',
      details: {
        testId,
        credentials: credentialInfo,
        apiCall: {
          endpoint: 'shopping.flightDestinations',
          duration: `${callDuration}ms`,
          status: testResponse.result?.status,
          dataAvailable: !!testResponse.data,
          dataLength: testResponse.data?.length || 0,
          firstResultSample: testResponse.data?.[0] ? 
            { 
              destination: testResponse.data[0].destination,
              price: testResponse.data[0].price
            } : null
        }
      }
    });
  } catch (error) {
    // Log the error
    logAmadeusEvent(
      LogLevel.ERROR,
      'test-amadeus-credentials',
      `API credential test failed [${testId}]`,
      { 
        errorMessage: error instanceof Error ? error.message : String(error),
        errorName: error instanceof Error ? error.name : 'Unknown',
        errorStack: error instanceof Error ? error.stack : null,
        responseData: (error as any)?.response?.data || null
      }
    );
    
    // Get detailed error info
    const errorResponse = (error as any)?.response?.data?.errors;
    const errorCode = errorResponse?.[0]?.code || (error as any)?.code || 'UNKNOWN';
    const errorDetail = errorResponse?.[0]?.detail || (error as any)?.message || 'Unknown error';
    const errorTitle = errorResponse?.[0]?.title || '';
    
    // Determine if it's an authentication error
    const isAuthError = errorCode === '38190-Client Authentication Failed' || 
                         errorDetail.includes('authentication') || 
                         errorDetail.includes('credential') ||
                         errorDetail.includes('token');
    
    // Return detailed error info
    return NextResponse.json({
      status: 'error',
      message: isAuthError ? 
        'Authentication failed: The API credentials appear to be invalid' : 
        'API test failed, but not due to authentication issues',
      details: {
        testId,
        credentials: credentialInfo,
        error: {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          code: errorCode,
          detail: errorDetail,
          title: errorTitle,
          isAuthError: isAuthError
        },
        troubleshooting: {
          suggestions: [
            'Check that your AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET are correct',
            'Verify that your Amadeus API subscription is active',
            'Ensure the API credentials have access to the Flight Offers Search API',
            'Check if you\'ve exceeded your API rate limits'
          ],
          nextSteps: [
            'Review your .env.local file for correct credentials',
            'Generate new API credentials in the Amadeus Developer Portal',
            'Check the logs for detailed error information'
          ]
        }
      }
    }, { status: 401 });
  }
} 