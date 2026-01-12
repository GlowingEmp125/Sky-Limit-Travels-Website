'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Clock, Info, MapPin, Calendar, ArrowRight, Sun, Sparkles, Check, Utensils, Landmark, Wine } from 'lucide-react';
import { FlightOffer } from '@/lib/amadeus';
import FlightSearchForm from '@/components/FlightSearchForm';
import { useRouter } from 'next/navigation';
import { formatAirportDisplay, formatRouteDisplay, getAirportByCode } from '@/data/airports';

// Popular destinations in France
const popularDestinations = [
  {
    id: 'paris',
    name: 'Paris',
    code: 'CDG',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&q=80&w=800',
    description: 'The City of Light, home to the Eiffel Tower, Louvre Museum and romantic atmosphere.',
    flightTime: '~1h 20m'
  },
  {
    id: 'nice',
    name: 'Nice',
    code: 'NCE',
    image: '/images/nice-france.jpg',
    description: 'Beautiful Mediterranean city with stunning beaches and vibrant old town.',
    flightTime: '~2h'
  },
  {
    id: 'toulouse',
    name: 'Toulouse',
    code: 'TLS',
    image: '/images/toulouse.jpg',
    description: 'The "Pink City" with beautiful architecture, vibrant culture and aerospace history.',
    flightTime: '~1h 50m'
  },
  {
    id: 'lyon',
    name: 'Lyon',
    code: 'LYS',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&q=80&w=800',
    description: 'Gastronomic capital of France with rich history and beautiful architecture.',
    flightTime: '~1h 40m'
  },
];

// Information about France
const countryInfo = {
  name: 'France',
  flag: '🇫🇷',
  capital: 'Paris',
  language: 'French',
  currency: 'Euro (€)',
  timezone: 'GMT+1 (GMT+2 in summer)',
  bestTimeToVisit: 'April to October',
  visaInfo: 'UK citizens can travel without a visa for up to 90 days in any 180-day period.',
  travelTips: [
    'Many shops and restaurants close on Sundays',
    'Tipping is not mandatory but appreciated (service is included in bills)',
    'Basic French phrases are appreciated by locals',
    'Paris Metro is an efficient way to navigate the capital',
    'August is when many locals take holidays, so some businesses may be closed'
  ]
};

