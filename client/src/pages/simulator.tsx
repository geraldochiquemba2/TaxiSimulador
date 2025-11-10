import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Car,
  CloudRain,
  Zap,
  Navigation,
  RotateCcw,
  Sun,
  Sunrise,
  Calendar,
  HelpCircle,
  Info,
  Code2
} from "lucide-react";
import { SimulationParams, ScenarioPreset } from "@shared/schema";
import { PriceCard } from "@/components/price-card";
import { PriceBreakdown } from "@/components/price-breakdown";
import { ComparisonChart } from "@/components/comparison-chart";
import { AlgorithmViewer } from "@/components/algorithm-viewer";

const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "morning-rush",
    name: "Manhã (Pico)",
    description: "Segunda 8h",
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
    name: "Noite Chuva",
    description: "Sexta 22h",
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
    name: "Feriado + Evento",
    description: "Alta demanda",
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
    name: "Tarde Normal",
    description: "15h calmo",
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
  const [showAlgorithm, setShowAlgorithm] = useState(false);

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
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold" data-testid="text-app-title">
                    Simulador de Preços
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Aprenda como funciona a tarifa dinâmica
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PriceCard params={params} compact={true} />
                <Button
                  variant={showAlgorithm ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowAlgorithm(!showAlgorithm)}
                  data-testid="button-toggle-algorithm"
                  className="hidden sm:flex"
                >
                  <Code2 className="h-4 w-4 mr-1" />
                  <span className="text-xs">Código</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  data-testid="button-reset"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm mb-1">Como funciona?</h3>
                  <p className="text-sm text-muted-foreground">
                    Aplicativos de transporte usam <strong>preços dinâmicos</strong> que mudam conforme a demanda.
                    Teste diferentes cenários abaixo e veja como cada fator afeta o valor da corrida.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className={`grid gap-6 ${showAlgorithm ? 'lg:grid-cols-12' : 'lg:grid-cols-5'}`}>
            <div className={`${showAlgorithm ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-4`}>
              <Card data-testid="card-presets">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Cenários Prontos
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Clique para testar situações comuns
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
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-primary" />
                    Configurações Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="distance" className="text-sm font-medium">
                          Distância
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Informação sobre distância"
                              data-testid="tooltip-distance"
                            >
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">Quanto maior a distância, maior o preço base da corrida</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
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
                    <div className="flex items-center gap-2">
                      <Label htmlFor="vehicle-type" className="text-sm font-medium">
                        Categoria do Veículo
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Informação sobre categoria de veículo"
                            data-testid="tooltip-vehicle-type"
                          >
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">Carros mais confortáveis ou maiores têm tarifas mais altas</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
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

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="hour" className="text-sm font-medium">
                          Horário
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Informação sobre horário"
                              data-testid="tooltip-hour"
                            >
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">Horários de pico (7-9h e 17-19h) têm tarifas mais altas</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
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
                      onValueChange={([value]) => {
                        updateParam("hour", value);
                        const isRush = (value >= 7 && value <= 9) || (value >= 17 && value <= 19);
                        updateParam("isRushHour", isRush);
                      }}
                      data-testid="slider-hour"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-conditions">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CloudRain className="h-4 w-4 text-primary" />
                    Condições Especiais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="rain" className="text-sm font-medium">
                          Está chovendo?
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Informação sobre chuva"
                              data-testid="tooltip-rain"
                            >
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">Chuva aumenta a demanda e reduz motoristas disponíveis</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <Switch
                      id="rain"
                      checked={params.hasRain}
                      onCheckedChange={(checked) => {
                        updateParam("hasRain", checked);
                        if (!checked) updateParam("weatherSeverity", 0);
                        else updateParam("weatherSeverity", 50);
                      }}
                      data-testid="switch-rain"
                    />
                  </div>

                  {params.hasRain && (
                    <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="weather-severity" className="text-xs font-medium">
                          Intensidade
                        </Label>
                        <Badge variant="outline" className="text-xs" data-testid="text-weather-severity-value">
                          {params.weatherSeverity > 70 ? "Forte" : params.weatherSeverity > 40 ? "Média" : "Fraca"}
                        </Badge>
                      </div>
                      <Slider
                        id="weather-severity"
                        min={10}
                        max={100}
                        step={10}
                        value={[params.weatherSeverity]}
                        onValueChange={([value]) => updateParam("weatherSeverity", value)}
                        data-testid="slider-weather-severity"
                      />
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="traffic" className="text-sm font-medium">
                          Trânsito
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Informação sobre trânsito"
                              data-testid="tooltip-traffic"
                            >
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">Mais trânsito = viagem mais longa = preço maior</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
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

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="holiday" className="text-sm font-medium">
                          Feriado
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Informação sobre feriado"
                              data-testid="tooltip-holiday"
                            >
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">Feriados têm tarifa extra (menos motoristas trabalhando)</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <Switch
                      id="holiday"
                      checked={params.isHoliday}
                      onCheckedChange={(checked) => updateParam("isHoliday", checked)}
                      data-testid="switch-holiday"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="special-event" className="text-sm font-medium">
                          Evento Especial
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Informação sobre eventos especiais"
                              data-testid="tooltip-special-event"
                            >
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs max-w-xs">Shows, jogos ou festivais aumentam muito a demanda</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
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
                    <div className="flex items-center gap-2">
                      <Label htmlFor="surge-zone" className="text-sm font-medium">
                        Zona de Demanda
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Informação sobre zonas de demanda"
                            data-testid="tooltip-surge-zone"
                          >
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">Áreas com muitos pedidos e poucos motoristas têm multiplicadores maiores</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
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
                        <SelectItem value="none">Normal</SelectItem>
                        <SelectItem value="low">Demanda Baixa (1.2x)</SelectItem>
                        <SelectItem value="medium">Demanda Média (1.5x)</SelectItem>
                        <SelectItem value="high">Demanda Alta (2.0x)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className={`space-y-6 ${showAlgorithm ? 'lg:col-span-5' : 'lg:col-span-3'}`}>
              <PriceBreakdown params={params} />
              <ComparisonChart params={params} />
            </div>

            {showAlgorithm && (
              <div className="lg:col-span-4 min-h-0">
                <AlgorithmViewer params={params} />
              </div>
            )}
          </div>
        </main>

        <footer className="border-t mt-12 py-6 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Este é um simulador educacional. Os preços não refletem tarifas reais.
              </p>
              <p className="text-xs text-muted-foreground">
                Desenvolvido para ensinar como funcionam os preços dinâmicos
              </p>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}