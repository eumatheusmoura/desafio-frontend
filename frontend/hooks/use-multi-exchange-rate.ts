import { useState, useEffect, useCallback } from "react";

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

interface UseMultiExchangeRateReturn {
  getRate: (currency: string) => number | null;
  isLoading: (currency: string) => boolean;
  getError: (currency: string) => string | null;
  getLastUpdate: (currency: string) => string | null;
  preloadCurrency: (currency: string) => void;
  fetchImmediately: (currency: string) => void;
}

  const CACHE_DURATION = 60000;
const cache = new Map<string, { data: ExchangeRateData; timestamp: number }>();
const loadingStates = new Map<string, boolean>();
const errorStates = new Map<string, string | null>();

export function useMultiExchangeRate(): UseMultiExchangeRateReturn {
  const [, forceUpdate] = useState({});

  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  const fetchExchangeRate = useCallback(
    async (currency: string) => {
      const cacheKey = `BTC${currency}`;
      const now = Date.now();
      const cachedData = cache.get(cacheKey);

      if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
        loadingStates.set(currency, false);
        errorStates.set(currency, null);
        triggerUpdate();
        return;
      }

      try {
        loadingStates.set(currency, true);
        errorStates.set(currency, null);
        triggerUpdate();

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

        loadingStates.set(currency, false);
        errorStates.set(currency, null);
        triggerUpdate();
      } catch (err) {
        console.error(`Erro ao buscar cotação ${currency}:`, err);
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";

        loadingStates.set(currency, false);
        errorStates.set(currency, errorMessage);
        triggerUpdate();
      }
    },
    [triggerUpdate]
  );

  useEffect(() => {
    const currencies = ["BRL", "USD", "EUR"];
    currencies.forEach((currency) => {
      fetchExchangeRate(currency);
    });
  }, [fetchExchangeRate]);

  const getRate = useCallback((currency: string): number | null => {
    const cacheKey = `BTC${currency}`;
    const cachedData = cache.get(cacheKey);
    const now = Date.now();

          if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
        let rate = parseFloat(cachedData.data.high);

        if (rate < 1) {
          console.log("⚠️ Cotação muito baixa, tentando campo 'bid':", rate);
          rate = parseFloat(cachedData.data.bid);
        }

      console.log("📊 API Exchange Rate Data:", {
        currency,
        bid: cachedData.data.bid,
        ask: cachedData.data.ask,
        high: cachedData.data.high,
        low: cachedData.data.low,
        rateUsed: rate,
        rateType: typeof rate,
        rateValid: rate > 1,
      });

      return rate;
    }

    return null;
  }, []);

  const isLoading = useCallback((currency: string): boolean => {
    return loadingStates.get(currency) || false;
  }, []);

  const getError = useCallback((currency: string): string | null => {
    return errorStates.get(currency) || null;
  }, []);

  const getLastUpdate = useCallback((currency: string): string | null => {
    const cacheKey = `BTC${currency}`;
    const cachedData = cache.get(cacheKey);
    const now = Date.now();

    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data.create_date;
    }

    return null;
  }, []);

  const preloadCurrency = useCallback(
    (currency: string) => {
      const rate = getRate(currency);
      const loading = isLoading(currency);

      if (!rate && !loading) {
        fetchExchangeRate(currency);
      }
    },
    [getRate, isLoading, fetchExchangeRate]
  );

  const fetchImmediately = useCallback(
    (currency: string) => {
      const cacheKey = `BTC${currency}`;
      cache.delete(cacheKey);
      fetchExchangeRate(currency);
    },
    [fetchExchangeRate]
  );

  return {
    getRate,
    isLoading,
    getError,
    getLastUpdate,
    preloadCurrency,
    fetchImmediately,
  };
}
