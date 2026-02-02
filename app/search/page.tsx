"use client";

import { FC, useEffect, useState } from 'react';
import FlightDeals from './components/FlightDeals';
import LondonToDubaiGuide from './components/LondonToDubaiGuide';
import { LoadingFullPage } from './components/SearchClient';
import SearchHero from './components/SearchHero';
import { useRouter } from 'next/navigation';

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

  const [error, SetError] = useState(false);

  const router = useRouter();

  useEffect(() => {

    const fetchDestinations = async () => {


      setLoading(true);

      let response = await fetch(`/api/admin/destination/${id}`);

      if (response.ok) {

        let data = await response.json();

        setDestination(data);

      } else {
        SetError(true);

      }
      setLoading(false);
    }

    fetchDestinations();

  }, [id]);



  return <>
    {
      isLoading ?
        <LoadingFullPage />
        :

        <>
          {error ?
            (
              <div className="flex flex-col items-center justify-center my-24 text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                    />
                  </svg>
                </div>

                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  No destinations found
                </h2>

                <p className="text-gray-500 mt-2 max-w-md">
                  We couldn’t find any destinations matching your filters.
                  Try adjusting your search to default.
                </p>

                <button
                  onClick={() => router.push("/")} // optional
                  className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Back Home
                </button>
              </div>
            )

            :
            <>
              <SearchHero destination={destination} />
              <FlightDeals landingPageDestinations={destination?.landingPageDestinations} />
              <LondonToDubaiGuide landingPageTips={destination?.landingPageTips} />
            </>
          }
        </>
    }
  </>
}

export default SearchResults;