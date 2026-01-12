'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Clock, Info, MapPin, Calendar, ArrowRight, Sun, Sparkles, Check } from 'lucide-react';
import { FlightOffer } from '@/lib/amadeus';
import FlightSearchForm from '@/components/FlightSearchForm';
import { formatAirportDisplay, formatRouteDisplay, getAirportByCode } from '@/data/airports';

// Popular destinations in Portugal
const popularDestinations = [
  {
    id: 'lisbon',
    name: 'Lisbon',
    code: 'LIS',
    image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?ixlib=rb-4.0.3&q=80&w=800',
    description: 'Portugal\'s capital with historic charm, colorful buildings, and vibrant cultural scene.',
    flightTime: '~2h 40m'
  },
  {
    id: 'porto',
    name: 'Porto',
    code: 'OPO',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&q=80&w=800',
    description: 'Famous for port wine, stunning riverside views, and beautiful architecture.',
    flightTime: '~2h 25m'
  },
  {
    id: 'faro',
    name: 'Faro',
    code: 'FAO',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&q=80&w=800',
    description: 'Gateway to the Algarve region with beautiful beaches and historic old town.',
    flightTime: '~2h 50m'
  },
  {
    id: 'madeira',
    name: 'Madeira',
    code: 'FNC',
    image: 'https://images.unsplash.com/photo-1590077428593-a33c3fb61d43?ixlib=rb-4.0.3&q=80&w=800',
    description: 'Known for its lush landscapes, stunning hikes, and unique fortified wine.',
    flightTime: '~4h'
  },
];

// Information about Portugal
const countryInfo = {
  name: 'Portugal',
  flag: '🇵🇹',
  capital: 'Lisbon',
  language: 'Portuguese',
  currency: 'Euro (€)',
  timezone: 'GMT (GMT+1 in summer)',
  bestTimeToVisit: 'March to May or September to October',
  visaInfo: 'UK citizens can travel without a visa for up to 90 days in any 180-day period.',
  travelTips: [
    'Public transport is efficient and affordable in major cities',
    'Try the famous pastel de nata (custard tarts)',
    'Many shops close for siesta in smaller towns',
    'Portuguese people appreciate it when visitors try to speak a few words in Portuguese'
  ]
};

export default function PortugalPage() {
  const router = useRouter();
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/country-flights?code=PT');
        
        if (!response.ok) {
          throw new Error('Failed to fetch flights to Portugal');
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
      'TP': 'TAP Air Portugal',
      'FR': 'Ryanair',
      'U2': 'easyJet',
      'LH': 'Lufthansa',
      'AF': 'Air France',
      'EY': 'Etihad Airways',
      'QR': 'Qatar Airways',
      'EK': 'Emirates',
      'AA': 'American Airlines',
      'DL': 'Delta Air Lines',
      'UA': 'United Airlines',
    };
    return airlines[code] || code;
  };

  // Function to get airport name from code
  const getAirportName = (code: string): string => {
    const airports: Record<string, string> = {
      'LHR': 'London Heathrow',
      'LGW': 'London Gatwick',
      'STN': 'London Stansted',
      'LIS': 'Lisbon',
      'OPO': 'Porto',
      'FAO': 'Faro',
      'FNC': 'Funchal (Madeira)',
      'PDL': 'Ponta Delgada (Azores)',
    };
    return airports[code] || code;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image 
              src="https://images.unsplash.com/photo-1585208798174-6cedd86e019a?ixlib=rb-4.0.3&q=80&w=800"
              alt="Beautiful view of Lisbon, Portugal with colorful buildings and historic trams"
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
                Flights to Portugal
              </h1>
              <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
                Discover historic cities, beautiful beaches and rich culture with direct flights from the UK
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
            Flights to Portugal
          </h2>
          <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
            Direct flights from the UK to popular Portuguese destinations
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
              
              {flights.length === 0 && !loading && !error && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No flights available for this route at the moment. Please try different dates or check back later.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Popular Destinations in Portugal */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            Popular Destinations in Portugal
          </h2>
          <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Discover the best places to visit in Portugal
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {popularDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="relative h-48">
                  <Image 
                    src={destination.image}
                    alt={`${destination.name}, Portugal`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                    <div className="flex items-center text-white/90 text-sm mt-1">
                      <Plane className="w-3 h-3 mr-1 rotate-45" />
                      <span>{destination.flightTime}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-gray-600 mb-4 text-sm">
                    {destination.description}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full text-blue-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                    onClick={() => {
                      const queryParams = new URLSearchParams({
                        destinationCity: destination.name,
                        destination: destination.code
                      });
                      router.push(`/contact?${queryParams.toString()}`);
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

      {/* Country Information */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-10 items-start max-w-6xl mx-auto">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                About Portugal
              </h2>
              <p className="text-gray-600 mb-6">
                Portugal is a captivating coastal nation that combines stunning beaches with historic cities. From the colorful streets of Lisbon to the vineyard-covered valleys of the Douro, Portugal offers a perfect blend of relaxation and exploration. With its rich maritime history, world-class cuisine, and warm, welcoming culture, Portugal delivers an authentic European experience with a character all its own.
              </p>
              <p className="text-gray-600 mb-6">
                The country's long Atlantic coastline provides endless opportunities for beach lovers, while its historic cities feature well-preserved medieval quarters alongside modern cultural attractions. Whether you're exploring Porto's riverside charm, relaxing on the golden beaches of the Algarve, or wandering through the fairytale palaces of Sintra, Portugal rewards visitors with unforgettable experiences.
              </p>
            </div>
            
            <div className="lg:w-96 bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Travel Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Capital</h4>
                  <p className="text-gray-600">{countryInfo.capital}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Language</h4>
                  <p className="text-gray-600">{countryInfo.language}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Currency</h4>
                  <p className="text-gray-600">{countryInfo.currency}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Time Zone</h4>
                  <p className="text-gray-600">{countryInfo.timezone}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Best Time to Visit</h4>
                  <p className="text-gray-600">{countryInfo.bestTimeToVisit}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Visa Requirements</h4>
                  <p className="text-gray-600">{countryInfo.visaInfo}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Travel Tips</h4>
                  <ul className="text-gray-600 space-y-2 mt-2">
                    {countryInfo.travelTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-4 h-4 text-blue-600 mr-2 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Visit Portugal */}
      <section className="py-12 md:py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            Why Visit Portugal?
          </h2>
          <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Discover what makes Portugal a must-visit destination
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white border-none">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Sun className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Beautiful Weather</h3>
                <p className="text-gray-600">
                  With over 300 days of sunshine per year, Portugal boasts one of Europe's most pleasant climates, perfect for year-round exploration of its diverse landscapes.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-none">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Rich History</h3>
                <p className="text-gray-600">
                  From ancient Roman ruins to Moorish castles and ornate Gothic monasteries, Portugal's fascinating past is visible at every turn.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-none">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Incredible Food</h3>
                <p className="text-gray-600">
                  Portuguese cuisine is a delightful revelation, from fresh seafood and world-famous pastries to the distinctive wines of the Douro Valley.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
} 