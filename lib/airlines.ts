// Comprehensive airline data for consistent display across the application

export interface AirlineInfo {
  name: string;
  shortName?: string;
  logo?: string;
  rating?: number;
  website?: string;
  alliance?: string;
  country?: string;
}

// Enhanced airline mapping with comprehensive information
export const AIRLINE_DATA: Record<string, AirlineInfo> = {
  // Major UK Airlines
  'BA': { 
    name: 'British Airways', 
    shortName: 'British Airways',
    rating: 4.2, 
    alliance: 'oneworld',
    country: 'United Kingdom'
  },
  'VS': { 
    name: 'Virgin Atlantic', 
    shortName: 'Virgin Atlantic',
    rating: 4.2, 
    country: 'United Kingdom'
  },
  
  // European Airlines
  'LH': { 
    name: 'Lufthansa', 
    shortName: 'Lufthansa',
    rating: 4.3, 
    alliance: 'Star Alliance',
    country: 'Germany'
  },
  'AF': { 
    name: 'Air France', 
    shortName: 'Air France',
    rating: 4.1, 
    alliance: 'SkyTeam',
    country: 'France'
  },
  'KL': { 
    name: 'KLM Royal Dutch Airlines', 
    shortName: 'KLM',
    rating: 4.2, 
    alliance: 'SkyTeam',
    country: 'Netherlands'
  },
  'LX': { 
    name: 'Swiss International Air Lines', 
    shortName: 'Swiss',
    rating: 4.3, 
    alliance: 'Star Alliance',
    country: 'Switzerland'
  },
  'OS': { 
    name: 'Austrian Airlines', 
    shortName: 'Austrian',
    rating: 4.0, 
    alliance: 'Star Alliance',
    country: 'Austria'
  },
  'AY': { 
    name: 'Finnair', 
    shortName: 'Finnair',
    rating: 4.1, 
    alliance: 'oneworld',
    country: 'Finland'
  },
  'IB': { 
    name: 'Iberia', 
    shortName: 'Iberia',
    rating: 3.9, 
    alliance: 'oneworld',
    country: 'Spain'
  },
  'SK': { 
    name: 'SAS Scandinavian Airlines', 
    shortName: 'SAS',
    rating: 3.8, 
    alliance: 'Star Alliance',
    country: 'Sweden'
  },
  'TK': { 
    name: 'Turkish Airlines', 
    shortName: 'Turkish Airlines',
    rating: 4.1, 
    alliance: 'Star Alliance',
    country: 'Turkey'
  },
  
  // Low-cost European Airlines
  'FR': { 
    name: 'Ryanair', 
    shortName: 'Ryanair',
    rating: 3.5, 
    country: 'Ireland'
  },
  'U2': { 
    name: 'easyJet', 
    shortName: 'easyJet',
    rating: 3.7, 
    country: 'United Kingdom'
  },
  'VY': { 
    name: 'Vueling Airlines', 
    shortName: 'Vueling',
    rating: 3.6, 
    country: 'Spain'
  },
  'W6': { 
    name: 'Wizz Air', 
    shortName: 'Wizz Air',
    rating: 3.4, 
    country: 'Hungary'
  },
  'PC': { 
    name: 'Pegasus Airlines', 
    shortName: 'Pegasus',
    rating: 3.5, 
    country: 'Turkey'
  },
  'WF': { 
    name: 'Widerøe', 
    shortName: 'Widerøe',
    rating: 3.9, 
    country: 'Norway'
  },
  
  // American Airlines
  'AA': { 
    name: 'American Airlines', 
    shortName: 'American',
    rating: 4.0, 
    alliance: 'oneworld',
    country: 'United States'
  },
  'DL': { 
    name: 'Delta Air Lines', 
    shortName: 'Delta',
    rating: 4.1, 
    alliance: 'SkyTeam',
    country: 'United States'
  },
  'UA': { 
    name: 'United Airlines', 
    shortName: 'United',
    rating: 3.9, 
    alliance: 'Star Alliance',
    country: 'United States'
  },
  
  // Middle Eastern Airlines
  'EK': { 
    name: 'Emirates', 
    shortName: 'Emirates',
    rating: 4.6, 
    country: 'United Arab Emirates'
  },
  'QR': { 
    name: 'Qatar Airways', 
    shortName: 'Qatar Airways',
    rating: 4.5, 
    alliance: 'oneworld',
    country: 'Qatar'
  },
  'EY': { 
    name: 'Etihad Airways', 
    shortName: 'Etihad',
    rating: 4.2, 
    country: 'United Arab Emirates'
  },
  
  // Asian Airlines
  'SQ': { 
    name: 'Singapore Airlines', 
    shortName: 'Singapore Airlines',
    rating: 4.7, 
    alliance: 'Star Alliance',
    country: 'Singapore'
  },
  'CX': { 
    name: 'Cathay Pacific', 
    shortName: 'Cathay Pacific',
    rating: 4.3, 
    alliance: 'oneworld',
    country: 'Hong Kong'
  },
};

// Get airline information by IATA code
export function getAirlineInfo(code: string): AirlineInfo {
  return AIRLINE_DATA[code.toUpperCase()] || { 
    name: code, 
    shortName: code,
    rating: 3.5 
  };
}

// Get airline name (full name)
export function getAirlineName(code: string): string {
  const airline = getAirlineInfo(code);
  return airline.name;
}

// Get airline short name (for display in compact spaces)
export function getAirlineShortName(code: string): string {
  const airline = getAirlineInfo(code);
  return airline.shortName || airline.name;
}

// Get airline rating
export function getAirlineRating(code: string): number {
  const airline = getAirlineInfo(code);
  return airline.rating || 3.5;
}

// Get all available airlines (for filters, etc.)
export function getAllAirlines(): Array<{ code: string; info: AirlineInfo }> {
  return Object.entries(AIRLINE_DATA).map(([code, info]) => ({ code, info }));
}

// Check if airline is low-cost carrier
export function isLowCostCarrier(code: string): boolean {
  const lowCostCarriers = ['FR', 'U2', 'VY', 'W6', 'PC', 'WF'];
  return lowCostCarriers.includes(code.toUpperCase());
}

// Get airline category
export function getAirlineCategory(code: string): 'full-service' | 'low-cost' | 'premium' {
  const airline = getAirlineInfo(code);
  
  if (isLowCostCarrier(code)) {
    return 'low-cost';
  }
  
  if (airline.rating && airline.rating >= 4.5) {
    return 'premium';
  }
  
  return 'full-service';
}

// Format airline display with rating
export function formatAirlineWithRating(code: string): string {
  const airline = getAirlineInfo(code);
  const rating = airline.rating ? ` (${airline.rating}★)` : '';
  return `${airline.name}${rating}`;
} 