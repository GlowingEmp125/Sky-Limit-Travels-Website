const { getPopularFlights } = require('./lib/amadeus.ts');

async function testPopularFlights() {
  console.log('Testing getPopularFlights function directly...');
  
  try {
    const flights = await getPopularFlights();
    console.log('✅ Function completed');
    console.log('Number of flights:', flights.length);
    console.log('First flight ID:', flights[0]?.id);
    console.log('First flight city:', flights[0]?.cityName);
    console.log('Is static data:', flights[0]?.id?.startsWith('static-'));
  } catch (error) {
    console.error('❌ Function failed:', error);
  }
}

testPopularFlights(); 