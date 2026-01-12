"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, Users, MapPin, Star, Heart, Share2, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Activity {
  day: number;
  title: string;
  activities: string[];
}

interface Holiday {
  id: string;
  name: string;
  tagline: string;
  price: number;
  duration: string;
  groupSize: string;
  rating: number;
  reviewCount: number;
  location: string;
  mainImage: string;
  gallery: string[];
  highlights: string[];
  description: string;
  itinerary: Activity[];
}

interface HolidaysData {
  [key: string]: Holiday;
}

// Mock data - will be replaced with API data
const holidaysData: HolidaysData = {
  '1': {
    id: '1',
    name: 'Santorini Paradise Escape',
    tagline: 'Experience the Magic of the Mediterranean',
    price: 1299,
    duration: '7 Days',
    groupSize: '8-12',
    rating: 4.8,
    reviewCount: 124,
    location: 'Santorini, Greece',
    mainImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3',
    gallery: [
      'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a',
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e',
      'https://images.unsplash.com/photo-1601581875397-0f9d8c8f1f93',
    ],
    highlights: [
      'Sunset viewing at Oia',
      'Wine tasting in traditional vineyards',
      'Private catamaran cruise',
      'Greek cooking class',
      'Ancient Akrotiri visit'
    ],
    description: 'Immerse yourself in the breathtaking beauty of Santorini with our carefully curated 7-day escape. From the iconic white-washed buildings to the crystal-clear waters of the Aegean Sea, every moment is designed to create unforgettable memories.',
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Welcome',
        activities: ['Airport transfer', 'Hotel check-in', 'Welcome dinner at traditional taverna']
      },
      {
        day: 2,
        title: 'Oia & Sunset Experience',
        activities: ['Guided walking tour', 'Photography spots', 'Famous sunset viewing']
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Bali Paradise Retreat',
    tagline: 'Discover the Island of Gods',
    price: 899,
    duration: '10 Days',
    groupSize: '6-10',
    rating: 4.7,
    reviewCount: 98,
    location: 'Bali, Indonesia',
    mainImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3',
    gallery: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62',
      'https://images.unsplash.com/photo-1537996195538-d56c79ecc03c',
    ],
    highlights: [
      'Ubud rice terraces',
      'Temple ceremonies',
      'Yoga retreat',
      'Cooking class',
      'Sunset beach dinner'
    ],
    description: 'Experience the magic of Bali with our 10-day retreat. From ancient temples to lush rice terraces, immerse yourself in the rich culture and natural beauty of the Island of Gods.',
    itinerary: [
      {
        day: 1,
        title: 'Welcome to Paradise',
        activities: ['Airport pickup', 'Resort check-in', 'Welcome ceremony']
      },
      {
        day: 2,
        title: 'Cultural Immersion',
        activities: ['Morning yoga', 'Temple visit', 'Traditional dance show']
      }
    ]
  },
  '3': {
    id: '3',
    name: 'Maldives Luxury Getaway',
    tagline: 'Paradise Found in the Indian Ocean',
    price: 1599,
    duration: '8 Days',
    groupSize: '2-4',
    rating: 4.9,
    reviewCount: 156,
    location: 'Maldives',
    mainImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3',
    gallery: [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8',
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd',
      'https://images.unsplash.com/photo-1578922746465-3a80a228f223'
    ],
    highlights: [
      'Overwater villa experience',
      'Sunset dolphin cruise',
      'Snorkeling with manta rays',
      'Underwater restaurant dining',
      'Private beach picnic'
    ],
    description: 'Escape to the pristine paradise of the Maldives, where crystal-clear waters meet powder-soft beaches. Experience luxury overwater living and world-class marine life in this tropical haven.',
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Paradise',
        activities: ['Seaplane transfer', 'Villa check-in', 'Welcome cocktail reception']
      },
      {
        day: 2,
        title: 'Ocean Adventure',
        activities: ['Snorkeling session', 'Marine biology talk', 'Sunset fishing']
      }
    ]
  },
  '4': {
    id: '4',
    name: 'Swiss Alps Adventure',
    tagline: 'Experience Alpine Majesty',
    price: 2199,
    duration: '6 Days',
    groupSize: '4-8',
    rating: 4.8,
    reviewCount: 142,
    location: 'Swiss Alps',
    mainImage: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3',
    gallery: [
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      'https://images.unsplash.com/photo-1580137189272-c9379f8864fd'
    ],
    highlights: [
      'Scenic train journeys',
      'Mountain hiking trails',
      'Swiss chocolate tasting',
      'Cable car experiences',
      'Alpine village tours'
    ],
    description: 'Immerse yourself in the breathtaking beauty of the Swiss Alps. From snow-capped peaks to charming mountain villages, experience the perfect blend of adventure and luxury in the heart of Europe.',
    itinerary: [
      {
        day: 1,
        title: 'Mountain Welcome',
        activities: ['Train transfer', 'Hotel check-in', 'Welcome fondue dinner']
      },
      {
        day: 2,
        title: 'Alpine Adventure',
        activities: ['Guided hiking tour', 'Cable car ride', 'Swiss cuisine workshop']
      }
    ]
  }
};

