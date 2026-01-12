export interface Activity {
  day: number;
  title: string;
  activities: string[];
}

export interface Holiday {
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

export interface HolidaysData {
  [key: string]: Holiday;
}

// Mock data - will be replaced with API data
export const holidaysData: HolidaysData = {
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