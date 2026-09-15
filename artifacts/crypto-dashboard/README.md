# Crypto Dashboard

Responsive crypto market dashboard built with React, TypeScript, Vite, Tailwind CSS, Axios, and Recharts.

## Features

- Live top-10 crypto assets by market capitalization
- Total market cap, 24-hour volume, and Bitcoin dominance
- Responsive market table that becomes mobile-friendly cards
- Coin detail pages at `/coin/:id`
- Seven-day price charts powered by Recharts
- Separate loading and error states for market data and charts
- Retry handling for timeouts, network errors, and CoinGecko rate limits
- Same-origin API proxy to avoid browser CORS restrictions

## Development

From the repository root:

```bash
pnpm install
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/crypto-dashboard run dev
```

The frontend uses the shared API service at `/api/market`. The API service forwards read-only requests to CoinGecko and does not require an API key.

## Production build

```bash
pnpm --filter @workspace/crypto-dashboard run build
```

The static output is written to `dist/public` inside the artifact.

## Data source

Market data is provided by [CoinGecko](https://www.coingecko.com/en/api). Public API availability and rate limits apply. Prices may be delayed.