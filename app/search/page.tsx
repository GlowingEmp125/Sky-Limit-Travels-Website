import { Metadata } from 'next';
import SearchClient from './components/SearchClient';
import SearchHero from './components/SearchHero';
import CheapFlights from './components/CheapFlights';
import FlightDeals from './components/FlightDeals';
import LondonToDubaiGuide from './components/LondonToDubaiGuide';

export const metadata: Metadata = {
  title: 'Flight Search Results | Sky Limit Travels',
  description: 'Search results for flights. Compare prices and book your perfect flight.',
};

export default function SearchResults() {
  // return <SearchClient />;
  return <>
    <SearchHero />
    {/* <CheapFlights /> */}
    <FlightDeals />
    <LondonToDubaiGuide />
  </>
} 