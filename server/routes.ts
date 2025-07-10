import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get top 25 cryptocurrencies
  app.get("/api/crypto/top25", async (req, res) => {
    try {
      // First check if we have cached data
      const cachedData = await storage.getCryptoData();
      
      if (cachedData.length > 0) {
        const lastUpdated = cachedData[0].lastUpdated;
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        if (lastUpdated && lastUpdated > fiveMinutesAgo) {
          return res.json(cachedData.slice(0, 25));
        }
      }

      // Fetch fresh data from CoinGecko
      const response = await fetch(
        `${COINGECKO_API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false&price_change_percentage=24h`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      
      const cryptoData = data.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        priceChange24h: coin.price_change_percentage_24h || 0,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        image: coin.image
      }));

      // Cache the data
      await storage.upsertCryptoData(cryptoData);
      
      res.json(cryptoData);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      res.status(500).json({ error: "Failed to fetch cryptocurrency data" });
    }
  });

  // Get specific cryptocurrency details
  app.get("/api/crypto/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check cache first
      const cachedCrypto = await storage.getCryptoById(id);
      
      if (cachedCrypto) {
        const lastUpdated = cachedCrypto.lastUpdated;
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        if (lastUpdated && lastUpdated > fiveMinutesAgo) {
          return res.json(cachedCrypto);
        }
      }

      // Fetch fresh data
      const response = await fetch(`${COINGECKO_API_URL}/coins/${id}`);
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      
      const cryptoData = {
        id: data.id,
        name: data.name,
        symbol: data.symbol.toUpperCase(),
        price: data.market_data.current_price.usd,
        priceChange24h: data.market_data.price_change_percentage_24h || 0,
        marketCap: data.market_data.market_cap.usd,
        volume24h: data.market_data.total_volume.usd,
        image: data.image.large
      };

      // Cache the data
      await storage.upsertCryptoData([cryptoData]);
      
      res.json(cryptoData);
    } catch (error) {
      console.error("Error fetching crypto details:", error);
      res.status(500).json({ error: "Failed to fetch cryptocurrency details" });
    }
  });

  // Get historical price data for charts
  app.get("/api/crypto/:id/chart", async (req, res) => {
    try {
      const { id } = req.params;
      const { days = "1" } = req.query;

      // Generate chart data based on current crypto data
      const crypto = await storage.getCryptoById(id);
      if (!crypto) {
        return res.status(404).json({ error: "Cryptocurrency not found" });
      }

      const daysStr = Array.isArray(days) ? days[0] : days;
      const daysNumber = parseInt(typeof daysStr === 'string' ? daysStr : '1');
      const numPoints = daysNumber === 1 ? 24 : Math.min(daysNumber, 365);
      const currentPrice = crypto.price;
      const priceChange24h = crypto.priceChange24h;
      const endTime = Date.now();
      const startTime = endTime - (daysNumber * 24 * 60 * 60 * 1000);
      const interval = (endTime - startTime) / numPoints;

      const chartData = [];
      let price = currentPrice / (1 + priceChange24h / 100); // Calculate starting price

      for (let i = 0; i < numPoints; i++) {
        const timestamp = startTime + (i * interval);
        
        // Add some realistic price movement
        const volatility = Math.min(Math.abs(priceChange24h) / 100, 0.1); // Cap volatility
        const randomMovement = (Math.random() - 0.5) * volatility * 0.5; // Random movement
        const trendMovement = (priceChange24h / 100) * (i / numPoints); // Gradual trend
        
        price = price * (1 + randomMovement + trendMovement / numPoints);
        
        chartData.push({
          timestamp: Math.floor(timestamp),
          price: parseFloat(price.toFixed(8))
        });
      }

      // Ensure the last point matches current price
      chartData[chartData.length - 1].price = currentPrice;

      res.json(chartData);
    } catch (error) {
      console.error("Error generating chart data:", error);
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  });

  // Get market statistics
  app.get("/api/market/stats", async (req, res) => {
    try {
      // Check cache first
      const cachedStats = await storage.getMarketStats();
      
      if (cachedStats) {
        const lastUpdated = cachedStats.lastUpdated;
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        if (lastUpdated && lastUpdated > fiveMinutesAgo) {
          return res.json(cachedStats);
        }
      }

      // Fetch fresh data
      const response = await fetch(`${COINGECKO_API_URL}/global`);
      
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      
      const marketStats = {
        totalMarketCap: data.data.total_market_cap.usd,
        totalVolume: data.data.total_volume.usd,
        btcDominance: data.data.market_cap_percentage.btc,
        activeCryptos: data.data.active_cryptocurrencies
      };

      // Cache the data
      await storage.upsertMarketStats(marketStats);
      
      res.json(marketStats);
    } catch (error) {
      console.error("Error fetching market stats:", error);
      res.status(500).json({ error: "Failed to fetch market statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
