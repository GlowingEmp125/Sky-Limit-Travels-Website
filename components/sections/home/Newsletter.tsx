"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Plane, Gift, Tag } from 'lucide-react';
import Image from 'next/image';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribed:', email);
    setEmail('');
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-24 px-4 overflow-hidden">
      {/* Background Image - Optimized */}
      <div className="absolute inset-0">
        <Image
          src="/newsletter.jpg"
          alt="Newsletter background"
          fill
          priority={false}
          sizes="100vw"
          className="object-cover opacity-20"
          quality={60}
        />
      </div>
      
      <div className="max-w-6xl mx-auto relative">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="text-left space-y-8">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-sm font-medium tracking-wide mb-2">
              TRAVEL INSIGHTS
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Stay Updated with <span className="text-sky-300">Travel Inspiration</span>
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl">
                  <Tag className="w-5 h-5 text-sky-300" />
                </div>
                <p className="text-white/90">Exclusive travel deals and offers</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl">
                  <Gift className="w-5 h-5 text-sky-300" />
                </div>
                <p className="text-white/90">Curated destinations and experiences</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl">
                  <Plane className="w-5 h-5 text-sky-300" />
                </div>
                <p className="text-white/90">Travel guides and destination tips</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold mb-3 text-gray-900">Subscribe to Our Newsletter</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Join our community to receive the latest travel updates and exclusive offers.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 h-12 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold tracking-wide transition-colors duration-200 rounded-xl"
              >
                <Send className="mr-2 h-4 w-4" />
                Subscribe Now
              </Button>
            </form>
            
            <p className="text-sm text-gray-500 mt-6 text-center">
              Join our growing community of travelers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}