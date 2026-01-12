// Airport interface to ensure type safety
export interface Airport {
  id: string;
  iataCode: string;
  name: string;
  city: string;
  country: string;
}

// Utility function to extract IATA code from a string like "City, Country - Airport Name (ABC)"
export function extractIataCode(input: string): string | null {
  // Try to extract code from parentheses format: Something (ABC)
  const parenthesesMatch = input.match(/\(([A-Z]{3})\)/i);
  if (parenthesesMatch) {
    return parenthesesMatch[1].toUpperCase();
  }
  
  // If input is exactly 3 characters, it might be an IATA code
  if (/^[A-Z]{3}$/i.test(input.trim())) {
    return input.trim().toUpperCase();
  }
  
  return null;
}

// Comprehensive airport database with IATA codes, names, cities and countries
export const airports: Airport[] = [
  // United Kingdom
  { id: 'lhr', iataCode: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom' },
  { id: 'lgw', iataCode: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'United Kingdom' },
  { id: 'stn', iataCode: 'STN', name: 'Stansted Airport', city: 'London', country: 'United Kingdom' },
  { id: 'ltn', iataCode: 'LTN', name: 'Luton Airport', city: 'London', country: 'United Kingdom' },
  { id: 'man', iataCode: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'United Kingdom' },
  { id: 'bhx', iataCode: 'BHX', name: 'Birmingham Airport', city: 'Birmingham', country: 'United Kingdom' },
  { id: 'gla', iataCode: 'GLA', name: 'Glasgow Airport', city: 'Glasgow', country: 'United Kingdom' },
  { id: 'edi', iataCode: 'EDI', name: 'Edinburgh Airport', city: 'Edinburgh', country: 'United Kingdom' },
  
  // France
  { id: 'cdg', iataCode: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
  { id: 'ory', iataCode: 'ORY', name: 'Orly Airport', city: 'Paris', country: 'France' },
  { id: 'nce', iataCode: 'NCE', name: 'Nice Côte d\'Azur Airport', city: 'Nice', country: 'France' },
  { id: 'lys', iataCode: 'LYS', name: 'Lyon-Saint Exupéry Airport', city: 'Lyon', country: 'France' },
  { id: 'mrs', iataCode: 'MRS', name: 'Marseille Provence Airport', city: 'Marseille', country: 'France' },
  { id: 'tls', iataCode: 'TLS', name: 'Toulouse-Blagnac Airport', city: 'Toulouse', country: 'France' },
  
  // Italy
  { id: 'fco', iataCode: 'FCO', name: 'Leonardo da Vinci–Fiumicino Airport', city: 'Rome', country: 'Italy' },
  { id: 'cia', iataCode: 'CIA', name: 'Rome Ciampino Airport', city: 'Rome', country: 'Italy' },
  { id: 'mxp', iataCode: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy' },
  { id: 'lin', iataCode: 'LIN', name: 'Milan Linate Airport', city: 'Milan', country: 'Italy' },
  { id: 'bgy', iataCode: 'BGY', name: 'Milan Bergamo Airport', city: 'Milan', country: 'Italy' },
  { id: 'vce', iataCode: 'VCE', name: 'Venice Marco Polo Airport', city: 'Venice', country: 'Italy' },
  { id: 'nap', iataCode: 'NAP', name: 'Naples International Airport', city: 'Naples', country: 'Italy' },
  { id: 'psa', iataCode: 'PSA', name: 'Pisa International Airport', city: 'Pisa', country: 'Italy' },
  { id: 'flr', iataCode: 'FLR', name: 'Florence Airport', city: 'Florence', country: 'Italy' },
  { id: 'cta', iataCode: 'CTA', name: 'Catania-Fontanarossa Airport', city: 'Catania', country: 'Italy' },
  { id: 'blq', iataCode: 'BLQ', name: 'Bologna Guglielmo Marconi Airport', city: 'Bologna', country: 'Italy' },
  { id: 'bri', iataCode: 'BRI', name: 'Bari Karol Wojtyła Airport', city: 'Bari', country: 'Italy' },

  // Spain
  { id: 'mad', iataCode: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain' },
  { id: 'bcn', iataCode: 'BCN', name: 'Barcelona El Prat Airport', city: 'Barcelona', country: 'Spain' },
  { id: 'agp', iataCode: 'AGP', name: 'Málaga Airport', city: 'Málaga', country: 'Spain' },
  { id: 'alc', iataCode: 'ALC', name: 'Alicante Airport', city: 'Alicante', country: 'Spain' },
  { id: 'pmi', iataCode: 'PMI', name: 'Palma de Mallorca Airport', city: 'Palma de Mallorca', country: 'Spain' },
  { id: 'tfn', iataCode: 'TFN', name: 'Tenerife North Airport', city: 'Tenerife', country: 'Spain' },
  { id: 'tfs', iataCode: 'TFS', name: 'Tenerife South Airport', city: 'Tenerife', country: 'Spain' },
  { id: 'lpa', iataCode: 'LPA', name: 'Gran Canaria Airport', city: 'Gran Canaria', country: 'Spain' },
  { id: 'ibz', iataCode: 'IBZ', name: 'Ibiza Airport', city: 'Ibiza', country: 'Spain' },
  { id: 'vlc', iataCode: 'VLC', name: 'Valencia Airport', city: 'Valencia', country: 'Spain' },
  { id: 'svq', iataCode: 'SVQ', name: 'Seville Airport', city: 'Seville', country: 'Spain' },
  
  // Portugal
  { id: 'lis', iataCode: 'LIS', name: 'Lisbon Airport', city: 'Lisbon', country: 'Portugal' },
  { id: 'opo', iataCode: 'OPO', name: 'Porto Airport', city: 'Porto', country: 'Portugal' },
  { id: 'fao', iataCode: 'FAO', name: 'Faro Airport', city: 'Faro', country: 'Portugal' },
  { id: 'fnc', iataCode: 'FNC', name: 'Madeira Airport', city: 'Funchal', country: 'Portugal' },
  { id: 'pdl', iataCode: 'PDL', name: 'Ponta Delgada Airport', city: 'Ponta Delgada', country: 'Portugal' },
  
  // Greece
  { id: 'ath', iataCode: 'ATH', name: 'Athens International Airport', city: 'Athens', country: 'Greece' },
  { id: 'jtr', iataCode: 'JTR', name: 'Santorini Airport', city: 'Santorini', country: 'Greece' },
  { id: 'jmk', iataCode: 'JMK', name: 'Mykonos Airport', city: 'Mykonos', country: 'Greece' },
  { id: 'her', iataCode: 'HER', name: 'Heraklion International Airport', city: 'Heraklion', country: 'Greece' },
  { id: 'chq', iataCode: 'CHQ', name: 'Chania International Airport', city: 'Chania', country: 'Greece' },
  { id: 'rho', iataCode: 'RHO', name: 'Rhodes International Airport', city: 'Rhodes', country: 'Greece' },
  { id: 'cfu', iataCode: 'CFU', name: 'Corfu International Airport', city: 'Corfu', country: 'Greece' },
  { id: 'kgs', iataCode: 'KGS', name: 'Kos Airport', city: 'Kos', country: 'Greece' },
  { id: 'zth', iataCode: 'ZTH', name: 'Zakynthos International Airport', city: 'Zakynthos', country: 'Greece' },
  { id: 'skg', iataCode: 'SKG', name: 'Thessaloniki Airport', city: 'Thessaloniki', country: 'Greece' },
  { id: 'klx', iataCode: 'KLX', name: 'Kalamata International Airport', city: 'Kalamata', country: 'Greece' },
  { id: 'efl', iataCode: 'EFL', name: 'Kefalonia Airport', city: 'Kefalonia', country: 'Greece' },
  
  // Croatia
  { id: 'dbv', iataCode: 'DBV', name: 'Dubrovnik Airport', city: 'Dubrovnik', country: 'Croatia' },
  { id: 'spu', iataCode: 'SPU', name: 'Split Airport', city: 'Split', country: 'Croatia' },
  { id: 'zag', iataCode: 'ZAG', name: 'Zagreb International Airport', city: 'Zagreb', country: 'Croatia' },
  { id: 'zad', iataCode: 'ZAD', name: 'Zadar Airport', city: 'Zadar', country: 'Croatia' },
  { id: 'puy', iataCode: 'PUY', name: 'Pula Airport', city: 'Pula', country: 'Croatia' },
  { id: 'rjk', iataCode: 'RJK', name: 'Rijeka Airport', city: 'Rijeka', country: 'Croatia' },
  { id: 'osi', iataCode: 'OSI', name: 'Osijek Airport', city: 'Osijek', country: 'Croatia' },
  
  // Turkey
  { id: 'ist', iataCode: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
  { id: 'saw', iataCode: 'SAW', name: 'Istanbul Sabiha Gökçen Airport', city: 'Istanbul', country: 'Turkey' },
  { id: 'ayt', iataCode: 'AYT', name: 'Antalya Airport', city: 'Antalya', country: 'Turkey' },
  { id: 'bjv', iataCode: 'BJV', name: 'Milas–Bodrum Airport', city: 'Bodrum', country: 'Turkey' },
  { id: 'dlm', iataCode: 'DLM', name: 'Dalaman Airport', city: 'Dalaman', country: 'Turkey' },
  { id: 'adb', iataCode: 'ADB', name: 'Izmir Adnan Menderes Airport', city: 'Izmir', country: 'Turkey' },
  { id: 'esb', iataCode: 'ESB', name: 'Ankara Esenboğa Airport', city: 'Ankara', country: 'Turkey' },
  { id: 'nev', iataCode: 'NEV', name: 'Nevşehir Kapadokya Airport', city: 'Nevşehir', country: 'Turkey' },
  { id: 'tzx', iataCode: 'TZX', name: 'Trabzon Airport', city: 'Trabzon', country: 'Turkey' },
  
  // Netherlands
  { id: 'ams', iataCode: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  { id: 'rtm', iataCode: 'RTM', name: 'Rotterdam The Hague Airport', city: 'Rotterdam', country: 'Netherlands' },
  { id: 'ein', iataCode: 'EIN', name: 'Eindhoven Airport', city: 'Eindhoven', country: 'Netherlands' },
  
  // Germany
  { id: 'fra', iataCode: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { id: 'muc', iataCode: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany' },
  { id: 'ber', iataCode: 'BER', name: 'Berlin Brandenburg Airport', city: 'Berlin', country: 'Germany' },
  { id: 'dus', iataCode: 'DUS', name: 'Düsseldorf Airport', city: 'Düsseldorf', country: 'Germany' },
  { id: 'ham', iataCode: 'HAM', name: 'Hamburg Airport', city: 'Hamburg', country: 'Germany' },
  
  // Belgium
  { id: 'bru', iataCode: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium' },
  { id: 'crl', iataCode: 'CRL', name: 'Brussels South Charleroi Airport', city: 'Brussels', country: 'Belgium' },
  
  // Austria
  { id: 'vie', iataCode: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria' },
  { id: 'sbg', iataCode: 'SBG', name: 'Salzburg Airport', city: 'Salzburg', country: 'Austria' },
  
  // Switzerland
  { id: 'zur', iataCode: 'ZUR', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland' },
  { id: 'gva', iataCode: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland' },
  { id: 'bsl', iataCode: 'BSL', name: 'EuroAirport Basel-Mulhouse-Freiburg', city: 'Basel', country: 'Switzerland' },
  
  // Czech Republic
  { id: 'prg', iataCode: 'PRG', name: 'Václav Havel Airport Prague', city: 'Prague', country: 'Czech Republic' },
  
  // Hungary
  { id: 'bud', iataCode: 'BUD', name: 'Budapest Ferenc Liszt International Airport', city: 'Budapest', country: 'Hungary' },
  
  // Poland
  { id: 'waw', iataCode: 'WAW', name: 'Warsaw Chopin Airport', city: 'Warsaw', country: 'Poland' },
  { id: 'krd', iataCode: 'KRK', name: 'John Paul II International Airport Kraków-Balice', city: 'Kraków', country: 'Poland' },
  
  // Denmark
  { id: 'cph', iataCode: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark' },
  
  // Sweden
  { id: 'arn', iataCode: 'ARN', name: 'Stockholm Arlanda Airport', city: 'Stockholm', country: 'Sweden' },
  { id: 'got', iataCode: 'GOT', name: 'Gothenburg Landvetter Airport', city: 'Gothenburg', country: 'Sweden' },
  
  // Norway
  { id: 'osl', iataCode: 'OSL', name: 'Oslo Airport', city: 'Oslo', country: 'Norway' },
  { id: 'bgn', iataCode: 'BGO', name: 'Bergen Airport', city: 'Bergen', country: 'Norway' },
  
  // Finland
  { id: 'hel', iataCode: 'HEL', name: 'Helsinki Airport', city: 'Helsinki', country: 'Finland' },
  
  // Ireland
  { id: 'dub', iataCode: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland' },
  { id: 'cork', iataCode: 'ORK', name: 'Cork Airport', city: 'Cork', country: 'Ireland' },
  
  // Luxembourg
  { id: 'lux', iataCode: 'LUX', name: 'Luxembourg Airport', city: 'Luxembourg', country: 'Luxembourg' },
  
  // USA
  { id: 'jfk', iataCode: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
  { id: 'lga', iataCode: 'LGA', name: 'LaGuardia Airport', city: 'New York', country: 'USA' },
  { id: 'ewr', iataCode: 'EWR', name: 'Newark Liberty International Airport', city: 'Newark', country: 'USA' },
  { id: 'lax', iataCode: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA' },
  { id: 'sfo', iataCode: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'USA' },
  { id: 'ord', iataCode: 'ORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'USA' },
  { id: 'mia', iataCode: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'USA' },
  { id: 'las', iataCode: 'LAS', name: 'Harry Reid International Airport', city: 'Las Vegas', country: 'USA' },
  
  // Others major international airports
  { id: 'dxb', iataCode: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
  { id: 'syd', iataCode: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia' },
  { id: 'hnd', iataCode: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan' },
  { id: 'nrt', iataCode: 'NRT', name: 'Tokyo Narita Airport', city: 'Tokyo', country: 'Japan' },
  { id: 'sin', iataCode: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
  { id: 'hkg', iataCode: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong' },
  { id: 'bkk', iataCode: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { id: 'icn', iataCode: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea' },
  { id: 'del', iataCode: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India' },
  { id: 'bom', iataCode: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India' },
  { id: 'gru', iataCode: 'GRU', name: 'São Paulo/Guarulhos International Airport', city: 'São Paulo', country: 'Brazil' },
  { id: 'mex', iataCode: 'MEX', name: 'Mexico City International Airport', city: 'Mexico City', country: 'Mexico' },
  { id: 'yyz', iataCode: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada' },
  { id: 'yvr', iataCode: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada' },
  { id: 'cpt', iataCode: 'CPT', name: 'Cape Town International Airport', city: 'Cape Town', country: 'South Africa' },
  { id: 'jnb', iataCode: 'JNB', name: 'O.R. Tambo International Airport', city: 'Johannesburg', country: 'South Africa' },
  { id: 'cai', iataCode: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt' },
  { id: 'akl', iataCode: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand' }
];

// Helper function to get airport details by IATA code
export function getAirportByCode(code: string): Airport | undefined {
  return airports.find(airport => airport.iataCode.toUpperCase() === code.toUpperCase());
}

// Helper function to get formatted airport name
export function getFormattedAirportName(code: string): string {
  const airport = getAirportByCode(code);
  return airport 
    ? `${airport.city}, ${airport.country} - ${airport.name} (${airport.iataCode})`
    : code;
}

// Helper function to get city and country by IATA code
export function getCityAndCountry(code: string): string {
  if (!code) return '';
  
  // Handle special codes first
  const specialDisplay = getSpecialCodeDisplay(code);
  if (specialDisplay) return specialDisplay;
  
  const airport = getAirportByCode(code);
  return airport ? `${airport.city}, ${airport.country}` : code;
}

// Helper function to format location for display
export function getFormattedLocation(code: string): string {
  if (!code) return '';
  const airport = getAirportByCode(code);
  return airport ? `${airport.city}, ${airport.country}` : code;
}

// Helper function to format airport codes in a user-friendly way
// This displays the city name with the code in parentheses
export function formatAirportDisplay(code: string): string {
  if (!code) return '';
  
  // Handle special "All airports" codes first
  const specialDisplay = getSpecialCodeDisplay(code);
  if (specialDisplay) return specialDisplay;
  
  const airport = getAirportByCode(code);
  return airport ? `${airport.city} (${airport.iataCode})` : code;
}

// Helper function to resolve special country and city codes
export function getSpecialCodeDisplay(code: string): string | null {
  if (!code) return null;
  
  // Handle special "All airports" codes
  if (code.endsWith('C')) {
    const countryPrefix = code.substring(0, code.length - 1);
    const countryNames: Record<string, string> = {
      'SPA': 'Spain',
      'ITA': 'Italy', 
      'FRA': 'France',
      'GER': 'Germany',
      'GRE': 'Greece',
      'POR': 'Portugal',
      'CRO': 'Croatia',
      'TUR': 'Turkey',
      'NET': 'Netherlands',
      'UNI': 'United Kingdom',
      'BEL': 'Belgium',
      'AUS': 'Austria',
      'SWI': 'Switzerland',
      'CZE': 'Czech Republic',
      'HUN': 'Hungary',
      'POL': 'Poland',
      'DEN': 'Denmark',
      'SWE': 'Sweden',
      'NOR': 'Norway',
      'FIN': 'Finland',
      'IRE': 'Ireland',
      'LUX': 'Luxembourg',
      'UAE': 'United Arab Emirates',
    };
    
    const countryName = countryNames[countryPrefix];
    if (countryName) {
      return `${countryName} (All airports)`;
    }
  }
  
  if (code.endsWith('A')) {
    const cityPrefix = code.substring(0, code.length - 1);
    const cityNames: Record<string, string> = {
      'LON': 'London',
      'PAR': 'Paris',
      'ROM': 'Rome',
      'MAD': 'Madrid',
      'BCN': 'Barcelona',
      'MIL': 'Milan',
      'IST': 'Istanbul',
    };
    
    const cityName = cityNames[cityPrefix];
    if (cityName) {
      return `${cityName} (All airports)`;
    }
  }
  
  return null;
}

// Helper function that formats airport for route display
// Used for showing routes like "London LHR → Paris CDG"
export function formatRouteDisplay(originCode: string, destinationCode: string): string {
  const origin = getAirportByCode(originCode);
  const destination = getAirportByCode(destinationCode);
  
  const originDisplay = origin ? `${origin.city} ${origin.iataCode}` : originCode;
  const destinationDisplay = destination ? `${destination.city} ${destination.iataCode}` : destinationCode;
  
  return `${originDisplay} → ${destinationDisplay}`;
} 