import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { SimulationParams } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface PriceCardProps {
  params: SimulationParams;
}

export function PriceCard({ params }: PriceCardProps) {
  const { data: priceResult, isLoading, error } = useQuery({
    queryKey: ["/api/calculate-price", params],
    queryFn: async () => {
      const res = await fetch("/api/calculate-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error("Failed to calculate price");
      return res.json();
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getSurgeColor = (multiplier: number) => {
    if (multiplier >= 2.0) return "destructive";
    if (multiplier >= 1.5) return "default";
    if (multiplier >= 1.2) return "secondary";
    return "outline";
  };

  const getSurgeLabel = (multiplier: number) => {
    if (multiplier === 1) return "Normal";
    return `${multiplier.toFixed(1)}x Tarifa Dinâmica`;
  };

  if (isLoading) {
    return (
      <Card className="sticky top-24 z-50" data-testid="card-price-loading">
        <CardHeader>
          <CardTitle>Calculando...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-24 bg-muted animate-pulse rounded-lg" />
            <div className="h-12 bg-muted animate-pulse rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="sticky top-24 z-50 border-destructive/20" data-testid="card-price-error">
        <CardHeader>
          <CardTitle className="text-destructive">Erro ao Calcular</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Não foi possível calcular o preço. Por favor, tente novamente.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!priceResult) {
    return null;
  }

  const isIncreased = priceResult.percentageChange > 0;

  return (
    <Card className="sticky top-24 z-50 border-primary/20 self-start" data-testid="card-price">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">Preço Estimado</CardTitle>
          <div className="bg-primary/10 text-primary p-2 rounded-lg">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span 
              className="text-5xl font-bold tracking-tight" 
              data-testid="text-total-price"
            >
              {formatPrice(priceResult.totalPrice)}
            </span>
          </div>
          
          {priceResult.percentageChange !== 0 && (
            <div className="flex items-center gap-2">
              {isIncreased ? (
                <TrendingUp className="h-4 w-4 text-destructive" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-600" />
              )}
              <span 
                className={`text-sm font-medium ${
                  isIncreased ? "text-destructive" : "text-green-600"
                }`}
                data-testid="text-percentage-change"
              >
                {isIncreased ? "+" : ""}
                {priceResult.percentageChange.toFixed(1)}% da tarifa base
              </span>
            </div>
          )}
        </div>

        {priceResult.surgeMultiplier > 1 && (
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Multiplicador Ativo</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Devido à alta demanda
                </p>
              </div>
              <Badge 
                variant={getSurgeColor(priceResult.surgeMultiplier)}
                className="text-base font-bold px-3 py-1"
                data-testid="badge-surge-multiplier"
              >
                {getSurgeLabel(priceResult.surgeMultiplier)}
              </Badge>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tarifa Base</span>
            <span className="font-medium" data-testid="text-base-fare">
              {formatPrice(priceResult.baseFare)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
