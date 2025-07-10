import { cryptoData, marketStats, type CryptoData, type MarketStats, type InsertCryptoData, type InsertMarketStats } from "@shared/schema";

export interface IStorage {
  // Crypto data operations
  getCryptoData(): Promise<CryptoData[]>;
  getCryptoById(id: string): Promise<CryptoData | undefined>;
  upsertCryptoData(data: InsertCryptoData[]): Promise<void>;
  
  // Market stats operations
  getMarketStats(): Promise<MarketStats | undefined>;
  upsertMarketStats(stats: InsertMarketStats): Promise<void>;
}

export class MemStorage implements IStorage {
  private cryptos: Map<string, CryptoData>;
  private marketStatsData: MarketStats | undefined;

  constructor() {
    this.cryptos = new Map();
    this.marketStatsData = undefined;
  }

  async getCryptoData(): Promise<CryptoData[]> {
    return Array.from(this.cryptos.values()).sort((a, b) => b.marketCap - a.marketCap);
  }

  async getCryptoById(id: string): Promise<CryptoData | undefined> {
    return this.cryptos.get(id);
  }

  async upsertCryptoData(data: InsertCryptoData[]): Promise<void> {
    data.forEach(crypto => {
      const cryptoWithTimestamp: CryptoData = {
        ...crypto,
        lastUpdated: new Date()
      };
      this.cryptos.set(crypto.id, cryptoWithTimestamp);
    });
  }

  async getMarketStats(): Promise<MarketStats | undefined> {
    return this.marketStatsData;
  }

  async upsertMarketStats(stats: InsertMarketStats): Promise<void> {
    this.marketStatsData = {
      id: 1,
      ...stats,
      lastUpdated: new Date()
    };
  }
}

export const storage = new MemStorage();
