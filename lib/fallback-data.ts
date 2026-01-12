// Comprehensive fallback data for when Amadeus API is unavailable
// This ensures users never see error pages in production

export interface FallbackFlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  cityName?: string;
  isAlternativeDate?: boolean;
  itineraries: {
    segments: {
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      duration: string;
    }[];
  }[];
}

// Popular destinations with realistic pricing
export const POPULAR_DESTINATIONS = [
  { code: 'CDG', city: 'Paris', country: 'France', basePrice: 89, terminal: '2E' },
  { code: 'BCN', city: 'Barcelona', country: 'Spain', basePrice: 119, terminal: '1' },
  { code: 'FCO', city: 'Rome', country: 'Italy', basePrice: 129, terminal: '3' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', basePrice: 79, terminal: '2' },
  { code: 'LIS', city: 'Lisbon', country: 'Portugal', basePrice: 149, terminal: '1' },
  { code: 'ATH', city: 'Athens', country: 'Greece', basePrice: 179, terminal: '2' },
  { code: 'MAD', city: 'Madrid', country: 'Spain', basePrice: 129, terminal: '4' },
  { code: 'DUB', city: 'Dublin', country: 'Ireland', basePrice: 69, terminal: '1' },
  { code: 'VIE', city: 'Vienna', country: 'Austria', basePrice: 139, terminal: '1' },
  { code: 'PRG', city: 'Prague', country: 'Czech Republic', basePrice: 110, terminal: '1' },
  { code: 'BUD', city: 'Budapest', country: 'Hungary', basePrice: 129, terminal: '2' },
  { code: 'CPH', city: 'Copenhagen', country: 'Denmark', basePrice: 119, terminal: '2' },
  { code: 'ZUR', city: 'Zurich', country: 'Switzerland', basePrice: 159, terminal: '1' },
  { code: 'MUC', city: 'Munich', country: 'Germany', basePrice: 139, terminal: '2' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', basePrice: 129, terminal: '1' }
];

// Airlines with realistic carrier codes
export const AIRLINES = [
  { code: 'BA', name: 'British Airways' },
  { code: 'LH', name: 'Lufthansa' },
  { code: 'AF', name: 'Air France' },
  { code: 'U2', name: 'easyJet' },
  { code: 'FR', name: 'Ryanair' },
  { code: 'IB', name: 'Iberia' },
  { code: 'KL', name: 'KLM' },
  { code: 'LX', name: 'Swiss' },
  { code: 'OS', name: 'Austrian Airlines' },
  { code: 'SK', name: 'SAS' }
];

// UK airports for origin points
export const UK_AIRPORTS = [
  { code: 'LHR', city: 'London', terminal: '5' },
  { code: 'LGW', city: 'London', terminal: 'S' },
  { code: 'STN', city: 'London', terminal: '1' },
  { code: 'LTN', city: 'London', terminal: '1' },
  { code: 'MAN', city: 'Manchester', terminal: '1' },
  { code: 'BHX', city: 'Birmingham', terminal: '1' },
  { code: 'EDI', city: 'Edinburgh', terminal: '1' },
  { code: 'GLA', city: 'Glasgow', terminal: '1' },
  { code: 'BRS', city: 'Bristol', terminal: '1' },
  { code: 'NCL', city: 'Newcastle', terminal: '1' }
];

// Generate future date string
function getFutureDateString(daysAhead: number = 30): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
}

// Calculate flight duration based on destination
function getFlightDuration(destinationCode: string): string {
  // Short-haul European flights
  if (['CDG', 'AMS', 'BRU', 'DUB', 'FRA', 'MUC'].includes(destinationCode)) {
    return 'PT1H45M';
  }
  // Medium-haul European flights
  if (['BCN', 'MAD', 'FCO', 'ATH', 'LIS', 'VIE', 'PRG', 'BUD', 'CPH', 'ZUR'].includes(destinationCode)) {
    return 'PT2H30M';
  }
  // Longer European flights
  if (['ATH', 'IST', 'HEL', 'OSL', 'ARN'].includes(destinationCode)) {
    return 'PT3H30M';
  }
  // Default medium-haul
  return 'PT2H30M';
}

// Generate popular flights fallback data
export function generatePopularFlightsFallback(): FallbackFlightOffer[] {
  const flights: FallbackFlightOffer[] = [];
  
  POPULAR_DESTINATIONS.forEach((dest, index) => {
    // Calculate future dates with variation
    const departureOffset = 14 + (index * 3); // Spread departures over time
    const returnOffset = departureOffset + 7; // Week-long trips
    
    const departureDate = getFutureDateString(departureOffset);
    const returnDate = getFutureDateString(returnOffset);
    
    // Add some price variation
    const priceVariation = (Math.random() - 0.5) * 40; // ±£20 variation
    const finalPrice = Math.max(dest.basePrice + priceVariation, dest.basePrice * 0.8);
    
    // Select airline based on destination
    const airline = AIRLINES[index % AIRLINES.length];
    
    const flight: FallbackFlightOffer = {
      id: `fallback-popular-${dest.code}-${index}`,
      price: {
        total: finalPrice.toFixed(2),
        currency: 'EUR'
      },
      cityName: dest.city,
      itineraries: [
        {
          segments: [
            {
              departure: {
                iataCode: 'LHR',
                terminal: '5',
                at: new Date(`${departureDate}T08:${30 + (index * 5)}:00.000Z`).toISOString()
              },
              arrival: {
                iataCode: dest.code,
                terminal: dest.terminal,
                at: new Date(`${departureDate}T${10 + Math.floor(index / 3)}:${30 + (index * 5)}:00.000Z`).toISOString()
              },
              carrierCode: airline.code,
              number: `${1000 + index}`,
              duration: getFlightDuration(dest.code)
            }
          ]
        },
        {
          segments: [
            {
              departure: {
                iataCode: dest.code,
                terminal: dest.terminal,
                at: new Date(`${returnDate}T${14 + Math.floor(index / 4)}:${15 + (index * 5)}:00.000Z`).toISOString()
              },
              arrival: {
                iataCode: 'LHR',
                terminal: '5',
                at: new Date(`${returnDate}T${16 + Math.floor(index / 4)}:${15 + (index * 5)}:00.000Z`).toISOString()
              },
              carrierCode: airline.code,
              number: `${2000 + index}`,
              duration: getFlightDuration(dest.code)
            }
          ]
        }
      ]
    };
    
    flights.push(flight);
  });
  
  // Sort by price for better user experience
  flights.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
  
  return flights;
}

// Generate flight search fallback data
export function generateFlightSearchFallback(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string
): FallbackFlightOffer[] {
  const flights: FallbackFlightOffer[] = [];
  
  // Find destination info
  const destInfo = POPULAR_DESTINATIONS.find(d => d.code === destination) || {
    code: destination,
    city: 'Unknown',
    country: 'Unknown',
    basePrice: 200,
    terminal: '1'
  };
  
  // Find origin info
  const originInfo = UK_AIRPORTS.find(a => a.code === origin) || {
    code: origin,
    city: 'Unknown',
    terminal: '1'
  };
  
  // Generate 5-8 flight options with different prices and times
  const numFlights = 5 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < numFlights; i++) {
    // Price variation based on time and airline
    const basePrice = destInfo.basePrice;
    const priceMultiplier = 0.8 + (i * 0.3) + (Math.random() * 0.4);
    const finalPrice = basePrice * priceMultiplier;
    
    // Time variations
    const depHour = 6 + (i * 2) + Math.floor(Math.random() * 2);
    const depMinute = Math.floor(Math.random() * 60);
    
    // Select airline
    const airline = AIRLINES[i % AIRLINES.length];
    
    // Create departure time
    const depTime = new Date(departureDate);
    depTime.setHours(depHour, depMinute, 0);
    
    // Calculate arrival time
    const duration = getFlightDuration(destination);
    const durationHours = parseInt(duration.match(/(\d+)H/)?.[1] || '2');
    const durationMinutes = parseInt(duration.match(/(\d+)M/)?.[1] || '30');
    const arrTime = new Date(depTime.getTime() + (durationHours * 60 + durationMinutes) * 60 * 1000);
    
    // Return flight times (if return date provided)
    let retDepTime: Date | undefined;
    let retArrTime: Date | undefined;
    
    if (returnDate) {
      retDepTime = new Date(returnDate);
      retDepTime.setHours(10 + (i * 2), depMinute, 0);
      retArrTime = new Date(retDepTime.getTime() + (durationHours * 60 + durationMinutes) * 60 * 1000);
    }
    
    const flight: FallbackFlightOffer = {
      id: `fallback-search-${origin}-${destination}-${i}`,
      price: {
        total: finalPrice.toFixed(2),
        currency: 'EUR'
      },
      itineraries: [
        {
          segments: [
            {
              departure: {
                iataCode: origin,
                terminal: originInfo.terminal,
                at: depTime.toISOString()
              },
              arrival: {
                iataCode: destination,
                terminal: destInfo.terminal,
                at: arrTime.toISOString()
              },
              carrierCode: airline.code,
              number: `${100 + i}`,
              duration: duration
            }
          ]
        }
      ]
    };
    
    // Add return flight if return date provided
    if (returnDate && retDepTime && retArrTime) {
      flight.itineraries.push({
        segments: [
          {
            departure: {
              iataCode: destination,
              terminal: destInfo.terminal,
              at: retDepTime.toISOString()
            },
            arrival: {
              iataCode: origin,
              terminal: originInfo.terminal,
              at: retArrTime.toISOString()
            },
            carrierCode: airline.code,
            number: `${200 + i}`,
            duration: duration
          }
        ]
      });
    }
    
    flights.push(flight);
  }
  
  // Sort by price
  flights.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
  
  return flights;
}

