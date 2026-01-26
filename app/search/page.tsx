"use client";

import { FC, useEffect, useState } from 'react';
import FlightDeals from './components/FlightDeals';
import LondonToDubaiGuide from './components/LondonToDubaiGuide';
import { LoadingFullPage } from './components/SearchClient';
import SearchHero from './components/SearchHero';

// export const metadata: Metadata = {
//   title: 'Flight Search Results | Sky Limit Travels',
//   description: 'Search results for flights. Compare prices and book your perfect flight.',
// };

interface Props {
  searchParams: any
}
const SearchResults: FC<Props> = ({ searchParams }) => {

  const { id } = searchParams;

  const [isLoading, setLoading] = useState(false);

  const [destination, setDestination] = useState<any>();

  useEffect(() => {

    const fetchDestinations = async () => {

      setLoading(true);

      let response = await fetch(`/api/admin/destination/${id}`);

      let data = await response.json();

      setDestination(data);

      setLoading(false);

    }

    fetchDestinations();

  }, [id]);

  console.log("destination=======>", destination);


  return <>
    {
      isLoading ?
        <LoadingFullPage />
        :

        <>
          <SearchHero />
          <FlightDeals landingPageDestinations={destination?.landingPageDestinations} />
          <LondonToDubaiGuide landingPageTips={destination?.landingPageTips} />
        </>
    }
  </>
}

export default SearchResults;