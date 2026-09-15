# Signal Market

Signal Market is a responsive crypto dashboard for scanning live market leaders, global metrics, and seven-day asset price movement.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/crypto-dashboard run dev` — run the frontend dashboard
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env for the shared API server: `DATABASE_URL` is provided by the workspace scaffold.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React + Vite + Tailwind CSS + Axios + Recharts

## Where things live

- `artifacts/crypto-dashboard` — deployable frontend dashboard
- `artifacts/api-server/src/routes/market.ts` — same-origin CoinGecko proxy
- `artifacts/crypto-dashboard/src/lib/market-api.ts` — frontend market API client and normalized data types
- `lib/api-spec/openapi.yaml` — API contract source of truth

## Architecture decisions

- CoinGecko requests go through the shared API server because direct browser requests are blocked by CoinGecko CORS policy.
- The proxy is read-only, validates coin ids, applies a 10-second timeout, and adds short response caching.
- Market overview and chart data use separate loading and error states so one slow request does not hide the rest of the interface.

## Product

- View the top ten crypto assets by market capitalization.
- See total market cap, 24-hour volume, Bitcoin dominance, and advancing asset count.
- Open a coin detail page with current stats and a seven-day Recharts price chart.
- Retry failed market and chart requests.

## User preferences

- Keep the interface information-dense but readable, with accessible controls and responsive mobile cards.

## Gotchas

- Restart both the API and frontend workflows after changing proxy or frontend runtime code.
- Run API codegen after changing `lib/api-spec/openapi.yaml`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
