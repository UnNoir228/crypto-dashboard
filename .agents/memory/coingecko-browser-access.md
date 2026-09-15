---
name: CoinGecko browser access
description: Why the app uses a same-origin proxy for CoinGecko market data.
---

Public CoinGecko endpoints may reject direct browser requests from the Replit preview origin because the response does not include an appropriate CORS header. The stable pattern is a read-only same-origin proxy in the shared API service, with a short timeout, a validated coin id for path-based requests, and brief cache headers.

**Why:** The dashboard loaded successfully from cached data on one screen but failed on direct detail navigation when the browser enforced CORS, so direct client calls are not reliable in this environment.

**How to apply:** For browser-based CoinGecko features, call the local `/api/market` endpoints from the frontend and keep the external request inside the API service. No CoinGecko API key is required for the public endpoints used here.