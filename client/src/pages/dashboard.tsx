import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { MarketStats } from "@/components/market-stats";
import { CryptoCard } from "@/components/crypto-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Clock } from "lucide-react";
import { fetchTop25Cryptos } from "@/lib/coingecko";

export default function Dashboard() {
  const { 
    data: cryptos, 
    isLoading, 
    error, 
    dataUpdatedAt 
  } = useQuery({
    queryKey: ["/api/crypto/top25"],
    queryFn: fetchTop25Cryptos,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const lastUpdated = new Date(dataUpdatedAt).toLocaleTimeString();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MarketStats />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Top 25 Cryptocurrencies</h2>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last updated: {lastUpdated}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load cryptocurrency data. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {[...Array(25)].map((_, i) => (
              <div key={i} className="crypto-card">
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-20 mb-1" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-5 w-24 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Crypto Grid */}
        {cryptos && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-fade-in">
            {cryptos.map((crypto, index) => (
              <CryptoCard key={crypto.id} crypto={crypto} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {cryptos && cryptos.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No cryptocurrency data available</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
