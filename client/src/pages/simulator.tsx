import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Car, 
  Clock, 
  CloudRain, 
  Zap, 
  MapPin, 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  Navigation,
  RotateCcw,
  Sun,
  Moon,
  Sunrise
} from "lucide-react";
import { SimulationParams, ScenarioPreset } from "@shared/schema";
import { PriceCard } from "@/components/price-card";
import { PriceBreakdown } from "@/components/price-breakdown";
import { ComparisonChart } from "@/components/comparison-chart";

const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "morning-rush",
    name: "Segunda de Manhã",
    description: "Horário de pico matinal",
    icon: "sunrise",
    params: {
      hour: 8,
      isRushHour: true,
      trafficIntensity: 85,
      hasRain: false,
      weatherSeverity: 0,
    }
  },
  {
    id: "friday-night-rain",
    name: "Sexta à Noite Chovendo",
    description: "Fim de semana com chuva",
    icon: "cloud-rain",
    params: {
      hour: 22,
      hasRain: true,
      weatherSeverity: 70,
      trafficIntensity: 60,
      hasSpecialEvent: true,
    }
  },
  {
    id: "holiday-event",
    name: "Feriado com Evento",
    description: "Evento especial em feriado",
    icon: "calendar",
    params: {
      isHoliday: true,
      hasSpecialEvent: true,
      surgeZone: "high",
      trafficIntensity: 90,
    }
  },
  {
    id: "quiet-afternoon",
    name: "Tarde Tranquila",
    description: "Horário calmo",
    icon: "sun",
    params: {
      hour: 15,
      isRushHour: false,
      trafficIntensity: 20,
      hasRain: false,
      weatherSeverity: 0,
    }
  }
];

const DEFAULT_PARAMS: SimulationParams = {
  distance: 10,
  vehicleType: "economy",
  hour: 12,
  isRushHour: false,
  isHoliday: false,
  hasRain: false,
  weatherSeverity: 0,
  trafficIntensity: 30,
  hasSpecialEvent: false,
  surgeZone: "none",
};

