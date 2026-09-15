import { useCallback, useEffect, useState } from 'react';
import { getCoinChart, type ChartPoint, type MarketApiError } from '@/lib/market-api';

export function useCoinChart(id: string) {
  const [points, setPoints] = useState<ChartPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<MarketApiError | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setPoints(await getCoinChart(id));
    } catch (nextError) {
      setError(nextError as MarketApiError);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return { points, isLoading, error, refetch: load };
}
