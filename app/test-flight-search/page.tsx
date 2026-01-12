"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestFlightSearch() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Test parameters
  const [origin, setOrigin] = useState('LHR');
  const [destination, setDestination] = useState('CDG');
  const [departureDate, setDepartureDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    return tomorrow.toISOString().split('T')[0];
  });

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing API with:', { origin, destination, departureDate });

      const searchParams = new URLSearchParams({
        origin,
        destination,
        departureDate,
        adults: '1',
        children: '0',
      });

      const response = await fetch(`/api/flights/search?${searchParams.toString()}`);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      setResult(data);
    } catch (err) {
      console.error('Test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Flight Search API Test</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origin (IATA Code)
                </label>
                <Input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                  placeholder="LHR"
                  maxLength={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination (IATA Code)
                </label>
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value.toUpperCase())}
                  placeholder="CDG"
                  maxLength={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Date
                </label>
                <Input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={testAPI} 
              disabled={loading || !origin || !destination || !departureDate}
              className="w-full"
            >
              {loading ? 'Testing API...' : 'Test Flight Search API'}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-8 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">API Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Success:</span> {result.success ? '✅ Yes' : '❌ No'}
                  </div>
                  <div>
                    <span className="font-medium">Flight Count:</span> {result.count || 0}
                  </div>
                </div>

                {result.data && result.data.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Sample Flight:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Price:</span> £{result.data[0].price?.total || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Currency:</span> {result.data[0].price?.currency || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Itineraries:</span> {result.data[0].itineraries?.length || 0}
                        </div>
                        <div>
                          <span className="font-medium">Flight ID:</span> {result.data[0].id || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                    View Full Response (Click to expand)
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-xs overflow-auto max-h-96">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Testing API connection...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 