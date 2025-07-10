import { pgTable, text, serial, real, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const cryptoData = pgTable("crypto_data", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  price: real("price").notNull(),
  priceChange24h: real("price_change_24h").notNull(),
  marketCap: real("market_cap").notNull(),
  volume24h: real("volume_24h").notNull(),
  image: text("image").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const marketStats = pgTable("market_stats", {
  id: serial("id").primaryKey(),
  totalMarketCap: real("total_market_cap").notNull(),
  totalVolume: real("total_volume").notNull(),
  btcDominance: real("btc_dominance").notNull(),
  activeCryptos: integer("active_cryptos").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCryptoDataSchema = createInsertSchema(cryptoData);
export const insertMarketStatsSchema = createInsertSchema(marketStats);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CryptoData = typeof cryptoData.$inferSelect;
export type InsertCryptoData = z.infer<typeof insertCryptoDataSchema>;
export type MarketStats = typeof marketStats.$inferSelect;
export type InsertMarketStats = z.infer<typeof insertMarketStatsSchema>;