// Generate country flights fallback data
export function generateCountryFlightsFallback(countryCode: string): FallbackFlightOffer[] {
  // Find destinations in the specified country
  const countryDestinations = POPULAR_DESTINATIONS.filter(dest => 
    dest.country.toLowerCase().includes(getCountryName(countryCode).toLowerCase())
  );
  
  // If no specific destinations found, create generic ones
  if (countryDestinations.length === 0) {
    return generateGenericCountryFlights(countryCode);
  }
  
  const flights: FallbackFlightOffer[] = [];
  
  countryDestinations.forEach((dest, index) => {
    // Generate multiple flights per destination
    for (let i = 0; i < 3; i++) {
      const departureDate = getFutureDateString(14 + (index * 7) + (i * 2));
      const returnDate = getFutureDateString(21 + (index * 7) + (i * 2));
      
      const priceVariation = 1 + (i * 0.2) + (Math.random() * 0.3);
      const finalPrice = dest.basePrice * priceVariation;
      
      const airline = AIRLINES[(index + i) % AIRLINES.length];
      const ukAirport = UK_AIRPORTS[index % UK_AIRPORTS.length];
      
      const flight: FallbackFlightOffer = {
        id: `fallback-country-${countryCode}-${dest.code}-${i}`,
        price: {
          total: finalPrice.toFixed(2),
          currency: 'EUR'
        },
        itineraries: [
          {
            segments: [
              {
                departure: {
                  iataCode: ukAirport.code,
                  terminal: ukAirport.terminal,
                  at: new Date(`${departureDate}T${8 + i}:${30 + (i * 15)}:00.000Z`).toISOString()
                },
                arrival: {
                  iataCode: dest.code,
                  terminal: dest.terminal,
                  at: new Date(`${departureDate}T${10 + i}:${30 + (i * 15)}:00.000Z`).toISOString()
                },
                carrierCode: airline.code,
                number: `${300 + index * 10 + i}`,
                duration: getFlightDuration(dest.code)
              }
            ]
          },
          {
            segments: [
              {
                departure: {
                  iataCode: dest.code,
                  terminal: dest.terminal,
                  at: new Date(`${returnDate}T${15 + i}:${45 + (i * 15)}:00.000Z`).toISOString()
                },
                arrival: {
                  iataCode: ukAirport.code,
                  terminal: ukAirport.terminal,
                  at: new Date(`${returnDate}T${17 + i}:${45 + (i * 15)}:00.000Z`).toISOString()
                },
                carrierCode: airline.code,
                number: `${400 + index * 10 + i}`,
                duration: getFlightDuration(dest.code)
              }
            ]
          }
        ]
      };
      
      flights.push(flight);
    }
  });
  
  flights.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
  return flights;
}

