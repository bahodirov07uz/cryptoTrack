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
    <div className="min-h-screen bg-black">
      {/* Minimal Header with Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="text-white/70 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Price Ticker Bar */}
      {crypto && (
        <div className="absolute top-4 right-4 z-50 flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
          <div className="flex items-center space-x-2">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-6 h-6 rounded-full"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/24/4A5568/FFFFFF?text=' + crypto.symbol.charAt(0);
              }}
            />
            <span className="text-white font-medium">{crypto.symbol}</span>
          </div>
          <div className="text-white font-bold text-lg">{formatPrice(crypto.price)}</div>
          <div className={`flex items-center text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
            {Math.abs(crypto.priceChange24h).toFixed(2)}%
          </div>
          <Badge variant="outline" className="border-green-400 text-green-400">
            <Clock className="w-3 h-3 mr-1" />
            LIVE
          </Badge>
        </div>
      )}

      {error && (
        <div className="absolute top-20 left-4 z-50">
          <Alert className="bg-red-900/20 border-red-500">
            <AlertDescription className="text-red-400">
              Failed to load cryptocurrency details. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Full Screen Chart */}
      <main className="h-screen w-full relative">
        {crypto && (
          <div className="h-full w-full relative">
            {/* Crypto Symbol Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-8xl md:text-9xl font-bold text-white/5 select-none">
                {crypto.symbol}
              </div>
            </div>
            
            {/* Chart Container */}
            <div className="h-full w-full">
              <CryptoChart 
                cryptoId={crypto.id} 
                cryptoName={crypto.name} 
                isPositive={isPositive}
              />
            </div>
          </div>
        )}
        
        {isLoading && (
          <div className="h-full w-full flex items-center justify-center bg-black">
            <div className="text-center">
              <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4 bg-white/10" />
              <div className="text-white/50">Loading chart data...</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
