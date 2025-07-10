import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCryptoChart } from "@/lib/coingecko";
import { 
  Chart, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  LineController,
  Title, 
  Tooltip, 
  Legend, 
  TimeScale,
  Filler
} from "chart.js";
import 'chartjs-adapter-date-fns';

Chart.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  LineController,
  Title, 
  Tooltip, 
  Legend, 
  TimeScale,
  Filler
);

interface CryptoChartProps {
  cryptoId: string;
  cryptoName: string;
  isPositive: boolean;
}

export function CryptoChart({ cryptoId, cryptoName, isPositive }: CryptoChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("1");
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const { data: chartData, isLoading, error } = useQuery({
    queryKey: ["/api/crypto", cryptoId, "chart", selectedPeriod],
    queryFn: () => fetchCryptoChart(cryptoId, selectedPeriod),
    refetchInterval: 5000, // Real-time updates every 5 seconds
  });

  useEffect(() => {
    if (!chartRef.current || !chartData) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const labels = chartData.map(point => new Date(point.timestamp));
    const prices = chartData.map(point => point.price);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${cryptoName} Price`,
          data: prices,
          borderColor: isPositive ? '#00ff88' : '#ff4444',
          backgroundColor: 'transparent',
          borderWidth: 2,
          fill: false,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: isPositive ? '#00ff88' : '#ff4444',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1,
          pointHoverBorderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
            borderWidth: 2,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (context) => {
                return `Price: $${context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`;
              },
              title: (context) => {
                const date = new Date(context[0].parsed.x);
                return date.toLocaleString();
              }
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: selectedPeriod === "1" ? 'hour' : 'day',
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.08)',
              drawBorder: false,
              lineWidth: 1,
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.5)',
              maxTicksLimit: 6,
              font: {
                size: 11,
                family: 'monospace'
              }
            },
            border: {
              display: false
            }
          },
          y: {
            position: 'right',
            grid: {
              color: 'rgba(255, 255, 255, 0.08)',
              drawBorder: false,
              lineWidth: 1,
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.5)',
              callback: function(value) {
                const num = value as number;
                if (num >= 1000000) {
                  return '$' + (num / 1000000).toFixed(2) + 'M';
                } else if (num >= 1000) {
                  return '$' + (num / 1000).toFixed(1) + 'K';
                } else if (num >= 1) {
                  return '$' + num.toLocaleString(undefined, { maximumFractionDigits: 2 });
                } else {
                  return '$' + num.toFixed(6);
                }
              },
              maxTicksLimit: 8,
              font: {
                size: 11,
                family: 'monospace'
              }
            },
            border: {
              display: false
            }
          }
        },
        elements: {
          point: {
            hoverRadius: 8
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData, cryptoName, isPositive, selectedPeriod]);

  const periods = [
    { value: "1", label: "1D" },
    { value: "7", label: "7D" },
    { value: "30", label: "30D" },
    { value: "90", label: "90D" },
    { value: "365", label: "1Y" },
  ];

  if (isLoading) {
    return (
      <div className="h-full w-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-white/20 mb-4">Loading chart...</div>
          <div className="w-16 h-16 border-4 border-white/10 border-t-white/30 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full bg-black flex items-center justify-center">
        <div className="text-center text-white/50">
          <div className="text-6xl mb-4">⚠</div>
          <div>Chart data temporarily unavailable</div>
          <div className="text-sm opacity-50 mt-2">Retrying automatically...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black relative">
      {/* Time Period Controls - Top Right */}
      <div className="absolute top-4 right-4 z-20 flex space-x-1">
        {periods.map((period) => (
          <Button
            key={period.value}
            variant={selectedPeriod === period.value ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedPeriod(period.value)}
            className="h-8 px-3 bg-black/50 text-white/70 hover:text-white border-white/20"
          >
            {period.label}
          </Button>
        ))}
      </div>

      {/* Full Screen Chart */}
      <div className="h-full w-full">
        <canvas ref={chartRef} className="w-full h-full" />
      </div>
    </div>
  );
}