// Helper function to get country name from code
function getCountryName(countryCode: string): string {
  const countryMap: Record<string, string> = {
    'FR': 'France',
    'IT': 'Italy', 
    'ES': 'Spain',
    'GR': 'Greece',
    'DE': 'Germany',
    'PT': 'Portugal',
    'NL': 'Netherlands',
    'AT': 'Austria',
    'CH': 'Switzerland',
    'BE': 'Belgium',
    'DK': 'Denmark',
    'SE': 'Sweden',
    'NO': 'Norway',
    'FI': 'Finland',
    'IE': 'Ireland',
    'CZ': 'Czech Republic',
    'HU': 'Hungary',
    'PL': 'Poland',
    'HR': 'Croatia',
    'TR': 'Turkey'
  };
  
  return countryMap[countryCode.toUpperCase()] || countryCode;
}

// Generate generic flights for unknown countries
function generateGenericCountryFlights(countryCode: string): FallbackFlightOffer[] {
  const flights: FallbackFlightOffer[] = [];
  const countryName = getCountryName(countryCode);
  
  // Create 5 generic flights
  for (let i = 0; i < 5; i++) {
    const departureDate = getFutureDateString(14 + (i * 5));
    const returnDate = getFutureDateString(21 + (i * 5));
    
    const basePrice = 150 + (i * 50) + (Math.random() * 100);
    const airline = AIRLINES[i % AIRLINES.length];
    const ukAirport = UK_AIRPORTS[i % UK_AIRPORTS.length];
    
    const flight: FallbackFlightOffer = {
      id: `fallback-generic-${countryCode}-${i}`,
      price: {
        total: basePrice.toFixed(2),
        currency: 'EUR'
      },
      itineraries: [
        {
          segments: [
            {
              departure: {
                iataCode: ukAirport.code,
                terminal: ukAirport.terminal,
                at: new Date(`${departureDate}T${8 + i}:30:00.000Z`).toISOString()
              },
              arrival: {
                iataCode: `${countryCode}X`, // Generic destination code
                terminal: '1',
                at: new Date(`${departureDate}T${11 + i}:30:00.000Z`).toISOString()
              },
              carrierCode: airline.code,
              number: `${500 + i}`,
              duration: 'PT3H00M'
            }
          ]
        },
        {
          segments: [
            {
              departure: {
                iataCode: `${countryCode}X`,
                terminal: '1',
                at: new Date(`${returnDate}T${15 + i}:30:00.000Z`).toISOString()
              },
              arrival: {
                iataCode: ukAirport.code,
                terminal: ukAirport.terminal,
                at: new Date(`${returnDate}T${18 + i}:30:00.000Z`).toISOString()
              },
              carrierCode: airline.code,
              number: `${600 + i}`,
              duration: 'PT3H00M'
            }
          ]
        }
      ]
    };
    
    flights.push(flight);
  }
  
  return flights;
} 