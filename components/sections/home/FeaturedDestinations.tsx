'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plane, Globe, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const destinations = [
  {
    id: 1,
    name: 'Santorini, Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3',
    rating: 4.8,
    description: 'White-washed villages clinging to cliffs overlooking the Aegean Sea',
    bestSeason: 'April to October',
    flightTime: '3-4 hours',
    nearestAirport: 'Santorini International Airport (JTR)'
  },
  {
    id: 2,
    name: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3',
    rating: 4.7,
    description: 'Tropical beaches, lush rice terraces and vibrant cultural experiences',
    bestSeason: 'May to September',
    flightTime: '16-18 hours',
    nearestAirport: 'Ngurah Rai International Airport (DPS)'
  },
  {
    id: 3,
    name: 'Maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3',
    rating: 4.9,
    description: 'Crystal clear waters, private island resorts and spectacular marine life',
    bestSeason: 'November to April',
    flightTime: '10-12 hours',
    nearestAirport: 'Velana International Airport (MLE)'
  },
  {
    id: 4,
    name: 'Swiss Alps',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3',
    rating: 4.8,
    description: 'Spectacular mountain landscapes with pristine lakes and charming villages',
    bestSeason: 'December to March (skiing), June to September (hiking)',
    flightTime: '1.5-2 hours',
    nearestAirport: 'Zurich Airport (ZRH), Geneva Airport (GVA)'
  }
];

export default function FeaturedDestinations() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 400;
    const newScrollPosition = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    scrollRef.current.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-8 md:py-16 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Featured Destinations
          </h2>
          <div className="w-24 h-1 bg-blue-800 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover essential travel information about these incredible destinations you can fly to
          </p>
        </div>
        
        <div className="relative">
          {/* Left Arrow */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white/80 hover:bg-white text-blue-700 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white/80 hover:bg-white text-blue-700 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory scrollbar-hide scroll-smooth"
          >
            {destinations.map((destination) => (
              <div
                key={destination.id}
                className="min-w-[350px] snap-center"
              >
                <Card className="group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-1 shadow-lg">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold">{destination.rating}</span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-3 text-gray-800">{destination.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Plane className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span>Flight time: {destination.flightTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Globe className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span>Airport: {destination.nearestAirport}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Sun className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span>Best season: {destination.bestSeason}</span>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <Button 
                          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition-all duration-300 w-full flex items-center justify-center"
                          onClick={() => {
                            const destination_query = destination.name.split(',')[0].toLowerCase();
                            router.push(`/flights?destination=${destination_query}`);
                          }}
                        >
                          <Plane className="mr-2 h-4 w-4" />
                          Find Flights
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}