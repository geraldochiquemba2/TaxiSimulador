import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code2 } from "lucide-react";
import { SimulationParams } from "@shared/schema";

interface AlgorithmViewerProps {
  params: SimulationParams;
}

export function AlgorithmViewer({ params }: AlgorithmViewerProps) {
  const getVehicleFare = () => {
    const fares: Record<string, { base: number; perKm: number }> = {
      economy: { base: 500, perKm: 180 },
      comfort: { base: 800, perKm: 250 },
      premium: { base: 1200, perKm: 380 },
      xl: { base: 1000, perKm: 280 },
    };
    return fares[params.vehicleType];
  };

  const fare = getVehicleFare();
  const baseFare = fare.base;
  const distanceCost = params.distance * fare.perKm;
  let total = baseFare + distanceCost;

  const steps = [];

  // Step 1: Base calculation
  steps.push({
    active: true,
    title: "1. Tarifa Base + Distância",
    code: `baseFare = ${baseFare.toFixed(0)} Kz
distanceCost = ${params.distance} km × ${fare.perKm.toFixed(0)} Kz/km = ${distanceCost.toFixed(0)} Kz
total = ${baseFare.toFixed(0)} Kz + ${distanceCost.toFixed(0)} Kz = ${total.toFixed(0)} Kz`,
    description: "Calcula o preço inicial baseado no tipo de veículo e distância"
  });

  // Step 2: Rush hour
  if (params.isRushHour) {
    const rushCharge = total * 0.35;
    steps.push({
      active: true,
      title: "2. Adiciona Horário de Pico (+35%)",
      code: `rushHourCharge = ${total.toFixed(0)} Kz × 0.35 = ${rushCharge.toFixed(0)} Kz
total = ${total.toFixed(0)} Kz + ${rushCharge.toFixed(0)} Kz = ${(total + rushCharge).toFixed(0)} Kz`,
      description: "Aplica multiplicador de horário de pico"
    });
    total += rushCharge;
  } else {
    steps.push({
      active: false,
      title: "2. Horário de Pico (desativado)",
      code: `// Não é horário de pico
// Sem acréscimo`,
      description: "Condição não aplicada"
    });
  }

  // Step 3: Night fare
  if (params.hour >= 0 && params.hour < 6) {
    const nightCharge = total * 0.20;
    steps.push({
      active: true,
      title: "3. Adiciona Tarifa Noturna (+20%)",
      code: `nightCharge = ${total.toFixed(0)} Kz × 0.20 = ${nightCharge.toFixed(0)} Kz
total = ${total.toFixed(0)} Kz + ${nightCharge.toFixed(0)} Kz = ${(total + nightCharge).toFixed(0)} Kz`,
      description: "Horário entre 00h-06h tem adicional noturno"
    });
    total += nightCharge;
  } else {
    steps.push({
      active: false,
      title: "3. Tarifa Noturna (desativada)",
      code: `// Horário: ${params.hour}h (não é noturno)
// Sem acréscimo`,
      description: "Apenas entre 00h-06h"
    });
  }

  // Step 4: Holiday
  if (params.isHoliday) {
    const holidayCharge = total * 0.25;
    steps.push({
      active: true,
      title: "4. Adiciona Feriado (+25%)",
      code: `holidayCharge = ${total.toFixed(0)} Kz × 0.25 = ${holidayCharge.toFixed(0)} Kz
total = ${total.toFixed(0)} Kz + ${holidayCharge.toFixed(0)} Kz = ${(total + holidayCharge).toFixed(0)} Kz`,
      description: "Tarifa extra para feriados"
    });
    total += holidayCharge;
  } else {
    steps.push({
      active: false,
      title: "4. Feriado (desativado)",
      code: `// Não é feriado
// Sem acréscimo`,
      description: "Condição não aplicada"
    });
  }

  // Step 5: Rain
  if (params.hasRain && params.weatherSeverity > 0) {
    const weatherMultiplier = 1 + (params.weatherSeverity / 100) * 0.4;
    const weatherCharge = total * (weatherMultiplier - 1);
    steps.push({
      active: true,
      title: `5. Adiciona Chuva (+${((weatherMultiplier - 1) * 100).toFixed(0)}%)`,
      code: `weatherMultiplier = 1 + (${params.weatherSeverity}/100 × 0.4) = ${weatherMultiplier.toFixed(2)}
weatherCharge = ${total.toFixed(0)} Kz × ${(weatherMultiplier - 1).toFixed(2)} = ${weatherCharge.toFixed(0)} Kz
total = ${total.toFixed(0)} Kz + ${weatherCharge.toFixed(0)} Kz = ${(total + weatherCharge).toFixed(0)} Kz`,
      description: `Intensidade ${params.weatherSeverity}% aumenta o preço`
    });
    total += weatherCharge;
  } else {
    steps.push({
      active: false,
      title: "5. Chuva (desativada)",
      code: `// Sem chuva
// Sem acréscimo`,
      description: "Condição não aplicada"
    });
  }

  // Step 6: Traffic
  if (params.trafficIntensity > 30) {
    const trafficMultiplier = 1 + ((params.trafficIntensity - 30) / 100) * 0.5;
    const trafficCharge = total * (trafficMultiplier - 1);
    steps.push({
      active: true,
      title: `6. Adiciona Trânsito (+${((trafficMultiplier - 1) * 100).toFixed(0)}%)`,
      code: `trafficMultiplier = 1 + ((${params.trafficIntensity} - 30)/100 × 0.5) = ${trafficMultiplier.toFixed(2)}
trafficCharge = ${total.toFixed(0)} Kz × ${(trafficMultiplier - 1).toFixed(2)} = ${trafficCharge.toFixed(0)} Kz
total = ${total.toFixed(0)} Kz + ${trafficCharge.toFixed(0)} Kz = ${(total + trafficCharge).toFixed(0)} Kz`,
      description: `Trânsito acima de 30% aumenta o tempo da viagem`
    });
    total += trafficCharge;
  } else {
    steps.push({
      active: false,
      title: "6. Trânsito (sem impacto)",
      code: `// Trânsito: ${params.trafficIntensity}% (< 30%)
// Sem acréscimo`,
      description: "Apenas acima de 30% de intensidade"
    });
  }

  // Step 7: Special Event
  if (params.hasSpecialEvent) {
    const eventCharge = total * 0.30;
    steps.push({
      active: true,
      title: "7. Adiciona Evento Especial (+30%)",
      code: `eventCharge = ${total.toFixed(0)} Kz × 0.30 = ${eventCharge.toFixed(0)} Kz
total = ${total.toFixed(0)} Kz + ${eventCharge.toFixed(0)} Kz = ${(total + eventCharge).toFixed(0)} Kz`,
      description: "Shows, jogos ou festivais aumentam a demanda"
    });
    total += eventCharge;
  } else {
    steps.push({
      active: false,
      title: "7. Evento Especial (desativado)",
      code: `// Sem eventos especiais
// Sem acréscimo`,
      description: "Condição não aplicada"
    });
  }

  // Step 8: Surge pricing
  if (params.surgeZone !== "none") {
    const surgeMultipliers: Record<string, number> = {
      none: 1.0,
      low: 1.2,
      medium: 1.5,
      high: 2.0,
    };
    const surgeMultiplier = surgeMultipliers[params.surgeZone];
    const surgeCharge = total * (surgeMultiplier - 1);
    steps.push({
      active: true,
      title: `8. Aplica Tarifa Dinâmica (${surgeMultiplier}x)`,
      code: `surgeMultiplier = ${surgeMultiplier}x
surgeCharge = ${total.toFixed(0)} Kz × ${(surgeMultiplier - 1).toFixed(1)} = ${surgeCharge.toFixed(0)} Kz
TOTAL FINAL = ${total.toFixed(0)} Kz + ${surgeCharge.toFixed(0)} Kz = ${(total + surgeCharge).toFixed(0)} Kz`,
      description: "Multiplicador de zona de alta demanda"
    });
    total += surgeCharge;
  } else {
    steps.push({
      active: false,
      title: "8. Tarifa Dinâmica (zona normal)",
      code: `// Zona normal (sem multiplicador)
TOTAL FINAL = ${total.toFixed(0)} Kz`,
      description: "Sem multiplicador adicional"
    });
  }

  return (
    <Card className="h-full bg-slate-900 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-slate-100">
          <Code2 className="h-4 w-4 text-yellow-400" />
          Algoritmo de Cálculo
        </CardTitle>
        <p className="text-xs text-slate-400 mt-1">
          Veja como o preço é calculado passo a passo
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="space-y-4 pr-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative p-3 rounded-lg border-2 transition-all ${
                  step.active
                    ? "border-yellow-500/40 bg-yellow-500/10"
                    : "border-slate-700 bg-slate-800/50 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-xs font-semibold text-slate-100">{step.title}</h4>
                  <Badge 
                    variant={step.active ? "default" : "outline"} 
                    className={`text-xs shrink-0 ${step.active ? 'bg-yellow-500 text-slate-900' : 'border-slate-600 text-slate-400'}`}
                  >
                    {step.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mb-2">{step.description}</p>
                <pre className="text-xs bg-slate-950 p-2 rounded overflow-x-auto border border-slate-800">
                  <code className="text-green-400">{step.code}</code>
                </pre>
              </div>
            ))}

            <div className="mt-6 p-4 rounded-lg bg-yellow-500/20 border-2 border-yellow-500">
              <div className="text-center">
                <p className="text-xs text-slate-300 mb-1">Preço Final Calculado</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {total.toFixed(0)} Kz
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
