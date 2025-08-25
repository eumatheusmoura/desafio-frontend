import { useState, useEffect } from "react";

interface ExchangeRateData {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  timestamp: string;
  create_date: string;
}

interface ExchangeRateResponse {
  [key: string]: ExchangeRateData;
}

interface UseExchangeRateReturn {
  rate: number | null;
  loading: boolean;
  error: string | null;
  lastUpdate: string | null;
}

const CACHE_DURATION = 60000;
const cache = new Map<string, { data: ExchangeRateData; timestamp: number }>();

export function useExchangeRate(
  currency: string = "BRL"
): UseExchangeRateReturn {
  const getInitialData = (curr: string) => {
    const cacheKey = `BTC${curr}`;
    const cachedData = cache.get(cacheKey);
    const now = Date.now();

    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      return {
        rate: parseFloat(cachedData.data.bid),
        lastUpdate: cachedData.data.create_date,
        loading: false,
      };
    }

    return {
      rate: null,
      lastUpdate: null,
      loading: true,
    };
  };

  const initialData = getInitialData(currency);

  const [rate, setRate] = useState<number | null>(initialData.rate);
  const [loading, setLoading] = useState<boolean>(initialData.loading);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(
    initialData.lastUpdate
  );

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const cacheKey = `BTC${currency}`;
        const cachedData = cache.get(cacheKey);
        const now = Date.now();

        if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
          setRate(parseFloat(cachedData.data.bid));
          setLastUpdate(cachedData.data.create_date);
          setLoading(false);
          setError(null);
          return;
        }

        setLoading(true);
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://economia.awesomeapi.com.br/json/last/BTC-${currency}`
        );

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`);
        }

        const data: ExchangeRateResponse = await response.json();
        const exchangeData = data[cacheKey];

        if (!exchangeData) {
          throw new Error(`Dados não encontrados para ${currency}`);
        }

        cache.set(cacheKey, {
          data: exchangeData,
          timestamp: now,
        });

        setRate(parseFloat(exchangeData.bid));
        setLastUpdate(exchangeData.create_date);
      } catch (err) {
        console.error("Erro ao buscar cotação:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        setRate(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRate();
  }, [currency]);

  return { rate, loading, error, lastUpdate };
}
