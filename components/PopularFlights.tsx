"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, TrendingUp, Clock, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getFormattedLocation } from '@/data/airports';

interface PopularRoute {
  id: string;
  origin: string;
  destination: string;
  originName: string;
  destinationName: string;
  price: string;
  currency: string;
  duration: string;
  popularity: number;
  savings?: string;
}

// Popular routes data - these are commonly searched routes
const popularRoutes: PopularRoute[] = [
  {
    id: 'lhr-cdg',
    origin: 'LHR',
    destination: 'CDG',
    originName: 'London',
    destinationName: 'Paris',
    price: '89',
    currency: 'GBP',
    duration: '1h 25m',
    popularity: 95,
    savings: 'Save up to 25%'
  },
  {
    id: 'lhr-ams',
    origin: 'LHR',
    destination: 'AMS',
    originName: 'London',
    destinationName: 'Amsterdam',
    price: '105',
    currency: 'GBP',
    duration: '1h 15m',
    popularity: 92,
    savings: 'Save up to 20%'
  },
  {
    id: 'lhr-bcn',
    origin: 'LHR',
    destination: 'BCN',
    originName: 'London',
    destinationName: 'Barcelona',
    price: '125',
    currency: 'GBP',
    duration: '2h 05m',
    popularity: 88,
    savings: 'Save up to 30%'
  },
  {
    id: 'lhr-dub',
    origin: 'LHR',
    destination: 'DUB',
    originName: 'London',
    destinationName: 'Dublin',
    price: '78',
    currency: 'GBP',
    duration: '1h 25m',
    popularity: 85,
  },
  {
    id: 'lhr-mad',
    origin: 'LHR',
    destination: 'MAD',
    originName: 'London',
    destinationName: 'Madrid',
    price: '135',
    currency: 'GBP',
    duration: '2h 15m',
    popularity: 82,
    savings: 'Save up to 15%'
  },
  {
    id: 'lhr-rom',
    origin: 'LHR',
    destination: 'FCO',
    originName: 'London',
    destinationName: 'Rome',
    price: '145',
    currency: 'GBP',
    duration: '2h 45m',
    popularity: 80,
  },
  {
    id: 'lhr-lis',
    origin: 'LHR',
    destination: 'LIS',
    originName: 'London',
    destinationName: 'Lisbon',
    price: '115',
    currency: 'GBP',
    duration: '2h 30m',
    popularity: 78,
    savings: 'Save up to 22%'
  },
  {
    id: 'lhr-ber',
    origin: 'LHR',
    destination: 'BER',
    originName: 'London',
    destinationName: 'Berlin',
    price: '120',
    currency: 'GBP',
    duration: '2h 00m',
    popularity: 75,
  }
];

export default function PopularFlights() {
  const router = useRouter();
  const [visibleRoutes, setVisibleRoutes] = useState(6);

  const handleRouteSelect = (route: PopularRoute) => {
    // Get departure date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const departureDate = tomorrow.toISOString().split('T')[0];

    // Navigate to search results
    const searchParams = new URLSearchParams({
      type: 'flight',
      departureAirport: route.origin,
      destination: route.destination,
      departureDate,
      adults: '1',
      children: '0'
    });

    router.push(`/search?${searchParams.toString()}`);
  };

  const showMoreRoutes = () => {
    setVisibleRoutes(Math.min(visibleRoutes + 3, popularRoutes.length));
  };

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Popular Flight Routes
            </h2>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover trending destinations with great prices. Book your next adventure today!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {popularRoutes.slice(0, visibleRoutes).map((route) => (
            <Card 
              key={route.id} 
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white hover:bg-blue-50/50"
              onClick={() => handleRouteSelect(route)}
            >
              <CardContent className="p-4 md:p-6">
                {/* Route Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Plane className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        <span>{route.originName}</span>
                        <span className="text-gray-400">→</span>
                        <span>{route.destinationName}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {route.origin} → {route.destination}
                      </div>
                    </div>
                  </div>
                  {route.savings && (
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      {route.savings}
                    </div>
                  )}
                </div>

                {/* Flight Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Flight time: {route.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>{route.popularity}% popularity</span>
                    </div>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      £{route.price}
                    </div>
                    <div className="text-xs text-gray-500">
                      from per person
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors"
                  >
                    View Flights
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show More Button */}
        {visibleRoutes < popularRoutes.length && (
          <div className="text-center mt-8">
            <Button 
              variant="outline"
              onClick={showMoreRoutes}
              className="px-8 py-3 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Show More Destinations
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Can't find your destination?
            </h3>
            <p className="text-gray-600 mb-4 max-w-xl mx-auto">
              Search from hundreds of airports worldwide and discover amazing deals on flights to any destination.
            </p>
            <Button 
              onClick={() => router.push('/#search')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Search All Destinations
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 