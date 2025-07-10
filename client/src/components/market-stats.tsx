import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Volume2, Bitcoin, Coins } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMarketStats } from "@/lib/coingecko";

export function MarketStats() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["/api/market/stats"],
    queryFn: fetchMarketStats,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="crypto-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="crypto-card">
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">
              Failed to load market statistics
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="crypto-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Market Cap</p>
              <p className="text-2xl font-bold">{formatCurrency(stats?.totalMarketCap || 0)}</p>
              <p className="text-sm text-green-500">+2.4%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card className="crypto-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">24h Volume</p>
              <p className="text-2xl font-bold">{formatCurrency(stats?.totalVolume || 0)}</p>
              <p className="text-sm text-red-500">-1.2%</p>
            </div>
            <Volume2 className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="crypto-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">BTC Dominance</p>
              <p className="text-2xl font-bold">{stats?.btcDominance?.toFixed(1) || 0}%</p>
              <p className="text-sm text-green-500">+0.3%</p>
            </div>
            <Bitcoin className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="crypto-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Cryptos</p>
              <p className="text-2xl font-bold">{stats?.activeCryptos?.toLocaleString() || 0}</p>
              <p className="text-sm text-green-500">+12</p>
            </div>
            <Coins className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
