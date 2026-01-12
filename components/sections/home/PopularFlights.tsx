"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, TrendingUp, Clock, MapPin, Sparkles, ArrowRight, Tag, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  image?: string;
  description?: string;
  category?: string;
}

// Enhanced popular routes data with destination images and descriptions
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
    savings: 'Save up to 25%',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&q=80&w=600',
    description: 'Discover the City of Light with its iconic landmarks and romantic atmosphere',
    category: 'Most Popular'
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
    savings: 'Save up to 20%',
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&q=80&w=600',
    description: 'Explore charming canals, world-class museums and vibrant culture',
    category: 'Quick Escape'
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
    savings: 'Save up to 30%',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&q=80&w=600',
    description: 'Experience Gaudí\'s architecture, stunning beaches and vibrant nightlife',
    category: 'Best Value'
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
    image: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?ixlib=rb-4.0.3&q=80&w=600',
    description: 'Enjoy the warmth of Irish hospitality and stunning countryside',
    category: 'Budget Friendly'
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
    savings: 'Save up to 15%',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&q=80&w=600',
    description: 'Discover elegant boulevards, world-class museums and authentic tapas',
    category: 'Cultural'
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
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&q=80&w=600',
    description: 'Step into history amongst ancient ruins and Renaissance masterpieces',
    category: 'Historic'
  }
];

// Popular countries data with enhanced visuals
const countryDestinations = [
  {
    id: 'france',
    name: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&q=80&w=800',
    description: 'From the romantic streets of Paris to the lavender fields of Provence',
    path: '/flights/countries/france',
    destinations: ['Paris', 'Nice', 'Lyon', 'Toulouse'],
    fromPrice: '89'
  },
  {
    id: 'italy',
    name: 'Italy',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&q=80&w=800',
    description: 'Ancient Rome, Renaissance Florence, and the romantic canals of Venice',
    path: '/flights/countries/italy',
    destinations: ['Rome', 'Venice', 'Florence', 'Milan'],
    fromPrice: '145'
  },
  {
    id: 'spain',
    name: 'Spain',
    image: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?ixlib=rb-4.0.3&q=80&w=800',
    description: 'Vibrant cities, stunning coastlines, and rich cultural heritage',
    path: '/flights/countries/spain',
    destinations: ['Barcelona', 'Madrid', 'Seville', 'Valencia'],
    fromPrice: '125'
  }
];

export default function PopularFlights() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');

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

  const categories = ['all', 'Most Popular', 'Quick Escape', 'Best Value', 'Budget Friendly'];
  
  const filteredRoutes = activeCategory === 'all' 
    ? popularRoutes 
    : popularRoutes.filter(route => route.category === activeCategory);

  return (
    <div className="bg-gray-50 py-20">
      {/* Popular Flight Routes Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-blue-700 font-medium">Most Searched Routes</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Popular Flight Destinations
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Discover trending destinations with fantastic prices. Your next adventure is just a click away!
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 shadow-sm'
              }`}
            >
              {category === 'all' ? 'All Routes' : category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredRoutes.map((route, index) => (
            <Card 
              key={route.id} 
              className="group relative overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white hover:-translate-y-1"
              onClick={() => handleRouteSelect(route)}
            >
              {/* Background Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={route.image || '/images/default-destination.jpg'}
                  alt={`${route.destinationName} destination`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Category Badge */}
                {route.category && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm">
                      <Sparkles className="h-3 w-3" />
                      {route.category}
                    </span>
                  </div>
                )}

                {/* Savings Badge */}
                {route.savings && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg">
                      {route.savings}
                    </span>
                  </div>
                )}

                {/* Route Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white">
                      <h3 className="text-xl font-bold">{route.destinationName}</h3>
                      <p className="text-white/80 text-sm">{route.origin} → {route.destination}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <Plane className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {route.description}
                </p>

                {/* Flight Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-green-500" />
                    <span>{route.popularity}% popular</span>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      £{route.price}
                    </div>
                    <div className="text-xs text-gray-500">from per person</div>
                  </div>
                  <Button 
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Book Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Countries Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full mb-6">
            <MapPin className="h-5 w-5 text-slate-600" />
            <span className="text-slate-700 font-medium">Country Destinations</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore by Country
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Discover multiple destinations within your favourite countries with special packages and deals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {countryDestinations.map((country, index) => (
            <Card 
              key={country.id} 
              className="group relative overflow-hidden border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white hover:-translate-y-1"
              onClick={() => router.push(country.path)}
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={country.image}
                  alt={`${country.name} scenic view`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                {/* Price Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                    <div className="text-sm text-gray-600">From</div>
                    <div className="text-lg font-bold text-blue-600">£{country.fromPrice}</div>
                  </div>
                </div>

                {/* Country Info */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{country.name}</h3>
                  <p className="text-white/90 text-sm mb-4 leading-relaxed">{country.description}</p>
                  
                  {/* Destination Pills */}
                  <div className="flex flex-wrap gap-2">
                    {country.destinations.slice(0, 3).map((dest, idx) => (
                      <span key={idx} className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                        {dest}
                      </span>
                    ))}
                    {country.destinations.length > 3 && (
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                        +{country.destinations.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <Button 
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Explore {country.name}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-slate-800 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-8 left-8 w-24 h-24 border border-white/50 rounded-full"></div>
              <div className="absolute bottom-8 right-8 w-32 h-32 border border-white/30 rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-white/40 rounded-full"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Can't Find Your Dream Destination?
              </h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                Search from hundreds of airports worldwide and discover amazing deals on flights to any destination. 
                Our travel specialists are here to help you plan the perfect trip.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => router.push('/#search')}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-xl px-8 py-4 text-lg font-semibold"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Search All Destinations
                </Button>
                <Button 
                  onClick={() => router.push('/plan-trip')}
                  variant="outline"
                  size="lg"
                  className="border-gray-300 bg-white text-slate-800 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
                >
                  Plan Custom Trip
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 