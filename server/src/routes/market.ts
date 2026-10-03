import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();
const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";
const CACHE_TTL_MS = 600_000;
const cache = new Map<string, { body: string; contentType: string; expiresAt: number }>();

async function proxyCoinGecko(path: string, res: Response, req: Request) {
  const cached = cache.get(path);
  if (cached && cached.expiresAt > Date.now()) {
    res.status(200);
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
    res.type(cached.contentType).send(cached.body);
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(`${COINGECKO_BASE_URL}${path}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    const body = await response.text();

    res.status(response.status);
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
    const contentType = response.headers.get("content-type") ?? "application/json";
    if (response.ok) {
      cache.set(path, { body, contentType, expiresAt: Date.now() + CACHE_TTL_MS });
    }
    res.type(contentType).send(body);
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "AbortError";
    req.log.warn({ err: error, path }, "CoinGecko proxy request failed");
    res.status(502).json({
      error: isTimeout
        ? "The market feed took too long to respond."
        : "Unable to reach the market feed.",
    });
  } finally {
    clearTimeout(timeout);
  }
}

router.get("/market/coins", async (req, res) => {
  const params = new URLSearchParams({
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: "10",
    page: "1",
  });

  await proxyCoinGecko(`/coins/markets?${params.toString()}`, res, req);
});

router.get("/market/global", async (req, res) => {
  await proxyCoinGecko("/global", res, req);
});

router.get("/market/coins/:id/chart", async (req, res) => {
  const { id } = req.params;
  if (!/^[a-z0-9-]+$/i.test(id)) {
    res.status(400).json({ error: "Invalid coin id." });
    return;
  }

  const params = new URLSearchParams({
    vs_currency: "usd",
    days: "7",
  });

  await proxyCoinGecko(
    `/coins/${encodeURIComponent(id)}/market_chart?${params.toString()}`,
    res,
    req,
  );
});

export default router;