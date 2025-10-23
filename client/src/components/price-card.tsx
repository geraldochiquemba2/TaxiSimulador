import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { SimulationParams, PriceBreakdownItem } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface PriceCardProps {
  params: SimulationParams;
  compact?: boolean;
}

export function PriceCard({ params, compact = false }: PriceCardProps) {
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
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
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
    if (compact) {
      return (
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg" data-testid="card-price-loading">
          <DollarSign className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-lg font-bold">Calculando...</span>
        </div>
      );
    }
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
    if (compact) {
      return (
        <div className="flex items-center gap-2 bg-destructive/10 px-4 py-2 rounded-lg" data-testid="card-price-error">
          <span className="text-lg font-bold text-destructive">Erro</span>
        </div>
      );
    }
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

  if (compact) {
    const activeFactors = priceResult.breakdown.filter((item: PriceBreakdownItem) => item.value !== 0 && item.label !== "Tarifa Base");
    
    return (
      <div className="flex flex-col gap-3 bg-primary/10 px-4 py-3 rounded-lg border border-primary/20 flex-1" data-testid="card-price">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Preço Total</span>
              <span className="text-2xl font-bold tracking-tight" data-testid="text-total-price">
                {formatPrice(priceResult.totalPrice)}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Tarifa Base:</span>
              <span className="text-sm font-semibold" data-testid="text-base-fare-compact">
                {formatPrice(priceResult.baseFare)}
              </span>
            </div>
            {priceResult.percentageChange !== 0 && (
              <div className="flex items-center gap-1">
                {isIncreased ? (
                  <TrendingUp className="h-3 w-3 text-destructive" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-green-600" />
                )}
                <span 
                  className={`text-xs font-medium ${
                    isIncreased ? "text-destructive" : "text-green-600"
                  }`}
                  data-testid="text-percentage-change-compact"
                >
                  {isIncreased ? "+" : ""}
                  {priceResult.percentageChange.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
        
        {(activeFactors.length > 0 || priceResult.surgeMultiplier > 1) && (
          <div className="flex items-center gap-2 pt-2 border-t border-primary/20">
            <span className="text-xs text-muted-foreground shrink-0">Fatores:</span>
            <div className="flex flex-wrap gap-1">
              {activeFactors.map((factor: PriceBreakdownItem, idx: number) => (
                <Badge 
                  key={idx}
                  variant={factor.value > 0 ? "destructive" : "secondary"}
                  className="text-xs"
                  data-testid={`badge-factor-${idx}`}
                >
                  {factor.label}
                  {factor.multiplier && factor.multiplier !== 1 ? ` (${factor.multiplier}x)` : ''}
                </Badge>
              ))}
              {priceResult.surgeMultiplier > 1 && (
                <Badge 
                  variant={getSurgeColor(priceResult.surgeMultiplier)}
                  className="font-bold"
                  data-testid="badge-surge-multiplier"
                >
                  {getSurgeLabel(priceResult.surgeMultiplier)}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

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
