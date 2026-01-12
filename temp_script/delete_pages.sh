#!/bin/bash

# Regional destination pages
echo "Removing regional destination pages..."
rm -rf app/destinations/europe
rm -rf app/destinations/americas
rm -rf app/destinations/asia
rm -rf app/destinations/africa
rm -rf app/destinations/oceania

# Country-specific flight pages
echo "Removing country-specific flight pages..."
rm -rf app/flights/countries/france
rm -rf app/flights/countries/italy
rm -rf app/flights/countries/spain
rm -rf app/flights/countries/greece
rm -rf app/flights/countries/turkey
rm -rf app/flights/countries/croatia
rm -rf app/flights/countries/portugal

# Main destinations page
echo "Removing main destinations page..."
rm -f app/destinations/page.tsx

echo "Removal complete!" 