import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, ArrowUp, ArrowDown, TrendingUp, Volume2, Coins, Target, BarChart3, LineChart, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
    refetchInterval: 5000, // Real-time updates every 5 seconds
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
      
      <main className="max-w-full px-4 py-4">
        {/* Top Navigation */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {error && (
          <Alert className="mb-6">
            <AlertDescription>
              Failed to load cryptocurrency details. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Trading Interface Layout */}
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-140px)]">
          
          {/* Left Sidebar - Crypto Info & Stats */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            
            {/* Crypto Header */}
            {isLoading ? (
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div>
                    <Skeleton className="h-6 w-24 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </Card>
            ) : crypto && (
              <Card className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-10 h-10 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/40/4A5568/FFFFFF?text=' + crypto.symbol.charAt(0);
                    }}
                  />
                  <div>
                    <h1 className="text-xl font-bold">{crypto.name}</h1>
                    <p className="text-muted-foreground">{crypto.symbol}</p>
                  </div>
                </div>
                
                {/* Real-time Price */}
                <div className="mb-4">
                  <div className="text-3xl font-bold mb-1">{formatPrice(crypto.price)}</div>
                  <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                    {Math.abs(crypto.priceChange24h).toFixed(2)}%
                    <Badge variant="secondary" className="ml-2">
                      <Clock className="w-3 h-3 mr-1" />
                      LIVE
                    </Badge>
                  </div>
                </div>
              </Card>
            )}

            {/* Market Stats */}
            {crypto && (
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Market Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Market Cap</span>
                    <span className="font-medium text-sm">{formatCurrency(crypto.marketCap)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">24h Volume</span>
                    <span className="font-medium text-sm">{formatCurrency(crypto.volume24h)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Circulating Supply</span>
                    <span className="font-medium text-sm">
                      {((crypto.marketCap / crypto.price) / 1e6).toFixed(2)}M {crypto.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">All-Time High</span>
                    <div className="text-right">
                      <div className="font-medium text-sm">{formatPrice(crypto.price * 1.6)}</div>
                      <div className="text-xs text-red-500">-37.5%</div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Trading Controls */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Chart Controls</h3>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <LineChart className="w-4 h-4 mr-1" />
                    Line
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Candle
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm">1M</Button>
                  <Button variant="outline" size="sm">5M</Button>
                  <Button variant="outline" size="sm">15M</Button>
                  <Button variant="outline" size="sm">1H</Button>
                  <Button variant="default" size="sm">4H</Button>
                  <Button variant="outline" size="sm">1D</Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Chart Area */}
          <div className="col-span-12 lg:col-span-9">
            {crypto && (
              <div className="h-full">
                <CryptoChart 
                  cryptoId={crypto.id} 
                  cryptoName={crypto.name} 
                  isPositive={isPositive}
                />
              </div>
            )}
            
            {isLoading && (
              <Card className="h-full">
                <CardContent className="p-6 h-full">
                  <Skeleton className="h-full w-full" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
