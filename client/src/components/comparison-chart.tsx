import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, TrendingUp } from "lucide-react";
import { SimulationParams } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from "recharts";

interface ComparisonChartProps {
  params: SimulationParams;
}

export function ComparisonChart({ params }: ComparisonChartProps) {
  const scenarios = [
    { label: "Atual", params: params },
    { label: "Sem Pico", params: { ...params, isRushHour: false } },
    { label: "Sem Chuva", params: { ...params, hasRain: false, weatherSeverity: 0 } },
    { label: "Trânsito Leve", params: { ...params, trafficIntensity: 20 } },
    { label: "Base", params: { 
      ...params, 
      isRushHour: false, 
      hasRain: false, 
      weatherSeverity: 0,
      trafficIntensity: 20,
      hasSpecialEvent: false,
      surgeZone: "none" as const,
      isHoliday: false
    }},
  ];

  const queries = scenarios.map(scenario => 
    useQuery({
      queryKey: ["/api/calculate-price", scenario.params],
      queryFn: async () => {
        const res = await fetch("/api/calculate-price", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(scenario.params),
        });
        if (!res.ok) throw new Error("Failed to calculate price");
        return res.json();
      },
    })
  );

  const isLoading = queries.some(q => q.isLoading);
  const hasError = queries.some(q => q.error);
  const allLoaded = queries.every(q => q.data);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(price);
  };

  if (isLoading) {
    return (
      <Card data-testid="card-chart-loading" className="bg-black/40 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Carregando comparação...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card data-testid="card-chart-error" className="bg-black/40 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-destructive">Erro</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar a comparação de cenários.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!allLoaded) {
    return null;
  }

  const chartData = scenarios.map((scenario, index) => ({
    name: scenario.label,
    price: queries[index].data?.totalPrice || 0,
    isCurrentScenario: index === 0,
  }));

  const maxPrice = Math.max(...chartData.map(d => d.price));
  const minPrice = Math.min(...chartData.map(d => d.price));
  const difference = maxPrice - minPrice;

  const COLORS = {
    current: "hsl(var(--primary))",
    other: "hsl(var(--chart-2))",
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-popover-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-1">{payload[0].payload.name}</p>
          <p className="text-lg font-bold text-primary">
            {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card data-testid="card-chart" className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg sm:text-xl text-white">Comparação de Cenários</CardTitle>
              <CardDescription className="mt-1 text-xs sm:text-sm text-white/60">
                Veja como diferentes fatores impactam o preço
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0">
            <TrendingUp className="h-3 w-3 mr-1" />
            Variação: {formatPrice(difference)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              stroke="hsl(var(--border))"
            />
            <YAxis 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              stroke="hsl(var(--border))"
              tickFormatter={(value) => `Kz ${value}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
            <Bar dataKey="price" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isCurrentScenario ? COLORS.current : COLORS.other}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.current }} />
            <span className="text-white/70">Cenário Atual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS.other }} />
            <span className="text-white/70">Comparações</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}