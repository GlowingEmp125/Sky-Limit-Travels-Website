import Hero from '@/components/sections/home/Hero';
import PopularFlights from '@/components/sections/home/PopularFlights';
import WhyChooseUs from '@/components/sections/home/WhyChooseUs';
import Testimonials from '@/components/sections/home/Testimonials';
import Newsletter from '@/components/sections/home/Newsletter';

export default function Home() {
  return (
    <main>
      <Hero />
      <PopularFlights />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </main>
  );
}