export default function Simulator() {
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);

  const updateParam = <K extends keyof SimulationParams>(
    key: K,
    value: SimulationParams[K]
  ) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setParams(DEFAULT_PARAMS);
  };

  const applyPreset = (preset: ScenarioPreset) => {
    setParams(prev => ({ ...prev, ...preset.params }));
  };

  const getHourLabel = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case "sunrise": return <Sunrise className="h-4 w-4" />;
      case "cloud-rain": return <CloudRain className="h-4 w-4" />;
      case "calendar": return <Calendar className="h-4 w-4" />;
      case "sun": return <Sun className="h-4 w-4" />;
      default: return <Car className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold" data-testid="text-app-title">
                  Simulador de Táxi
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Explore como diferentes cenários afetam o preço da corrida
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
              data-testid="button-reset"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Resetar
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card data-testid="card-presets">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Cenários Rápidos
                </CardTitle>
                <CardDescription>
                  Aplique configurações pré-definidas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {SCENARIO_PRESETS.map((preset) => (
                    <Button
                      key={preset.id}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-start gap-1 hover-elevate"
                      onClick={() => applyPreset(preset)}
                      data-testid={`button-preset-${preset.id}`}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {getPresetIcon(preset.icon)}
                        <span className="text-xs font-medium">{preset.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-left">
                        {preset.description}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-trip-details">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary" />
                  Detalhes da Corrida
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="distance" className="text-sm font-medium">
                      Distância
                    </Label>
                    <Badge variant="secondary" data-testid="text-distance-value">
                      {params.distance} km
                    </Badge>
                  </div>
                  <Slider
                    id="distance"
                    min={0}
                    max={100}
                    step={1}
                    value={[params.distance]}
                    onValueChange={([value]) => updateParam("distance", value)}
                    data-testid="slider-distance"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="vehicle-type" className="text-sm font-medium">
                    Tipo de Veículo
                  </Label>
                  <Select
                    value={params.vehicleType}
                    onValueChange={(value: SimulationParams["vehicleType"]) => 
                      updateParam("vehicleType", value)
                    }
                  >
                    <SelectTrigger id="vehicle-type" data-testid="select-vehicle-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Econômico</SelectItem>
                      <SelectItem value="comfort">Conforto</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="xl">XL (6 lugares)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-time-factors">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Horário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hour" className="text-sm font-medium">
                      Hora do Dia
                    </Label>
                    <Badge variant="secondary" data-testid="text-hour-value">
                      {getHourLabel(params.hour)}
                    </Badge>
                  </div>
                  <Slider
                    id="hour"
                    min={0}
                    max={23}
                    step={1}
                    value={[params.hour]}
                    onValueChange={([value]) => updateParam("hour", value)}
                    data-testid="slider-hour"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="rush-hour" className="text-sm font-medium">
                      Horário de Pico
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Aumenta 30-40% no preço
                    </p>
                  </div>
                  <Switch
                    id="rush-hour"
                    checked={params.isRushHour}
                    onCheckedChange={(checked) => updateParam("isRushHour", checked)}
                    data-testid="switch-rush-hour"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="holiday" className="text-sm font-medium">
                      Feriado
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Tarifa adicional aplicada
                    </p>
                  </div>
                  <Switch
                    id="holiday"
                    checked={params.isHoliday}
                    onCheckedChange={(checked) => updateParam("isHoliday", checked)}
                    data-testid="switch-holiday"
                  />
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-weather-traffic">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CloudRain className="h-5 w-5 text-primary" />
                  Clima e Trânsito
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="rain" className="text-sm font-medium">
                      Chuva
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Ativa multiplicador de clima
                    </p>
                  </div>
                  <Switch
                    id="rain"
                    checked={params.hasRain}
                    onCheckedChange={(checked) => updateParam("hasRain", checked)}
                    data-testid="switch-rain"
                  />
                </div>

                {params.hasRain && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="weather-severity" className="text-sm font-medium">
                        Intensidade da Chuva
                      </Label>
                      <Badge variant="secondary" data-testid="text-weather-severity-value">
                        {params.weatherSeverity}%
                      </Badge>
                    </div>
                    <Slider
                      id="weather-severity"
                      min={0}
                      max={100}
                      step={10}
                      value={[params.weatherSeverity]}
                      onValueChange={([value]) => updateParam("weatherSeverity", value)}
                      data-testid="slider-weather-severity"
                    />
                  </div>
                )}

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="traffic" className="text-sm font-medium">
                      Intensidade do Trânsito
                    </Label>
                    <Badge variant="secondary" data-testid="text-traffic-value">
                      {params.trafficIntensity}%
                    </Badge>
                  </div>
                  <Slider
                    id="traffic"
                    min={0}
                    max={100}
                    step={10}
                    value={[params.trafficIntensity]}
                    onValueChange={([value]) => updateParam("trafficIntensity", value)}
                    data-testid="slider-traffic"
                  />
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-special-scenarios">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Cenários Especiais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="special-event" className="text-sm font-medium">
                      Evento Especial
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Shows, jogos, festivais
                    </p>
                  </div>
                  <Switch
                    id="special-event"
                    checked={params.hasSpecialEvent}
                    onCheckedChange={(checked) => updateParam("hasSpecialEvent", checked)}
                    data-testid="switch-special-event"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="surge-zone" className="text-sm font-medium">
                    Zona de Tarifa Dinâmica
                  </Label>
                  <Select
                    value={params.surgeZone}
                    onValueChange={(value: SimulationParams["surgeZone"]) => 
                      updateParam("surgeZone", value)
                    }
                  >
                    <SelectTrigger id="surge-zone" data-testid="select-surge-zone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma</SelectItem>
                      <SelectItem value="low">Baixa (1.2x)</SelectItem>
                      <SelectItem value="medium">Média (1.5x)</SelectItem>
                      <SelectItem value="high">Alta (2.0x)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <PriceCard params={params} />
            <PriceBreakdown params={params} />
            <ComparisonChart params={params} />
          </div>
        </div>
      </main>

      <footer className="border-t mt-12 py-6 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Este é um simulador educacional. Os preços não refletem tarifas reais de aplicativos de táxi.
            </p>
            <p className="text-xs text-muted-foreground">
              Metodologia baseada em análise de fatores comuns de precificação dinâmica
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
