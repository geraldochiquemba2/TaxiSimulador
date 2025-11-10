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
    code: `// Define tarifas por categoria
const VEHICLE_FARES = {
  economy: { base: 500, perKm: 180 },
  comfort: { base: 800, perKm: 250 },
  premium: { base: 1200, perKm: 380 },
  xl: { base: 1000, perKm: 280 }
};

// Calcula valores iniciais
vehicleType = "${params.vehicleType}";
baseFare = VEHICLE_FARES[vehicleType].base;
baseFare = ${baseFare.toFixed(0)} Kz;

perKm = VEHICLE_FARES[vehicleType].perKm;
perKm = ${fare.perKm.toFixed(0)} Kz/km;

distance = ${params.distance} km;
distanceCost = distance × perKm;
distanceCost = ${params.distance} × ${fare.perKm.toFixed(0)};
distanceCost = ${distanceCost.toFixed(0)} Kz;

// Soma tarifa base + distância
total = baseFare + distanceCost;
total = ${baseFare.toFixed(0)} + ${distanceCost.toFixed(0)};
total = ${total.toFixed(0)} Kz;`,
    description: "Calcula o preço inicial baseado no tipo de veículo e distância"
  });

  // Step 2: Rush hour
  if (params.isRushHour) {
    const rushCharge = total * 0.35;
    steps.push({
      active: true,
      title: "2. Adiciona Horário de Pico (+35%)",
      code: `// Verifica horário de pico
if (isRushHour === true) {
  // Calcula acréscimo de 35%
  const RUSH_MULTIPLIER = 0.35;
  rushHourCharge = total × RUSH_MULTIPLIER;
  rushHourCharge = ${total.toFixed(0)} × 0.35;
  rushHourCharge = ${rushCharge.toFixed(0)} Kz;
  
  // Adiciona ao total
  total = total + rushHourCharge;
  total = ${total.toFixed(0)} + ${rushCharge.toFixed(0)};
  total = ${(total + rushCharge).toFixed(0)} Kz;
  
  console.log("Horário de pico aplicado!");
}`,
      description: "Aplica multiplicador de horário de pico"
    });
    total += rushCharge;
  } else {
    steps.push({
      active: false,
      title: "2. Horário de Pico (desativado)",
      code: `// Verifica horário de pico
if (isRushHour === true) {
  // ...código do horário de pico
} else {
  console.log("Não é horário de pico");
  // Sem acréscimo ao total
}`,
      description: "Condição não aplicada"
    });
  }

  // Step 3: Night fare
  if (params.hour >= 0 && params.hour < 6) {
    const nightCharge = total * 0.20;
    steps.push({
      active: true,
      title: "3. Adiciona Tarifa Noturna (+20%)",
      code: `// Verifica horário noturno (00h-06h)
hour = ${params.hour};
if (hour >= 0 && hour < 6) {
  // Calcula adicional noturno de 20%
  const NIGHT_MULTIPLIER = 0.20;
  nightCharge = total × NIGHT_MULTIPLIER;
  nightCharge = ${total.toFixed(0)} × 0.20;
  nightCharge = ${nightCharge.toFixed(0)} Kz;
  
  // Adiciona ao total
  total = total + nightCharge;
  total = ${total.toFixed(0)} + ${nightCharge.toFixed(0)};
  total = ${(total + nightCharge).toFixed(0)} Kz;
  
  console.log("Tarifa noturna aplicada!");
}`,
      description: "Horário entre 00h-06h tem adicional noturno"
    });
    total += nightCharge;
  } else {
    steps.push({
      active: false,
      title: "3. Tarifa Noturna (desativada)",
      code: `// Verifica horário noturno (00h-06h)
hour = ${params.hour};
if (hour >= 0 && hour < 6) {
  // ...código tarifa noturna
} else {
  console.log("Horário ${params.hour}h não é noturno");
  // Sem acréscimo ao total
}`,
      description: "Apenas entre 00h-06h"
    });
  }

  // Step 4: Holiday
  if (params.isHoliday) {
    const holidayCharge = total * 0.25;
    steps.push({
      active: true,
      title: "4. Adiciona Feriado (+25%)",
      code: `// Verifica se é feriado
if (isHoliday === true) {
  // Calcula acréscimo de feriado (25%)
  const HOLIDAY_MULTIPLIER = 0.25;
  holidayCharge = total × HOLIDAY_MULTIPLIER;
  holidayCharge = ${total.toFixed(0)} × 0.25;
  holidayCharge = ${holidayCharge.toFixed(0)} Kz;
  
  // Adiciona ao total
  total = total + holidayCharge;
  total = ${total.toFixed(0)} + ${holidayCharge.toFixed(0)};
  total = ${(total + holidayCharge).toFixed(0)} Kz;
  
  console.log("Tarifa de feriado aplicada!");
}`,
      description: "Tarifa extra para feriados"
    });
    total += holidayCharge;
  } else {
    steps.push({
      active: false,
      title: "4. Feriado (desativado)",
      code: `// Verifica se é feriado
if (isHoliday === true) {
  // ...código de feriado
} else {
  console.log("Não é feriado");
  // Sem acréscimo ao total
}`,
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
      code: `// Verifica condições climáticas
if (hasRain === true && weatherSeverity > 0) {
  // Calcula multiplicador baseado na intensidade
  // Máximo 40% de acréscimo
  weatherSeverity = ${params.weatherSeverity};
  const MAX_WEATHER_IMPACT = 0.4;
  
  weatherMultiplier = 1 + (weatherSeverity/100 × MAX_WEATHER_IMPACT);
  weatherMultiplier = 1 + (${params.weatherSeverity}/100 × 0.4);
  weatherMultiplier = ${weatherMultiplier.toFixed(2)};
  
  // Calcula o valor adicional
  weatherCharge = total × (weatherMultiplier - 1);
  weatherCharge = ${total.toFixed(0)} × ${(weatherMultiplier - 1).toFixed(2)};
  weatherCharge = ${weatherCharge.toFixed(0)} Kz;
  
  // Adiciona ao total
  total = total + weatherCharge;
  total = ${(total + weatherCharge).toFixed(0)} Kz;
  
  console.log("Acréscimo por chuva aplicado!");
}`,
      description: `Intensidade ${params.weatherSeverity}% aumenta o preço`
    });
    total += weatherCharge;
  } else {
    steps.push({
      active: false,
      title: "5. Chuva (desativada)",
      code: `// Verifica condições climáticas
if (hasRain === true && weatherSeverity > 0) {
  // ...código de chuva
} else {
  console.log("Sem chuva");
  // Sem acréscimo ao total
}`,
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
      code: `// Verifica intensidade do trânsito
trafficIntensity = ${params.trafficIntensity};
const TRAFFIC_THRESHOLD = 30;

if (trafficIntensity > TRAFFIC_THRESHOLD) {
  // Calcula acréscimo progressivo
  // Máximo 50% quando trânsito = 100%
  const MAX_TRAFFIC_IMPACT = 0.5;
  
  trafficMultiplier = 1 + ((trafficIntensity - 30)/100 × MAX_TRAFFIC_IMPACT);
  trafficMultiplier = 1 + ((${params.trafficIntensity} - 30)/100 × 0.5);
  trafficMultiplier = ${trafficMultiplier.toFixed(2)};
  
  // Calcula valor adicional
  trafficCharge = total × (trafficMultiplier - 1);
  trafficCharge = ${total.toFixed(0)} × ${(trafficMultiplier - 1).toFixed(2)};
  trafficCharge = ${trafficCharge.toFixed(0)} Kz;
  
  // Adiciona ao total
  total = total + trafficCharge;
  total = ${(total + trafficCharge).toFixed(0)} Kz;
  
  console.log("Acréscimo por trânsito aplicado!");
}`,
      description: `Trânsito acima de 30% aumenta o tempo da viagem`
    });
    total += trafficCharge;
  } else {
    steps.push({
      active: false,
      title: "6. Trânsito (sem impacto)",
      code: `// Verifica intensidade do trânsito
trafficIntensity = ${params.trafficIntensity};
if (trafficIntensity > 30) {
  // ...código de trânsito
} else {
  console.log("Trânsito ${params.trafficIntensity}% está normal");
  // Sem acréscimo (apenas > 30%)
}`,
      description: "Apenas acima de 30% de intensidade"
    });
  }

  // Step 7: Special Event
  if (params.hasSpecialEvent) {
    const eventCharge = total * 0.30;
    steps.push({
      active: true,
      title: "7. Adiciona Evento Especial (+30%)",
      code: `// Verifica eventos especiais na região
if (hasSpecialEvent === true) {
  // Eventos aumentam demanda em 30%
  const EVENT_MULTIPLIER = 0.30;
  eventCharge = total × EVENT_MULTIPLIER;
  eventCharge = ${total.toFixed(0)} × 0.30;
  eventCharge = ${eventCharge.toFixed(0)} Kz;
  
  // Adiciona ao total
  total = total + eventCharge;
  total = ${total.toFixed(0)} + ${eventCharge.toFixed(0)};
  total = ${(total + eventCharge).toFixed(0)} Kz;
  
  console.log("Acréscimo por evento especial!");
}`,
      description: "Shows, jogos ou festivais aumentam a demanda"
    });
    total += eventCharge;
  } else {
    steps.push({
      active: false,
      title: "7. Evento Especial (desativado)",
      code: `// Verifica eventos especiais na região
if (hasSpecialEvent === true) {
  // ...código de evento
} else {
  console.log("Sem eventos especiais");
  // Sem acréscimo ao total
}`,
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
      code: `// Verifica zona de demanda dinâmica
const SURGE_ZONES = {
  none: 1.0,
  low: 1.2,
  medium: 1.5,
  high: 2.0
};

surgeZone = "${params.surgeZone}";
if (surgeZone !== "none") {
  // Aplica multiplicador da zona
  surgeMultiplier = SURGE_ZONES[surgeZone];
  surgeMultiplier = ${surgeMultiplier}x;
  
  // Calcula valor adicional
  surgeCharge = total × (surgeMultiplier - 1);
  surgeCharge = ${total.toFixed(0)} × ${(surgeMultiplier - 1).toFixed(1)};
  surgeCharge = ${surgeCharge.toFixed(0)} Kz;
  
  // Calcula preço final
  TOTAL_FINAL = total + surgeCharge;
  TOTAL_FINAL = ${total.toFixed(0)} + ${surgeCharge.toFixed(0)};
  TOTAL_FINAL = ${(total + surgeCharge).toFixed(0)} Kz;
  
  console.log("Tarifa dinâmica aplicada!");
  return TOTAL_FINAL;
}`,
      description: "Multiplicador de zona de alta demanda"
    });
    total += surgeCharge;
  } else {
    steps.push({
      active: false,
      title: "8. Tarifa Dinâmica (zona normal)",
      code: `// Verifica zona de demanda dinâmica
surgeZone = "${params.surgeZone}";
if (surgeZone !== "none") {
  // ...código de surge pricing
} else {
  console.log("Zona normal - sem multiplicador");
  TOTAL_FINAL = total;
  TOTAL_FINAL = ${total.toFixed(0)} Kz;
  
  return TOTAL_FINAL;
}`,
      description: "Sem multiplicador adicional"
    });
  }

  return (
    <Card className="h-full bg-slate-900 border-slate-700 flex flex-col">
      <CardHeader className="pb-3 shrink-0">
        <CardTitle className="text-base flex items-center gap-2 text-slate-100">
          <Code2 className="h-4 w-4 text-yellow-400" />
          Algoritmo de Cálculo
        </CardTitle>
        <p className="text-xs text-slate-400 mt-1">
          Veja como o preço é calculado passo a passo
        </p>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <ScrollArea className="h-full max-h-[60vh] md:max-h-[70vh] lg:max-h-[calc(100vh-16rem)]">
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
