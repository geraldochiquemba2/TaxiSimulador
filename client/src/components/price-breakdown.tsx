import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Plus, Minus } from "lucide-react";
import { SimulationParams, PriceBreakdownItem } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface PriceBreakdownProps {
  params: SimulationParams;
}

export function PriceBreakdown({ params }: PriceBreakdownProps) {
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

  const getImpactColor = (impact: "low" | "medium" | "high") => {
    switch (impact) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
    }
  };

  const getImpactProgress = (impact: "low" | "medium" | "high") => {
    switch (impact) {
      case "high": return 100;
      case "medium": return 60;
      case "low": return 30;
    }
  };

  if (isLoading) {
    return (
      <Card data-testid="card-breakdown-loading">
        <CardHeader>
          <CardTitle>Carregando...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card data-testid="card-breakdown-error">
        <CardHeader>
          <CardTitle className="text-destructive">Erro</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar o detalhamento.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!priceResult || !priceResult.breakdown.length) {
    return null;
  }

  const getImpactLabel = (impact: "low" | "medium" | "high") => {
    switch (impact) {
      case "high": return "Impacto Alto";
      case "medium": return "Impacto Médio";
      case "low": return "Impacto Baixo";
    }
  };

  return (
    <Card data-testid="card-breakdown">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Como chegamos nesse preço?</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Cada fator aumenta ou diminui o valor da corrida
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {priceResult.breakdown.map((item: PriceBreakdownItem, index: number) => (
            <div 
              key={index}
              className={`space-y-2 p-3 rounded-lg border ${
                item.value === 0 
                  ? "bg-muted/20 border-border/50" 
                  : item.value > 0 
                    ? "bg-destructive/5 border-destructive/20" 
                    : "bg-green-500/5 border-green-500/20"
              }`}
              data-testid={`breakdown-item-${index}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.multiplier && item.multiplier !== 1 && (
                      <Badge 
                        variant={item.value > 0 ? "destructive" : "secondary"}
                        className="text-xs"
                        data-testid={`badge-multiplier-${index}`}
                      >
                        {item.multiplier}x
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {getImpactLabel(item.impact)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <div className="flex items-center gap-1">
                    {item.value > 0 ? (
                      <Plus className="h-3 w-3 text-destructive" />
                    ) : item.value < 0 ? (
                      <Minus className="h-3 w-3 text-green-600" />
                    ) : null}
                    <span 
                      className={`text-sm font-bold ${
                        item.value > 0 ? "text-destructive" : 
                        item.value < 0 ? "text-green-600" : 
                        "text-foreground"
                      }`}
                      data-testid={`text-breakdown-value-${index}`}
                    >
                      {formatPrice(Math.abs(item.value))}
                    </span>
                  </div>
                  {item.value !== 0 && (
                    <span className="text-xs text-muted-foreground">
                      {item.value > 0 ? "adicionado" : "economizado"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t-2 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-semibold">Valor Total</span>
              <p className="text-xs text-muted-foreground">Soma de todos os fatores</p>
            </div>
            <span className="text-2xl font-bold text-primary" data-testid="text-breakdown-total">
              {formatPrice(priceResult.totalPrice)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
