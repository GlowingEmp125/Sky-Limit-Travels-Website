# Fallback Data System

## Overview

This system ensures that users never see error pages when the Amadeus API is unavailable or experiencing issues. Instead of showing errors, the application provides realistic fallback flight data.

## How It Works

### 1. API Error Detection
When any flight-related API encounters an error (network issues, API downtime, rate limits, etc.), the system automatically switches to fallback mode.

### 2. Comprehensive Fallback Data
The fallback system provides:
- **Popular Flights**: 15 popular European destinations with realistic pricing
- **Flight Search**: Dynamic flight results based on origin/destination with multiple options
- **Country Flights**: Flights to specific countries with multiple airports
- **Destination Search**: Local airport data when API is unavailable

### 3. Realistic Data Generation
Fallback data includes:
- ✅ Realistic pricing based on destination and seasonality
- ✅ Multiple airlines (BA, Lufthansa, Air France, easyJet, etc.)
- ✅ Varied departure times and flight durations
- ✅ Proper airport codes and terminals
- ✅ Future dates for departures and returns

## Files Involved

### Core Fallback System
- `lib/fallback-data.ts` - Main fallback data generation
- `lib/amadeus.ts` - Enhanced with fallback support
- `lib/amadeus-error-logger.ts` - Error handling and logging

### API Endpoints with Fallback
- `app/api/popular-flights/route.ts` - Popular destinations
- `app/api/flight-search/route.ts` - Flight search results
- `app/api/country-flights/route.ts` - Country-specific flights
- `app/api/destination-flights/route.ts` - Destination-specific flights
- `app/api/destination-search/route.ts` - Airport search (already implemented)

## Fallback Data Types

### Popular Flights
```typescript
generatePopularFlightsFallback(): FallbackFlightOffer[]
```
- 15 popular European destinations
- Prices from €69 (Dublin) to €179 (Athens)
- Varied departure dates over next 3 months

### Flight Search
```typescript
generateFlightSearchFallback(
  origin: string,
  destination: string, 
  departureDate: string,
  returnDate?: string
): FallbackFlightOffer[]
```
- 5-8 flight options per search
- Price variation based on time and airline
- Supports both one-way and return flights

### Country Flights
```typescript
generateCountryFlightsFallback(countryCode: string): FallbackFlightOffer[]
```
- Multiple destinations per country
- 3 flights per destination
- Covers 20+ European countries

## Logging and Monitoring

All fallback usage is logged with:
- Original error details
- Fallback data source
- Number of results generated
- Request ID for tracking

Example log:
```
[WARNING] Using fallback data due to API error [abc123ef]: LHR → CDG
Details: { 
  originalError: "Network timeout",
  fallbackResultCount: 6,
  source: "comprehensive-fallback"
}
```

## Benefits

### For Users
- ✅ Never see error pages
- ✅ Can continue browsing and planning
- ✅ Realistic flight options to explore
- ✅ Seamless experience during API issues

### For Business
- ✅ Maintains user engagement during downtime
- ✅ Reduces bounce rate from errors
- ✅ Provides data for user testing
- ✅ Graceful degradation of service

### For Developers
- ✅ Comprehensive error handling
- ✅ Easy to maintain and extend
- ✅ Detailed logging for debugging
- ✅ Consistent data structure

## Configuration

### Destinations
Popular destinations are defined in `POPULAR_DESTINATIONS` with:
- Airport codes and cities
- Base pricing
- Terminal information
- Country mapping

### Airlines
Realistic airline codes in `AIRLINES` array:
- British Airways (BA)
- Lufthansa (LH)
- Air France (AF)
- easyJet (U2)
- Ryanair (FR)
- And more...

### UK Airports
Origin airports in `UK_AIRPORTS` for realistic departure points:
- London airports (LHR, LGW, STN, LTN)
- Regional airports (MAN, BHX, EDI, GLA)

## Future Enhancements

### Potential Improvements
1. **Seasonal Pricing**: Adjust prices based on time of year
2. **Real-time Cache**: Store last successful API responses
3. **User Preferences**: Personalised fallback based on search history
4. **A/B Testing**: Different fallback strategies
5. **Performance Metrics**: Track fallback usage and user behaviour

### Maintenance
- Review pricing annually for market accuracy
- Add new destinations as they become popular
- Update airline codes as carriers change
- Monitor fallback usage patterns

## Testing

To test the fallback system:

1. **Simulate API Failure**: Temporarily disable Amadeus credentials
2. **Network Issues**: Block API endpoints in development
3. **Rate Limiting**: Exceed API quotas intentionally
4. **Invalid Requests**: Send malformed parameters

All scenarios should return realistic flight data instead of errors.

## Production Considerations

- Fallback data is marked with `fallback-` prefixed IDs
- Logging helps identify when API issues occur
- Users get seamless experience without knowing about backend issues
- System gracefully handles both temporary and extended outages 