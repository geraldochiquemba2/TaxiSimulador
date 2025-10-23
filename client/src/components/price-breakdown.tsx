import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Plus, Minus } from "lucide-react";
import { SimulationParams } from "@shared/schema";
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

  return (
    <Card data-testid="card-breakdown">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Detalhamento do Preço</CardTitle>
        </div>
        <CardDescription>
          Como cada fator contribui para o valor final
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {priceResult.breakdown.map((item, index) => (
            <div 
              key={index}
              className="space-y-2 p-4 rounded-lg bg-muted/30 border border-border"
              data-testid={`breakdown-item-${index}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.multiplier && item.multiplier !== 1 && (
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        data-testid={`badge-multiplier-${index}`}
                      >
                        {item.multiplier}x
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={getImpactProgress(item.impact)} 
                      className="h-1.5 flex-1"
                    />
                    <Badge 
                      variant={getImpactColor(item.impact)}
                      className="text-xs"
                      data-testid={`badge-impact-${index}`}
                    >
                      {item.impact === "high" ? "Alto" : item.impact === "medium" ? "Médio" : "Baixo"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
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
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">Total</span>
            <span className="text-xl font-bold text-primary" data-testid="text-breakdown-total">
              {formatPrice(priceResult.totalPrice)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
