import axios, { AxiosError } from 'axios';

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap: number;
  total_volume: number;
}

export interface GlobalMarket {
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number };
}

export interface ChartPoint {
  timestamp: number;
  price: number;
}

export interface MarketApiError {
  status?: number;
  message: string;
  isRateLimited: boolean;
}

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

const client = axios.create({
  baseURL:
    configuredApiBaseUrl?.replace(/\/$/, '') ??
    `${import.meta.env.BASE_URL}api/market`,
  timeout: 10_000,
  headers: { Accept: 'application/json' },
});

const getApiError = (error: unknown): MarketApiError => {
  const axiosError = error as AxiosError<{ error?: string }>;
  const status = axiosError.response?.status;
  const isRateLimited = status === 429;
  if (isRateLimited) {
    return {
      status,
      isRateLimited,
      message: 'CoinGecko is rate-limiting requests right now. Wait a moment, then retry.',
    };
  }
  if (axiosError.code === 'ECONNABORTED') {
    return { status, isRateLimited: false, message: 'The market feed took too long to respond. Check your connection and retry.' };
  }
  if (!axiosError.response) {
    return { status, isRateLimited: false, message: 'Unable to reach the market feed. Check your connection and retry.' };
  }
  return {
    status,
    isRateLimited: false,
    message: axiosError.response.data?.error || 'The market feed returned an unexpected response. Please retry.',
  };
};

export async function getMarketCoins(): Promise<Coin[]> {
  try {
    const response = await client.get<Coin[]>('/coins');
    return response.data;
  } catch (error) {
    throw getApiError(error);
  }
}

export async function getGlobalMarket(): Promise<GlobalMarket> {
  try {
    const response = await client.get<{ data: GlobalMarket }>('/global');
    return response.data.data;
  } catch (error) {
    throw getApiError(error);
  }
}

export async function getCoinChart(id: string): Promise<ChartPoint[]> {
  try {
    const response = await client.get<{ prices: [number, number][] }>(`/coins/${encodeURIComponent(id)}/chart`);
    return response.data.prices.map(([timestamp, price]) => ({ timestamp, price }));
  } catch (error) {
    throw getApiError(error);
  }
}
