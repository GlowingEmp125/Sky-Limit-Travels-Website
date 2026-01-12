// Simple test script for the improved Amadeus implementation
// Run with: node test-amadeus-improved.js

const { searchFlightOffers } = require('./lib/amadeus-improved');

async function testFlightSearch() {
  console.log('🧪 Testing improved Amadeus implementation...\n');

  const testParams = {
    originLocationCode: 'LHR',
    destinationLocationCode: 'JFK',
    departureDate: '2024-12-15',
    adults: 1,
    currencyCode: 'GBP',
    max: 5
  };

  console.log('📋 Test parameters:', testParams);
  console.log('⏳ Searching for flights...\n');

  try {
    const startTime = Date.now();
    const result = await searchFlightOffers(testParams);
    const endTime = Date.now();

    console.log('✅ Search completed in', endTime - startTime, 'ms');
    console.log('📊 Results:');
    console.log('  - Flight count:', result.data?.length || 0);
    console.log('  - Has meta data:', !!result.meta);
    console.log('  - Has dictionaries:', !!result.dictionaries);

    if (result.data && result.data.length > 0) {
      const firstFlight = result.data[0];
      console.log('\n🛫 First flight sample:');
      console.log('  - ID:', firstFlight.id);
      console.log('  - Price:', firstFlight.price?.total, firstFlight.price?.currency);
      console.log('  - Itineraries:', firstFlight.itineraries?.length);
      console.log('  - Source:', firstFlight.source);
    }

    console.log('\n🎉 Test completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('📝 Error details:', {
      code: error.code,
      description: error.description
    });
    return false;
  }
}

// Run the test
if (require.main === module) {
  testFlightSearch()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { testFlightSearch }; 