export default function FrancePage() {
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/country-flights?code=FR');
        
        if (!response.ok) {
          throw new Error('Failed to fetch flights to France');
        }
        
        const data = await response.json();
        setFlights(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching flights:', err);
        setError('Unable to load flights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  // Function to format flight dates and times
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      fullDate: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    };
  };

  // Function to get airline name from code
  const getAirlineName = (code: string): string => {
    const airlines: Record<string, string> = {
      'BA': 'British Airways',
      'AF': 'Air France',
      'U2': 'easyJet',
      'FR': 'Ryanair',
      'VY': 'Vueling',
      'IB': 'Iberia',
    };
    return airlines[code] || code;
  };

  // Function to get airport name from code
  const getAirportName = (code: string): string => {
    const airports: Record<string, string> = {
      'LHR': 'London Heathrow',
      'LGW': 'London Gatwick',
      'STN': 'London Stansted',
      'CDG': 'Paris Charles de Gaulle',
      'ORY': 'Paris Orly',
      'NCE': 'Nice Côte d\'Azur',
      'LYS': 'Lyon Saint-Exupéry',
      'MRS': 'Marseille Provence',
      'TLS': 'Toulouse-Blagnac',
    };
    return airports[code] || code;
  };

  // Function to display airport codes with city names for clarity
  const formatAirportCode = (code: string, cityName: string): React.ReactNode => {
    return (
      <span className="flex flex-col">
        <span className="font-medium">{cityName}</span>
        <span className="text-xs text-gray-500">({code})</span>
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image 
              src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&q=80&w=800"
              alt="Eiffel Tower and Paris cityscape"
              priority
              fill
              sizes="100vw"
              className="object-cover"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-blue-950/80" />
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-8 md:mb-10">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-3">
                <span className="text-2xl">{countryInfo.flag}</span>
                <h2 className="text-white font-medium">{countryInfo.name}</h2>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Flights to France
              </h1>
              <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
                Experience the romance, cuisine and charm of France with direct flights from the UK
              </p>
            </div>

            {/* Flight Search Form with Prefilled Country */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
              <FlightSearchForm variant="default" />
            </div>
          </div>
        </div>
      </section>

      {/* Available Flights - Moved up */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            Flights to France
          </h2>
          <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
            Direct flights from the UK to popular French destinations
          </p>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block p-4 rounded-full bg-blue-50">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="mt-4 text-gray-600">Loading available flights...</p>
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto text-center py-12 px-4">
              <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                <h3 className="text-lg font-semibold text-red-700 mb-2">Unable to Load Flights</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white">
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {flights.map((flight) => {
                const outbound = flight.itineraries[0]?.segments[0];
                
                if (!outbound) {
                  return null;
                }
                
                const returnFlight = flight.itineraries[1]?.segments[0];
                const outboundDateTime = formatDateTime(outbound.departure.at);
                const arrivalDateTime = formatDateTime(outbound.arrival.at);
                
                return (
                  <Card key={flight.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {formatRouteDisplay(outbound.departure.iataCode, outbound.arrival.iataCode)}
                          </h3>
                          <p className="text-gray-600">
                            {getAirlineName(outbound.carrierCode)} • Round Trip
                          </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <span className="text-3xl font-bold text-blue-600">
                            {new Intl.NumberFormat('en-GB', {
                              style: 'currency',
                              currency: 'GBP'
                            }).format(parseFloat(flight.price.total))}
                          </span>
                          <span className="text-gray-500 text-sm ml-1">per person</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 p-1.5 rounded-full bg-blue-50 mr-3">
                            <Plane className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Departure</div>
                            <div className="font-medium">{outboundDateTime.date} • {outboundDateTime.time}</div>
                            <div className="text-sm">{formatAirportDisplay(outbound.departure.iataCode)}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="flex-shrink-0 p-1.5 rounded-full bg-blue-50 mr-3">
                            <MapPin className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Arrival</div>
                            <div className="font-medium">{arrivalDateTime.date} • {arrivalDateTime.time}</div>
                            <div className="text-sm">{formatAirportDisplay(outbound.arrival.iataCode)}</div>
                          </div>
                        </div>
                        
                        {returnFlight && (
                          <div className="flex items-start">
                            <div className="flex-shrink-0 p-1.5 rounded-full bg-blue-50 mr-3">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Return</div>
                              <div className="font-medium">
                                {formatDateTime(returnFlight.departure.at).date}
                              </div>
                              <div className="text-sm">
                                {formatAirportDisplay(returnFlight.departure.iataCode)} to {formatAirportDisplay(returnFlight.arrival.iataCode)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Add Enquire Now button */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => {
                            const queryParams = new URLSearchParams({
                              origin: outbound.departure.iataCode,
                              destination: outbound.arrival.iataCode,
                              departureDate: outboundDateTime.fullDate,
                              returnDate: returnFlight ? formatDateTime(returnFlight.departure.at).fullDate : ''
                            });
                            router.push(`/contact?${queryParams.toString()}`);
                          }}
                        >
                          Enquire Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Country Information */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                About France
              </h2>
              <p className="text-gray-600 mb-6">
                France, one of Europe's most beloved destinations, offers an irresistible blend of magnificent architecture, world-class art, exquisite cuisine, and stunning landscapes. From the romantic streets of Paris to the sun-drenched beaches of the French Riviera, and from the picturesque villages of Provence to the magnificent châteaux of the Loire Valley, France captivates visitors with its beauty and charm.
              </p>
              <p className="text-gray-600 mb-6">
                With its rich history, cultural heritage, and gastronomic excellence, France invites travellers to experience the French way of life—enjoying long meals with friends, appreciating fine wines, exploring bustling markets, and savoring every moment with a certain je ne sais quoi.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <span className="block font-medium text-gray-900">Capital</span>
                    <span className="text-gray-600">{countryInfo.capital}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <span className="block font-medium text-gray-900">Language</span>
                    <span className="text-gray-600">{countryInfo.language}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <span className="block font-medium text-gray-900">Currency</span>
                    <span className="text-gray-600">{countryInfo.currency}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <span className="block font-medium text-gray-900">Time Zone</span>
                    <span className="text-gray-600">{countryInfo.timezone}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Sun className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <span className="block font-medium text-gray-900">Best Time to Visit</span>
                    <span className="text-gray-600">{countryInfo.bestTimeToVisit}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <span className="block font-medium text-gray-900">Visa Requirements</span>
                    <span className="text-gray-600">No visa required for UK citizens (up to 90 days)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-2/5">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Travel Tips for France
                </h3>
                <ul className="space-y-3">
                  {countryInfo.travelTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            Popular Destinations in France
          </h2>
          <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
            Explore these amazing French destinations with direct flights from the UK
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                        <div className="flex items-center text-white/80 text-sm">
                          <Plane className="w-3.5 h-3.5 mr-1" />
                          <span>{destination.flightTime} from London</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-gray-600 mb-4 text-sm">
                    {destination.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full text-blue-600 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                    onClick={() => {
                      const queryParams = new URLSearchParams({
                        destinationCity: destination.name,
                        destination: destination.code
                      });
                      router.push(`/enquire?${queryParams.toString()}`);
                    }}
                  >
                    Enquire Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Visit France */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Why Visit France?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Utensils className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Culinary Excellence</h3>
              <p className="text-blue-100">Experience world-renowned cuisine from fine dining restaurants to charming bistros and bustling food markets.</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Landmark className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Rich History & Culture</h3>
              <p className="text-blue-100">Discover magnificent châteaux, Gothic cathedrals, prehistoric caves and world-class museums and galleries.</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Wine className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Beautiful Landscapes</h3>
              <p className="text-blue-100">Explore diverse regions from the lavender fields of Provence to the Alps mountains and the stunning French Riviera.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 