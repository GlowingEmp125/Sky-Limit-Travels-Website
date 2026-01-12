import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Clock, ArrowRight, MapPin, Filter, Calendar, CheckCircle, Shield, Compass } from 'lucide-react';
import FlightSearchForm from '@/components/FlightSearchForm';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Flights | Sky Limit Travels',
  description: 'Search and book flights to worldwide destinations. Sky Limit Travels offers great deals on flights with top airlines.',
};

// Featured flight destinations
const featuredDestinations = [
  {
    id: 'new-york',
    name: 'New York',
    country: 'USA',
    code: 'JFK',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3',
    price: '750',
    description: 'Experience the energy of the city that never sleeps, from Central Park to Times Square.',
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    code: 'CDG',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3',
    price: '350',
    description: 'Discover the romance, culture and iconic landmarks of the City of Light.',
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italy',
    code: 'FCO',
    image: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?ixlib=rb-4.0.3',
    price: '520',
    description: 'Explore ancient history, remarkable architecture and world-class cuisine in the Eternal City.',
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    code: 'HND',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3',
    price: '1,200',
    description: 'Experience the perfect blend of ultramodern and traditional in Japan\'s bustling capital.',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    code: 'DXB',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3',
    price: '650',
    description: 'Discover a city of superlatives, featuring stunning architecture, shopping and desert landscapes.',
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    code: 'SYD',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3',
    price: '1,500',
    description: 'Visit Australia\'s harbour city with iconic landmarks, beautiful beaches and vibrant culture.',
  },
];

// Seasonal flight deals
const seasonalDeals = [
  {
    id: 'summer-europe',
    title: 'Summer in Europe',
    description: 'Book now for the perfect summer getaway to European destinations',
    destinations: ['Paris', 'Rome', 'Barcelona', 'Athens'],
    validUntil: '31 May 2025',
    discount: '15%',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3',
  },
  {
    id: 'autumn-city-breaks',
    title: 'Autumn City Breaks',
    description: 'Explore vibrant cities during the beautiful autumn season',
    destinations: ['New York', 'Boston', 'Toronto', 'Chicago'],
    validUntil: '31 August 2025',
    discount: '12%',
    image: 'https://images.unsplash.com/photo-1541880252184-8ffbb18fc1b8?ixlib=rb-4.0.3',
  },
];

export default function FlightsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/assets/images/flight-hero.jpg" 
            alt="Airplane flying over a beautiful destination"
            priority
            fill
            className="object-cover"
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-blue-950/80" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-8 md:mb-10">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Find Your Perfect Flight
              </h1>
              <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto">
                Search and compare flights to hundreds of destinations worldwide. Book with confidence with Sky Limit Travels.
              </p>
            </div>

            {/* Featured Flight Search Form */}
            <FlightSearchForm variant="featured" />
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            Popular Flight Destinations
          </h2>
          <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
            Discover our most sought-after flight routes with excellent prices and flexible booking options
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                <div className="relative h-60 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={`${destination.name}, ${destination.country}`} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-xl font-bold text-white">{destination.name}, {destination.country}</h3>
                        <div className="flex items-center text-white/80 text-sm">
                          <Plane className="w-3.5 h-3.5 mr-1" />
                          <span>LHR → {destination.code}</span>
                        </div>
                      </div>
                      <div className="flex items-center bg-blue-600 px-3 py-1 rounded-full text-white text-sm font-semibold">
                        From £{destination.price}
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-6">
                    {destination.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                      <span>Multiple dates available</span>
                    </div>
                    <Button 
                      asChild
                      variant="outline" 
                      className="text-blue-600 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                    >
                      <Link href={destination.id === 'new-york' ? '/destinations/americas/new-york' : `/flights/countries/${destination.id}`}>
                        View Flights
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Book with Us */}
      <section className="py-12 md:py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            Why Book Flights With Us
          </h2>
          <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Sky Limit Travels provides a seamless booking experience with added benefits
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flight Booking FAQs */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            Get answers to common questions about booking flights
          </p>

          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            {faqs.map((faq) => (
              <div key={faq.id} className="py-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                </div>
                <div className="mt-2">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// Data
const benefits = [
  {
    id: 1,
    title: 'Flexible Bookings',
    description: 'Change your flight dates with minimal or no fees on selected fares.',
    icon: Clock,
  },
  {
    id: 2,
    title: 'Best Price Guarantee',
    description: 'We match or beat any comparable flight price you find.',
    icon: CheckCircle,
  },
  {
    id: 3,
    title: 'Secure Payments',
    description: 'Your payment details are protected with advanced encryption.',
    icon: Shield,
  },
  {
    id: 4,
    title: 'Global Destinations',
    description: 'Flights to over 900 destinations across more than 170 countries.',
    icon: Compass,
  },
];

const faqs = [
  {
    id: 1,
    question: 'How far in advance should I book my flight?',
    answer: 'For domestic flights, booking 1-3 months ahead typically offers the best prices. For international flights, 2-6 months in advance is recommended, with holiday periods requiring even earlier booking.',
  },
  {
    id: 2,
    question: 'Can I cancel or change my flight booking?',
    answer: 'Yes, many bookings can be changed or cancelled. Change and cancellation policies vary by airline and fare type. We always recommend booking flexible fares if your travel plans might change.',
  },
  {
    id: 3,
    question: 'Do I need travel insurance for my flight?',
    answer: 'While not mandatory, travel insurance is highly recommended to protect against unexpected cancellations, delays, lost luggage, and medical emergencies while abroad.',
  },
  {
    id: 4,
    question: 'What is the baggage allowance for my flight?',
    answer: 'Baggage allowances vary by airline, route, and fare class. Typically, economy fares include one carry-on bag and one personal item, with checked baggage available for an additional fee or included in premium fares.',
  },
  {
    id: 5,
    question: 'How can I select my seats?',
    answer: 'Seat selection can be made during the booking process or after booking through your booking confirmation. Some airlines charge for seat selection while others include it with your ticket.',
  },
]; 