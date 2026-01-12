import { NextResponse } from 'next/server';
import { searchFlights } from '@/lib/travelpayouts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userIp = request.headers.get('x-forwarded-for') ?? '127.0.0.1';

    const { segments, adults, children, infants, trip_class } = body;

    if (!segments || !Array.isArray(segments) || segments.length === 0) {
      return NextResponse.json({ message: 'Missing or invalid segments' }, { status: 400 });
    }

    const searchParams = {
        segments,
        adults,
        children,
        infants,
        trip_class,
    };

    const data = await searchFlights(searchParams, userIp);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[TRAVELPAYOUTS_FLIGHT_SEARCH_API]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 