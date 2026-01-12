# Sky Limit Travels Website

A modern travel booking platform built with Next.js and Tailwind CSS.

## Setting Up Amadeus API for Production

### 1. Environment Configuration

Copy the `.env.example` file to create your own `.env` file:

```bash
cp .env.example .env
```

Add your Amadeus production API credentials to the `.env` file:

```
AMADEUS_CLIENT_ID=your_production_client_id
AMADEUS_CLIENT_SECRET=your_production_client_secret
ADMIN_PASSWORD=secure_password_for_admin_access
CACHE_DURATION_DAYS=3
```

### 2. Cost-Effective API Usage

Our implementation includes several measures to keep API usage costs minimal:

- **Extensive Caching**: All API responses are cached for 3 days by default (configurable via `CACHE_DURATION_DAYS`).
- **Minimal API Parameters**: Only essential parameters are used to reduce processing costs.
- **Result Limiting**: API requests return only 5 results per search to minimize data transfer.
- **Single Representative Endpoints**: When searching flights to countries, we use a single major airport per country.

### 3. Cache Management

To manage the cache and keep costs low:

#### 3.1 Viewing Cache Statistics

Make a GET request with Basic Authentication:

```bash
curl -X GET -u "admin:YOUR_ADMIN_PASSWORD" "https://yoursite.com/api/admin/cache"
```

#### 3.2 Clearing Cache

Clear the cache with a POST request:

```bash
# Clear all cache
curl -X POST -u "admin:YOUR_ADMIN_PASSWORD" "https://yoursite.com/api/admin/cache?all=true"

# Clear cache older than 7 days
curl -X POST -u "admin:YOUR_ADMIN_PASSWORD" "https://yoursite.com/api/admin/cache?days=7"
```

### 4. Local Development

To run the project locally:

```bash
npm install
npm run dev
```

The site will be available at http://localhost:3000

### 5. Production Deployment

This project is optimised for deployment on Vercel. Add the environment variables in the Vercel dashboard under Project Settings > Environment Variables.

## Features

- Flight search and booking
- Destination guides
- Responsive design
- Accessible interface

## Technology Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Amadeus Travel API 