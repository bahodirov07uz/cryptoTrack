import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CryptoData } from "@/types/crypto";
import { useLocation } from "wouter";

interface CryptoCardProps {
  crypto: CryptoData;
  index: number;
}

export function CryptoCard({ crypto, index }: CryptoCardProps) {
  const [, setLocation] = useLocation();

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    return `$${price.toFixed(6)}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    return `$${volume.toLocaleString()}`;
  };

  const isPositive = crypto.priceChange24h >= 0;

  return (
    <Card 
      className="crypto-card cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={() => setLocation(`/crypto/${crypto.id}`)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={crypto.image} 
              alt={crypto.name} 
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/40/4A5568/FFFFFF?text=' + crypto.symbol.charAt(0);
              }}
            />
            <div>
              <h3 className="font-semibold text-lg">{crypto.name}</h3>
              <p className="text-sm text-muted-foreground">{crypto.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">{formatPrice(crypto.price)}</p>
            <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
              {Math.abs(crypto.priceChange24h).toFixed(2)}%
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Market Cap</span>
            <span className="font-medium">{formatMarketCap(crypto.marketCap)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">24h Volume</span>
            <span className="font-medium">{formatVolume(crypto.volume24h)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