export default function HolidayDetails({ id }: { id: string }) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullItinerary, setShowFullItinerary] = useState(false);

  const holidayData = holidaysData[id] || holidaysData['1']; // Fallback to first holiday if ID not found

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img
            src={holidayData.mainImage}
            alt={holidayData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        </motion.div>
        
        <div className="absolute inset-0 flex items-center justify-center text-white text-center">
          <div className="max-w-4xl px-4">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-5xl md:text-6xl font-bold mb-4"
            >
              {holidayData.name}
            </motion.h1>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xl md:text-2xl"
            >
              {holidayData.tagline}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{holidayData.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Group Size</p>
                <p className="font-semibold">{holidayData.groupSize}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">{holidayData.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="font-semibold">{holidayData.rating} ({holidayData.reviewCount} reviews)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-3xl font-bold mb-4">Overview</h2>
              <p className="text-gray-600 leading-relaxed">{holidayData.description}</p>
            </section>

            {/* Highlights */}
            <section>
              <h2 className="text-3xl font-bold mb-4">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {holidayData.highlights.map((highlight: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{index + 1}</span>
                    </div>
                    <p className="text-gray-700">{highlight}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Itinerary */}
            <section>
              <h2 className="text-3xl font-bold mb-4">Itinerary</h2>
              <div className="space-y-4">
                {holidayData.itinerary.map((day: Activity, index: number) => (
                  <Card key={index} className="p-6">
                    <h3 className="text-xl font-bold mb-2">Day {day.day}: {day.title}</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      {day.activities.map((activity: string, actIndex: number) => (
                        <li key={actIndex}>{activity}</li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
              <Button
                variant="ghost"
                className="mt-4 w-full"
                onClick={() => setShowFullItinerary(!showFullItinerary)}
              >
                {showFullItinerary ? 'Show Less' : 'View Full Itinerary'}
                <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="md:col-span-1">
            <Card className="p-6 sticky top-4">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Starting from</p>
                    <p className="text-3xl font-bold text-blue-600">£{holidayData.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Date</label>
                    <Button variant="outline" className="w-full mt-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Select Date
                    </Button>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Travelers</label>
                    <Button variant="outline" className="w-full mt-1">
                      <Users className="w-4 h-4 mr-2" />
                      2 Adults
                    </Button>
                  </div>
                </div>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                  onClick={() => {
                    const queryParams = new URLSearchParams({
                      holidayId: id,
                      destination: holidayData.location,
                      title: holidayData.name,
                      price: holidayData.price.toString(),
                      duration: holidayData.duration,
                      departureDate: '', // Can be selected by user before enquiry
                      travelers: '2' // Default or can be selected
                    });
                    
                    router.push(`/enquire?${queryParams.toString()}`);
                  }}
                >
                  Enquire Now
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  Free cancellation up to 30 days before departure
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 