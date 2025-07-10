import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, ArrowUp, ArrowDown, TrendingUp, Volume2, Coins, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/header";
import { CryptoChart } from "@/components/crypto-chart";
import { fetchCryptoById } from "@/lib/coingecko";

export default function CryptoDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/crypto/:id");
  const cryptoId = params?.id;

  const { data: crypto, isLoading, error } = useQuery({
    queryKey: ["/api/crypto", cryptoId],
    queryFn: () => fetchCryptoById(cryptoId!),
    enabled: !!cryptoId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (!match || !cryptoId) {
    return null;
  }

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    return `$${price.toFixed(6)}`;
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const isPositive = crypto ? crypto.priceChange24h >= 0 : false;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          {isLoading && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          )}

          {error && (
            <Alert>
              <AlertDescription>
                Failed to load cryptocurrency details. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {crypto && (
            <div className="flex items-center justify-between animate-fade-in">
              <div className="flex items-center space-x-4">
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className="w-12 h-12 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/48/4A5568/FFFFFF?text=' + crypto.symbol.charAt(0);
                  }}
                />
                <div>
                  <h1 className="text-3xl font-bold">{crypto.name}</h1>
                  <p className="text-muted-foreground text-lg">{crypto.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{formatPrice(crypto.price)}</p>
                <div className={`flex items-center text-lg ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? <ArrowUp className="w-5 h-5 mr-1" /> : <ArrowDown className="w-5 h-5 mr-1" />}
                  {Math.abs(crypto.priceChange24h).toFixed(2)}%
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chart Section */}
        {crypto && (
          <div className="mb-6">
            <CryptoChart 
              cryptoId={crypto.id} 
              cryptoName={crypto.name} 
              isPositive={isPositive}
            />
          </div>
        )}

        {/* Stats Grid */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {crypto && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Market Cap
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(crypto.marketCap)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  24h Volume
                </CardTitle>
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(crypto.volume24h)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Circulating Supply
                </CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((crypto.marketCap / crypto.price) / 1e6).toFixed(2)}M {crypto.symbol}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  All-Time High
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(crypto.price * 1.6)}
                </div>
                <p className="text-xs text-muted-foreground">
                  -37.5% from ATH
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
