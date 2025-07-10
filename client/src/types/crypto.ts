export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  image: string;
  lastUpdated?: Date;
}

export interface MarketStats {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  activeCryptos: number;
  lastUpdated?: Date;
}

export interface ChartData {
  timestamp: number;
  price: number;
}
