import crypto from 'crypto';

interface FlightSegment {
  origin: string;
  destination: string;
  date: string;
}

interface SearchParams {
  adults?: number;
  children?: number;
  infants?: number;
  trip_class?: 'Y' | 'C';
  segments: FlightSegment[];
}

const API_HOST = 'https://api.travelpayouts.com/v1/flight_search';

export async function searchFlights(params: SearchParams, userIp: string) {
  const marker = process.env.TRAVELPAYOUTS_MARKER;
  const apiToken = process.env.TRAVELPAYOUTS_API_TOKEN;

  if (!marker || !apiToken) {
    throw new Error('Travelpayouts API credentials are not set.');
  }

  const requestBody = {
    marker,
    host: 'skylimittravels.com', // Replace with your actual host if different
    // Travelpayouts rejects loopback (127.0.0.0/8 or ::1) IPs, so substitute a valid public IP during local development
    user_ip: /^(127\.|::1)/.test(userIp) ? '8.8.8.8' : userIp,
    locale: 'en',
    trip_class: params.trip_class || 'Y',
    passengers: {
      adults: params.adults || 1,
      children: params.children || 0,
      infants: params.infants || 0,
    },
    segments: params.segments,
  };

  const signatureParams: Record<string, any> = {
    host: requestBody.host,
    locale: requestBody.locale,
    marker: requestBody.marker,
    passengers: [
        requestBody.passengers.adults,
        requestBody.passengers.children,
        requestBody.passengers.infants,
    ].join(':'),
    segments: requestBody.segments.map(s => `${s.origin}:${s.destination}:${s.date}`).join(':'),
    trip_class: requestBody.trip_class,
    user_ip: requestBody.user_ip
  };

  const sortedKeys = Object.keys(signatureParams).sort();

  const signaturePayload = [
    apiToken,
    ...sortedKeys.map(key => signatureParams[key]),
  ].join(':');

  const signature = crypto.createHash('md5').update(signaturePayload).digest('hex');

  const finalRequestBody = {
    signature,
    ...requestBody,
  };

  const response = await fetch(API_HOST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(finalRequestBody),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Travelpayouts API error: ${response.status}`, errorBody);
    throw new Error(`Failed to fetch flight search results from Travelpayouts.`);
  }

  const searchInitiationResult = await response.json();

  // Now we need to poll for results
  const searchId = searchInitiationResult.search_id;
  const resultsUrl = `https://api.travelpayouts.com/v1/flight_search_results?uuid=${searchId}`;

  let attempts = 0;
  const maxAttempts = 10;
  const delay = 2000; // 2 seconds

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const resultsResponse = await fetch(resultsUrl);
    
    if (resultsResponse.ok) {
      const results = await resultsResponse.json();
      // The API returns an array of results. We will check if we have proposals.
      // The last element of the results array should have `last` property set to true.
      if (Array.isArray(results) && results.length > 0) {
        const lastResult = results[results.length - 1];
        if(lastResult.proposals || lastResult.gates_count === 0 || lastResult.is_final_result) {
            return results;
        }
      }
    }
    attempts++;
  }

  throw new Error('Timed out waiting for Travelpayouts flight search results.');
}
