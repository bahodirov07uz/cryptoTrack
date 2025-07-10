import { CryptoData, MarketStats, ChartData } from "@/types/crypto";

export const fetchTop25Cryptos = async (): Promise<CryptoData[]> => {
  const response = await fetch("/api/crypto/top25");
  if (!response.ok) {
    throw new Error("Failed to fetch cryptocurrencies");
  }
  return response.json();
};

export const fetchCryptoById = async (id: string): Promise<CryptoData> => {
  const response = await fetch(`/api/crypto/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch cryptocurrency: ${id}`);
  }
  return response.json();
};

export const fetchCryptoChart = async (id: string, days: string = "1"): Promise<ChartData[]> => {
  const response = await fetch(`/api/crypto/${id}/chart?days=${days}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch chart data for: ${id}`);
  }
  return response.json();
};

export const fetchMarketStats = async (): Promise<MarketStats> => {
  const response = await fetch("/api/market/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch market statistics");
  }
  return response.json();
};
