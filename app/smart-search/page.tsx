'use client';

import SmartFlightSearchForm from '@/components/SmartFlightSearchForm';
import FlightSearchForm from '@/components/FlightSearchForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingDown, Clock, Zap } from 'lucide-react';

export default function SmartSearchDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Smart Flight Search
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our intelligent search system shows cached destinations first, then makes precise API calls only when you've locked in your final choice. This dramatically reduces costs while improving user experience.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <TrendingDown className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Reduced API Calls</h3>
              <p className="text-xs text-gray-600">Up to 80% fewer API requests</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Faster Response</h3>
              <p className="text-xs text-gray-600">Instant cached suggestions</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Smart Caching</h3>
              <p className="text-xs text-gray-600">Learns from user behaviour</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <Lightbulb className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Better UX</h3>
              <p className="text-xs text-gray-600">Guided step-by-step process</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Forms Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Smart Search Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="default" className="bg-green-600">NEW</Badge>
              <h2 className="text-xl font-bold text-gray-900">Smart Search</h2>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="text-sm text-green-700 mb-3 flex items-start gap-2">
                <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">How it works:</p>
                  <ol className="list-decimal list-inside text-xs mt-1 space-y-1">
                    <li>Select origin → Shows cached popular destinations instantly</li>
                    <li>Pick destination → Shows cached date options</li>
                    <li>Choose dates → Only then makes precise API call</li>
                    <li>Get results → Fresh data for your exact requirements</li>
                  </ol>
                </div>
              </div>
            </div>
            
            <SmartFlightSearchForm variant="featured" />
          </div>

          {/* Traditional Search Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">TRADITIONAL</Badge>
              <h2 className="text-xl font-bold text-gray-900">Standard Search</h2>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-3 flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Traditional approach:</p>
                  <ol className="list-decimal list-inside text-xs mt-1 space-y-1">
                    <li>User types in all details manually</li>
                    <li>Clicks search → Immediate API call</li>
                    <li>High API usage for browsing/exploring</li>
                    <li>Slower initial experience</li>
                  </ol>
                </div>
              </div>
            </div>
            
            <FlightSearchForm variant="featured" />
          </div>
        </div>

        {/* How Smart Caching Works */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Smart Caching Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Cached Suggestions</h3>
                  <p className="text-sm text-gray-600">
                    Popular destinations and date ranges are cached locally. Users see instant suggestions without API calls.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">User Selection</h3>
                  <p className="text-sm text-gray-600">
                    As users make selections, we track their choices and provide increasingly specific cached options.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Precise API Call</h3>
                  <p className="text-sm text-gray-600">
                    Only when users have committed to specific origin, destination, and dates do we make a targeted API call.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Result:</strong> Instead of potentially hundreds of exploratory API calls, 
                  we make just one precise call per actual booking intent. This saves costs while 
                  providing users with instant feedback during their search process.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 