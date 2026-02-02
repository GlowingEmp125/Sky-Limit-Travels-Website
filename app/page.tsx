"use client"
import Hero from '@/components/sections/home/Hero';
import Newsletter from '@/components/sections/home/Newsletter';
import PopularFlights from '@/components/sections/home/PopularFlights';
import Testimonials from '@/components/sections/home/Testimonials';
import WhyChooseUs from '@/components/sections/home/WhyChooseUs';
import { useEffect, useState } from 'react';

export default function Home() {

  const [destinations, setDestinations] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [activeCategory, setActiveCategory] = useState('all');


  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true);

        const params = new URLSearchParams({
          featured: 'true',
          available: 'true',
          slogan: activeCategory === "all" ? "" : activeCategory
        });

        const response = await fetch(`/api/admin/destination?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch destinations');
        }

        const data = await response.json();

        setDestinations(data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDestinations();
  }, [activeCategory]);


  return (
    <main>
      <Hero destinations={destinations}/>
      <PopularFlights
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        destinations={destinations}
        isLoading={isLoading}
      />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </main>
  );
}