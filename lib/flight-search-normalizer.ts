// A unified flight offer structure
export interface UnifiedFlightOffer {
  id: string;
  source: 'Amadeus' | 'Travelpayouts';
  price: number;
  currency: string;
  itineraries: UnifiedItinerary[];
  // Add other relevant fields that are common to both
}

export interface UnifiedItinerary {
  duration: string;
  segments: UnifiedSegment[];
}

export interface UnifiedSegment {
  departure: {
    iataCode: string;
    at: string;
    terminal?: string;
  };
  arrival: {
    iataCode: string;
    at: string;
    terminal?: string;
  };
  carrierCode: string;
  flightNumber: string;
  duration: string;
}


export function normalizeAmadeusResponse(amadeusData: any[]): UnifiedFlightOffer[] {
    if (!amadeusData) return [];

    return amadeusData.map(offer => {
        const originalPrice = parseFloat(offer.price.total);
        // Apply 25% discount to Amadeus prices
        const discountedPrice = originalPrice * 0.75;
        
        return {
            id: offer.id,
            source: 'Amadeus',
            price: discountedPrice,
            currency: offer.price.currency,
            itineraries: offer.itineraries.map((itinerary: any) => ({
                duration: itinerary.duration,
                segments: itinerary.segments.map((segment: any) => ({
                    departure: {
                        iataCode: segment.departure.iataCode,
                        at: segment.departure.at,
                        terminal: segment.departure.terminal,
                    },
                    arrival: {
                        iataCode: segment.arrival.iataCode,
                        at: segment.arrival.at,
                        terminal: segment.arrival.terminal,
                    },
                    carrierCode: segment.carrierCode,
                    flightNumber: segment.number,
                    duration: segment.duration,
                })),
            })),
        };
    });
}

export function normalizeTravelpayoutsResponse(travelpayoutsData: any): UnifiedFlightOffer[] {
    if (!travelpayoutsData) return [];

    // The API may return either a single object or an array of objects.
    const dataArray = Array.isArray(travelpayoutsData) ? travelpayoutsData : [travelpayoutsData];

    const allOffers: UnifiedFlightOffer[] = [];

    dataArray.forEach((resultSet: any) => {
        if (!resultSet.proposals || !resultSet.segments) return;

        const segmentsById = resultSet.segments.reduce((acc: any, segment: any) => {
            acc[segment.id] = segment;
            return acc;
        }, {});

        resultSet.proposals.forEach((proposal: any) => {
            const termKey = Object.keys(proposal.terms)[0];
            const term = proposal.terms[termKey];

            const offer: UnifiedFlightOffer = {
                id: `tp-${proposal.sign}`,
                source: 'Travelpayouts',
                price: parseFloat(term.price),
                currency: (term.currency || 'USD').toUpperCase(),
                itineraries: proposal.segment.map((itinerarySegments: any) => ({
                    duration: 'PT' + itinerarySegments.reduce((totalMinutes: number, segmentId: string) => {
                        const segmentDetails = segmentsById[segmentId];
                        // duration is in minutes in travelpayouts response
                        return totalMinutes + (segmentDetails?.duration || 0);
                    }, 0) + 'M',
                    segments: itinerarySegments.map((segmentId: string) => {
                        const segmentDetails = segmentsById[segmentId];
                        return {
                            departure: {
                                iataCode: segmentDetails?.departure,
                                at: segmentDetails?.departure_time,
                            },
                            arrival: {
                                iataCode: segmentDetails?.arrival,
                                at: segmentDetails?.arrival_time,
                            },
                            carrierCode: segmentDetails?.airline,
                            flightNumber: segmentDetails?.flight_number,
                            duration: segmentDetails ? `PT${segmentDetails.duration}M` : '',
                        };
                    }),
                })),
            };
            allOffers.push(offer);
        });
    });

    return allOffers;
} 