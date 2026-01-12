import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'About Us | Sky Limit Travels',
  description: 'Learn more about Sky Limit Travels, our mission, values, and commitment to creating exceptional travel experiences.',
};

// Company values
const values = [
  {
    title: 'Personalised Service',
    description: 'We take the time to understand your unique travel preferences, interests, and budget to create journeys that are perfectly tailored to you.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  {
    title: 'Quality & Value',
    description: 'We work directly with trusted partners to ensure you receive exceptional value for money whilst maintaining the highest standards of service.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: 'Local Knowledge',
    description: 'Our extensive network of local contacts and destination knowledge helps us create authentic experiences that showcase the best of each location.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )
  },
  {
    title: '24/7 Support',
    description: 'From initial enquiry through to your return home, our dedicated team is here to assist you every step of the way.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a1.25 1.25 0 011.25 1.25v17a1.25 1.25 0 01-2.5 0v-17A1.25 1.25 0 0112 2.25z" />
      </svg>
    )
  }
];

// What we specialise in
const specialties = [
  {
    title: 'Flight Bookings',
    description: 'Competitive airfares to destinations worldwide with flexible booking options.',
    icon: '✈️'
  },
  {
    title: 'Holiday Packages',
    description: 'Carefully curated holiday experiences combining flights, accommodation, and activities.',
    icon: '🏖️'
  },
  {
    title: 'Group Travel',
    description: 'Tailored solutions for family groups, friends, and corporate travel requirements.',
    icon: '👥'
  },
  {
    title: 'Travel Planning',
    description: 'Comprehensive trip planning services to help you make the most of your journey.',
    icon: '📋'
  }
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-blue-950/80 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Beautiful travel destination" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">About Sky Limit Travels</h1>
            <p className="text-xl text-white/90 mb-8">
              Your trusted partner for exceptional travel experiences, dedicated to turning your travel dreams into reality.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Who We Are</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Travel planning" 
                  className="rounded-lg shadow-xl w-full h-auto object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">Your Travel Partner</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Sky Limit Travels is a dedicated travel agency committed to providing personalised travel solutions. 
                  We understand that every traveller is unique, with different interests, budgets, and expectations.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our approach is simple: listen to what you want, understand your needs, and create travel experiences 
                  that exceed your expectations. Whether you're planning a family holiday, romantic getaway, or 
                  adventure trip, we're here to make it happen.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Based in Sheffield, we serve customers across the UK and beyond, offering comprehensive travel 
                  services with a personal touch that sets us apart from the crowd.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 px-4 bg-blue-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">What We Do</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              We specialise in creating travel experiences that suit your individual needs and preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specialties.map((specialty, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{specialty.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{specialty.title}</h3>
                  <p className="text-gray-600">{specialty.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Commitment</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600">
              These principles guide everything we do, ensuring you receive the best possible service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{value.title}</h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Get In Touch</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
              <p className="text-lg text-gray-600">
                Ready to start planning your next adventure? We'd love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Phone</h3>
                  <p className="text-gray-600">03330384142</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Email</h3>
                  <p className="text-gray-600 text-sm">flightbookings@skylimittravels.co.uk</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">Location</h3>
                  <p className="text-gray-600 text-sm">61A Blagden St, Sheffield S2 5QS</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Start Planning Your Journey</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
            Ready to explore the world? Get in touch with us today to start planning your perfect trip.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full text-lg">
                Contact Us Today
              </Button>
            </Link>
            <Link href="/plan-trip">
              <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-full text-lg">
                Plan Your Trip
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 