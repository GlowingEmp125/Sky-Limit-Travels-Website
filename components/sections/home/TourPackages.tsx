'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, MapPin, ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const popularDestinations = [
  {
    id: 1,
    name: 'European Destinations',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3',
    airports: ['Paris (CDG)', 'Rome (FCO)', 'Barcelona (BCN)'],
    flightTime: '2-3 hours',
    description: 'Rich history, stunning architecture and world-class cuisine across Europe',
    highlights: ['Historical landmarks', 'Art and culture', 'Mediterranean beaches']
  },
  {
    id: 2,
    name: 'Asian Destinations',
    image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3',
    airports: ['Tokyo (HND)', 'Bangkok (BKK)', 'Singapore (SIN)'],
    flightTime: '11-14 hours',
    description: 'Explore ancient traditions alongside ultramodern cities across Asia',
    highlights: ['Ancient temples', 'Diverse cuisine', 'Bustling markets']
  },
  {
    id: 3,
    name: 'Caribbean Destinations',
    image: 'https://images.unsplash.com/photo-1544550581-1bcabf842b77?ixlib=rb-4.0.3',
    airports: ['Barbados (BGI)', 'Jamaica (MBJ)', 'Bahamas (NAS)'],
    flightTime: '8-10 hours',
    description: 'Crystal clear waters and white sand beaches in tropical paradise',
    highlights: ['Pristine beaches', 'Water sports', 'Island culture']
  },
  {
    id: 4,
    name: 'African Destinations',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3',
    airports: ['Cape Town (CPT)', 'Nairobi (NBO)', 'Marrakesh (RAK)'],
    flightTime: '6-12 hours',
    description: 'Diverse landscapes from savannahs to deserts with incredible wildlife',
    highlights: ['Safari experiences', 'Diverse cultures', 'Natural wonders']
  },
  {
    id: 5,
    name: 'Nordic Destinations',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3',
    airports: ['Oslo (OSL)', 'Stockholm (ARN)', 'Reykjavik (KEF)'],
    flightTime: '2-3 hours',
    description: 'Experience the Northern Lights, fjords and Scandinavian design',
    highlights: ['Aurora viewing', 'Natural landscapes', 'Design and architecture']
  },
  {
    id: 6,
    name: 'South American Destinations',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3',
    airports: ['Rio de Janeiro (GIG)', 'Buenos Aires (EZE)', 'Lima (LIM)'],
    flightTime: '11-14 hours',
    description: 'Vibrant cultures, ancient civilizations and incredible natural beauty',
    highlights: ['Ancient ruins', 'Rainforests', 'Vibrant culture']
  }
];

export default function PopularDestinations() {
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
    <section className="py-12 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Popular Destinations
          </h2>
          <div className="w-24 h-1 bg-blue-800 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover flight options to these popular destinations around the world
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
            {popularDestinations.map((destination) => (
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
                        className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-blue-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-white">
                        <span className="font-semibold flex items-center">
                          <Plane className="w-4 h-4 mr-2" />
                          {destination.flightTime}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-3 text-gray-800">{destination.name}</h3>
                      <p className="text-gray-600 mb-4">{destination.description}</p>
                      
                      <div className="mb-4">
                        <div className="flex items-start gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 mt-1 text-blue-600 flex-shrink-0" />
                          <span>Key airports: {destination.airports.join(', ')}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        {destination.highlights.map((highlight, i) => (
                          <div key={i} className="flex items-center gap-2 text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-blue-800 hover:bg-blue-900 text-white transition-all duration-300"
                          onClick={() => {
                            // Extract region from the destination name
                            const regionParts = destination.name.split(' ');
                            const region = regionParts[0].toLowerCase();
                            
                            router.push(`/flights?region=${region}`);
                          }}
                        >
                          <Plane className="w-4 h-4 mr-2" />
                          Find Flights
                        </Button>
                        
                        <Button 
                          variant="outline"
                          className="flex-1 border-blue-200 text-blue-800 hover:bg-blue-50 transition-all duration-300"
                          onClick={() => {
                            // Extract region from the destination name
                            const regionParts = destination.name.split(' ');
                            const region = regionParts[0].toLowerCase();
                            
                            router.push(`/destinations/${region}`);
                          }}
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Learn More
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