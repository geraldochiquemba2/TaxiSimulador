import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code2 } from "lucide-react";
import { SimulationParams } from "@shared/schema";

type CodeLanguage = "javascript" | "python" | "typescript";

interface AlgorithmViewerProps {
  params: SimulationParams;
}

interface Step {
  active: boolean;
  title: string;
  code: Record<CodeLanguage, string>;
  description: string;
}

export function AlgorithmViewer({ params }: AlgorithmViewerProps) {
  const [language, setLanguage] = useState<CodeLanguage>("javascript");

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

  const steps: Step[] = [];

  // Step 1: Base calculation
  steps.push({
    active: true,
    title: "1. Tarifa Base + Distancia",
    code: {
      javascript: `// Define tarifas por categoria
const VEHICLE_FARES = {
  economy: { base: 500, perKm: 180 },
  comfort: { base: 800, perKm: 250 },
  premium: { base: 1200, perKm: 380 },
  xl: { base: 1000, perKm: 280 }
};

// Calcula valores iniciais
const vehicleType = "${params.vehicleType}";
const baseFare = VEHICLE_FARES[vehicleType].base;
// baseFare = ${baseFare.toFixed(0)} Kz

const perKm = VEHICLE_FARES[vehicleType].perKm;
// perKm = ${fare.perKm.toFixed(0)} Kz/km

const distance = ${params.distance}; // km
const distanceCost = distance * perKm;
// distanceCost = ${params.distance} * ${fare.perKm.toFixed(0)} = ${distanceCost.toFixed(0)} Kz

// Soma tarifa base + distancia
let total = baseFare + distanceCost;
// total = ${baseFare.toFixed(0)} + ${distanceCost.toFixed(0)} = ${total.toFixed(0)} Kz`,
      python: `# Define tarifas por categoria
VEHICLE_FARES = {
    "economy": {"base": 500, "per_km": 180},
    "comfort": {"base": 800, "per_km": 250},
    "premium": {"base": 1200, "per_km": 380},
    "xl": {"base": 1000, "per_km": 280}
}

# Calcula valores iniciais
vehicle_type = "${params.vehicleType}"
base_fare = VEHICLE_FARES[vehicle_type]["base"]
# base_fare = ${baseFare.toFixed(0)} Kz

per_km = VEHICLE_FARES[vehicle_type]["per_km"]
# per_km = ${fare.perKm.toFixed(0)} Kz/km

distance = ${params.distance}  # km
distance_cost = distance * per_km
# distance_cost = ${params.distance} * ${fare.perKm.toFixed(0)} = ${distanceCost.toFixed(0)} Kz

# Soma tarifa base + distancia
total = base_fare + distance_cost
# total = ${baseFare.toFixed(0)} + ${distanceCost.toFixed(0)} = ${total.toFixed(0)} Kz`,
      typescript: `// Define tarifas por categoria
interface VehicleFare {
  base: number;
  perKm: number;
}

const VEHICLE_FARES: Record<string, VehicleFare> = {
  economy: { base: 500, perKm: 180 },
  comfort: { base: 800, perKm: 250 },
  premium: { base: 1200, perKm: 380 },
  xl: { base: 1000, perKm: 280 }
};

// Calcula valores iniciais
const vehicleType: string = "${params.vehicleType}";
const baseFare: number = VEHICLE_FARES[vehicleType].base;
// baseFare = ${baseFare.toFixed(0)} Kz

const perKm: number = VEHICLE_FARES[vehicleType].perKm;
// perKm = ${fare.perKm.toFixed(0)} Kz/km

const distance: number = ${params.distance}; // km
const distanceCost: number = distance * perKm;
// distanceCost = ${params.distance} * ${fare.perKm.toFixed(0)} = ${distanceCost.toFixed(0)} Kz

// Soma tarifa base + distancia
let total: number = baseFare + distanceCost;
// total = ${baseFare.toFixed(0)} + ${distanceCost.toFixed(0)} = ${total.toFixed(0)} Kz`
    },
    description: "Calcula o preco inicial baseado no tipo de veiculo e distancia"
  });

  // Step 2: Rush hour
  if (params.isRushHour) {
    const rushCharge = total * 0.35;
    steps.push({
      active: true,
      title: "2. Adiciona Horario de Pico (+35%)",
      code: {
        javascript: `// Verifica horario de pico
if (isRushHour === true) {
  // Calcula acrescimo de 35%
  const RUSH_MULTIPLIER = 0.35;
  const rushHourCharge = total * RUSH_MULTIPLIER;
  // rushHourCharge = ${total.toFixed(0)} * 0.35 = ${rushCharge.toFixed(0)} Kz
  
  // Adiciona ao total
  total = total + rushHourCharge;
  // total = ${total.toFixed(0)} + ${rushCharge.toFixed(0)} = ${(total + rushCharge).toFixed(0)} Kz
  
  console.log("Horario de pico aplicado!");
}`,
        python: `# Verifica horario de pico
if is_rush_hour:
    # Calcula acrescimo de 35%
    RUSH_MULTIPLIER = 0.35
    rush_hour_charge = total * RUSH_MULTIPLIER
    # rush_hour_charge = ${total.toFixed(0)} * 0.35 = ${rushCharge.toFixed(0)} Kz
    
    # Adiciona ao total
    total = total + rush_hour_charge
    # total = ${total.toFixed(0)} + ${rushCharge.toFixed(0)} = ${(total + rushCharge).toFixed(0)} Kz
    
    print("Horario de pico aplicado!")`,
        typescript: `// Verifica horario de pico
if (isRushHour === true) {
  // Calcula acrescimo de 35%
  const RUSH_MULTIPLIER: number = 0.35;
  const rushHourCharge: number = total * RUSH_MULTIPLIER;
  // rushHourCharge = ${total.toFixed(0)} * 0.35 = ${rushCharge.toFixed(0)} Kz
  
  // Adiciona ao total
  total = total + rushHourCharge;
  // total = ${total.toFixed(0)} + ${rushCharge.toFixed(0)} = ${(total + rushCharge).toFixed(0)} Kz
  
  console.log("Horario de pico aplicado!");
}`
      },
      description: "Aplica multiplicador de horario de pico"
    });
    total += rushCharge;
  } else {
    steps.push({
      active: false,
      title: "2. Horario de Pico (desativado)",
      code: {
        javascript: `// Verifica horario de pico
if (isRushHour === true) {
  // ...codigo do horario de pico
} else {
  console.log("Nao e horario de pico");
  // Sem acrescimo ao total
}`,
        python: `# Verifica horario de pico
if is_rush_hour:
    # ...codigo do horario de pico
    pass
else:
    print("Nao e horario de pico")
    # Sem acrescimo ao total`,
        typescript: `// Verifica horario de pico
if (isRushHour === true) {
  // ...codigo do horario de pico
} else {
  console.log("Nao e horario de pico");
  // Sem acrescimo ao total
}`
      },
      description: "Condicao nao aplicada"
    });
  }

  // Step 3: Night fare
  if (params.hour >= 0 && params.hour < 6) {
    const nightCharge = total * 0.20;
    steps.push({
      active: true,
      title: "3. Adiciona Tarifa Noturna (+20%)",
      code: {
        javascript: `// Verifica horario noturno (00h-06h)
const hour = ${params.hour};
if (hour >= 0 && hour < 6) {
  // Calcula adicional noturno de 20%
  const NIGHT_MULTIPLIER = 0.20;
  const nightCharge = total * NIGHT_MULTIPLIER;
  // nightCharge = ${total.toFixed(0)} * 0.20 = ${nightCharge.toFixed(0)} Kz
  
  // Adiciona ao total
  total = total + nightCharge;
  // total = ${total.toFixed(0)} + ${nightCharge.toFixed(0)} = ${(total + nightCharge).toFixed(0)} Kz
  
  console.log("Tarifa noturna aplicada!");
}`,
        python: `# Verifica horario noturno (00h-06h)
hour = ${params.hour}
if 0 <= hour < 6:
    # Calcula adicional noturno de 20%
    NIGHT_MULTIPLIER = 0.20
    night_charge = total * NIGHT_MULTIPLIER
    # night_charge = ${total.toFixed(0)} * 0.20 = ${nightCharge.toFixed(0)} Kz
    
    # Adiciona ao total
    total = total + night_charge
    # total = ${total.toFixed(0)} + ${nightCharge.toFixed(0)} = ${(total + nightCharge).toFixed(0)} Kz
    
    print("Tarifa noturna aplicada!")`,
        typescript: `// Verifica horario noturno (00h-06h)
const hour: number = ${params.hour};
if (hour >= 0 && hour < 6) {
  // Calcula adicional noturno de 20%
  const NIGHT_MULTIPLIER: number = 0.20;
  const nightCharge: number = total * NIGHT_MULTIPLIER;
  // nightCharge = ${total.toFixed(0)} * 0.20 = ${nightCharge.toFixed(0)} Kz
  
  // Adiciona ao total
  total = total + nightCharge;
  // total = ${total.toFixed(0)} + ${nightCharge.toFixed(0)} = ${(total + nightCharge).toFixed(0)} Kz
  
  console.log("Tarifa noturna aplicada!");
}`
      },
      description: "Horario entre 00h-06h tem adicional noturno"
    });
    total += nightCharge;
  } else {
    steps.push({
      active: false,
      title: "3. Tarifa Noturna (desativada)",
      code: {
        javascript: `// Verifica horario noturno (00h-06h)
const hour = ${params.hour};
if (hour >= 0 && hour < 6) {
  // ...codigo tarifa noturna
} else {
  console.log("Horario ${params.hour}h nao e noturno");
  // Sem acrescimo ao total
}`,
        python: `# Verifica horario noturno (00h-06h)
hour = ${params.hour}
if 0 <= hour < 6:
    # ...codigo tarifa noturna
    pass
else:
    print("Horario ${params.hour}h nao e noturno")
    # Sem acrescimo ao total`,
        typescript: `// Verifica horario noturno (00h-06h)
const hour: number = ${params.hour};
if (hour >= 0 && hour < 6) {
  // ...codigo tarifa noturna
} else {
  console.log("Horario ${params.hour}h nao e noturno");
  // Sem acrescimo ao total
}`
      },
      description: "Apenas entre 00h-06h"
    });
  }

  // Step 4: Holiday
  if (params.isHoliday) {
    const holidayCharge = total * 0.25;
    steps.push({
      active: true,
      title: "4. Adiciona Feriado (+25%)",
      code: {
        javascript: `// Verifica se e feriado
if (isHoliday === true) {
  // Calcula acrescimo de feriado (25%)
  const HOLIDAY_MULTIPLIER = 0.25;
  const holidayCharge = total * HOLIDAY_MULTIPLIER;
  // holidayCharge = ${total.toFixed(0)} * 0.25 = ${holidayCharge.toFixed(0)} Kz
  
  // Adiciona ao total
  total = total + holidayCharge;
  // total = ${total.toFixed(0)} + ${holidayCharge.toFixed(0)} = ${(total + holidayCharge).toFixed(0)} Kz
  
  console.log("Tarifa de feriado aplicada!");
}`,
        python: `# Verifica se e feriado
if is_holiday:
    # Calcula acrescimo de feriado (25%)
    HOLIDAY_MULTIPLIER = 0.25
    holiday_charge = total * HOLIDAY_MULTIPLIER
    # holiday_charge = ${total.toFixed(0)} * 0.25 = ${holidayCharge.toFixed(0)} Kz
    
    # Adiciona ao total
    total = total + holiday_charge
    # total = ${total.toFixed(0)} + ${holidayCharge.toFixed(0)} = ${(total + holidayCharge).toFixed(0)} Kz
    
    print("Tarifa de feriado aplicada!")`,
        typescript: `// Verifica se e feriado
if (isHoliday === true) {
  // Calcula acrescimo de feriado (25%)
  const HOLIDAY_MULTIPLIER: number = 0.25;
  const holidayCharge: number = total * HOLIDAY_MULTIPLIER;
  // holidayCharge = ${total.toFixed(0)} * 0.25 = ${holidayCharge.toFixed(0)} Kz
  
  // Adiciona ao total
  total = total + holidayCharge;
  // total = ${total.toFixed(0)} + ${holidayCharge.toFixed(0)} = ${(total + holidayCharge).toFixed(0)} Kz
  
  console.log("Tarifa de feriado aplicada!");
}`
      },
      description: "Tarifa extra para feriados"
    });
    total += holidayCharge;
  } else {
    steps.push({
      active: false,
      title: "4. Feriado (desativado)",
      code: {
        javascript: `// Verifica se e feriado
if (isHoliday === true) {
  // ...codigo de feriado
} else {
  console.log("Nao e feriado");
  // Sem acrescimo ao total
}`,
        python: `# Verifica se e feriado
if is_holiday:
    # ...codigo de feriado
    pass
else:
    print("Nao e feriado")
    # Sem acrescimo ao total`,
        typescript: `// Verifica se e feriado
if (isHoliday === true) {
  // ...codigo de feriado
} else {
  console.log("Nao e feriado");
  // Sem acrescimo ao total
}`
      },
      description: "Condicao nao aplicada"
    });
  }

  // Step 5: Rain
  if (params.hasRain && params.weatherSeverity > 0) {
    const weatherMultiplier = 1 + (params.weatherSeverity / 100) * 0.4;
    const weatherCharge = total * (weatherMultiplier - 1);
    steps.push({
      active: true,
      title: `5. Adiciona Chuva (+${((weatherMultiplier - 1) * 100).toFixed(0)}%)`,
      code: {
        javascript: `// Verifica condicoes climaticas
if (hasRain === true && weatherSeverity > 0) {
  // Calcula multiplicador baseado na intensidade
  // Maximo 40% de acrescimo
  const weatherSeverity = ${params.weatherSeverity};
  const MAX_WEATHER_IMPACT = 0.4;
  
  const weatherMultiplier = 1 + (weatherSeverity / 100 * MAX_WEATHER_IMPACT);
  // weatherMultiplier = 1 + (${params.weatherSeverity}/100 * 0.4) = ${weatherMultiplier.toFixed(2)}
  
  // Calcula o valor adicional
  const weatherCharge = total * (weatherMultiplier - 1);
  // weatherCharge = ${total.toFixed(0)} * ${(weatherMultiplier - 1).toFixed(2)} = ${weatherCharge.toFixed(0)} Kz
  
  // Adiciona ao total
  total = total + weatherCharge;
  // total = ${(total + weatherCharge).toFixed(0)} Kz
  
  console.log("Acrescimo por chuva aplicado!");
}`,
        python: `# Verifica condicoes climaticas
if has_rain and weather_severity > 0:
    # Calcula multiplicador baseado na intensidade
    # Maximo 40% de acrescimo
    weather_severity = ${params.weatherSeverity}
    MAX_WEATHER_IMPACT = 0.4
    
    weather_multiplier = 1 + (weather_severity / 100 * MAX_WEATHER_IMPACT)
    # weather_multiplier = 1 + (${params.weatherSeverity}/100 * 0.4) = ${weatherMultiplier.toFixed(2)}
    
    # Calcula o valor adicional
    weather_charge = total * (weather_multiplier - 1)
    # weather_charge = ${total.toFixed(0)} * ${(weatherMultiplier - 1).toFixed(2)} = ${weatherCharge.toFixed(0)} Kz
    
    # Adiciona ao total
    total = total + weather_charge
    # total = ${(total + weatherCharge).toFixed(0)} Kz
    
    print("Acrescimo por chuva aplicado!")`,
        typescript: `// Verifica condicoes climaticas
if (hasRain === true && weatherSeverity > 0) {
  // Calcula multiplicador baseado na intensidade
  // Maximo 40% de acrescimo
  const weatherSeverity: number = ${params.weatherSeverity};
  const MAX_WEATHER_IMPACT: number = 0.4;
  
  const weatherMultiplier: number = 1 + (weatherSeverity / 100 * MAX_WEATHER_IMPACT);
  // weatherMultiplier = 1 + (${params.weatherSeverity}/100 * 0.4) = ${weatherMultiplier.toFixed(2)}
  
  // Calcula o valor adicional
  const weatherCharge: number = total * (weatherMultiplier - 1);
  // weatherCharge = ${total.toFixed(0)} * ${(weatherMultiplier - 1).toFixed(2)} = ${weatherCharge.toFixed(0)} Kz
  
  // Adiciona ao total
  total = total + weatherCharge;
  // total = ${(total + weatherCharge).toFixed(0)} Kz
  
  console.log("Acrescimo por chuva aplicado!");
}`
      },
      description: `Intensidade ${params.weatherSeverity}% aumenta o preco`
    });
    total += weatherCharge;
  } else {
    steps.push({
      active: false,
      title: "5. Chuva (desativada)",
      code: {
        javascript: `// Verifica condicoes climaticas
if (hasRain === true && weatherSeverity > 0) {
  // ...codigo de chuva
} else {
  console.log("Sem chuva");
  // Sem acrescimo ao total
}`,
        python: `# Verifica condicoes climaticas
if has_rain and weather_severity > 0:
    # ...codigo de chuva
    pass
else:
    print("Sem chuva")
    # Sem acrescimo ao total`,
        typescript: `// Verifica condicoes climaticas
if (hasRain === true && weatherSeverity > 0) {
  // ...codigo de chuva
} else {
  console.log("Sem chuva");
  // Sem acrescimo ao total
}`
      },
      description: "Condicao nao aplicada"
    });
  }

  // Step 6: Traffic
  if (params.trafficIntensity > 30) {
    const trafficMultiplier = 1 + ((params.trafficIntensity - 30) / 100) * 0.5;
    const trafficCharge = total * (trafficMultiplier - 1);
    steps.push({
      active: true,
      title: `6. Adiciona Transito (+${((trafficMultiplier - 1) * 100).toFixed(0)}%)`,
      code: {
        javascript: `// Verifica intensidade do transito
const trafficIntensity = ${params.trafficIntensity};
const TRAFFIC_THRESHOLD = 30;

if (trafficIntensity > TRAFFIC_THRESHOLD) {
  // Calcula acrescimo progressivo
  // Maximo 50% quando transito = 100%
  const MAX_TRAFFIC_IMPACT = 0.5;
  
  const trafficMultiplier = 1 + ((trafficIntensity - 30) / 100 * MAX_TRAFFIC_IMPACT);
  // trafficMultiplier = 1 + ((${params.trafficIntensity} - 30)/100 * 0.5) = ${trafficMultiplier.toFixed(2)}
  
  // Calcula valor adicional
  const trafficCharge = total * (trafficMultiplier - 1);
  // trafficCharge = ${total.toFixed(0)} * ${(trafficMultiplier - 1).toFixed(2)} = ${trafficCharge.toFixed(0)} Kz
  
  // Adiciona ao total
  total = total + trafficCharge;
  // total = ${(total + trafficCharge).toFixed(0)} Kz
  
  console.log("Acrescimo por transito aplicado!");
}`,
        python: `# Verifica intensidade do transito
traffic_intensity = ${params.trafficIntensity}
TRAFFIC_THRESHOLD = 30

if traffic_intensity > TRAFFIC_THRESHOLD:
    # Calcula acrescimo progressivo
    # Maximo 50% quando transito = 100%
    MAX_TRAFFIC_IMPACT = 0.5
    
    traffic_multiplier = 1 + ((traffic_intensity - 30) / 100 * MAX_TRAFFIC_IMPACT)
    # traffic_multiplier = 1 + ((${params.trafficIntensity} - 30)/100 * 0.5) = ${trafficMultiplier.toFixed(2)}
    
    # Calcula valor adicional
    traffic_charge = total * (traffic_multiplier - 1)
    # traffic_charge = ${total.toFixed(0)} * ${(trafficMultiplier - 1).toFixed(2)} = ${trafficCharge.toFixed(0)} Kz
    
    # Adiciona ao total
    total = total + traffic_charge
    # total = ${(total + trafficCharge).toFixed(0)} Kz
    
    print("Acrescimo por transito aplicado!")`,
        typescript: `// Verifica intensidade do transito
const trafficIntensity: number = ${params.trafficIntensity};
const TRAFFIC_THRESHOLD: number = 30;

if (trafficIntensity > TRAFFIC_THRESHOLD) {
  // Calcula acrescimo progressivo
  // Maximo 50% quando transito = 100%
  const MAX_TRAFFIC_IMPACT: number = 0.5;
  
  const trafficMultiplier: number = 1 + ((trafficIntensity - 30) / 100 * MAX_TRAFFIC_IMPACT);
  // trafficMultiplier = 1 + ((${params.trafficIntensity} - 30)/100 * 0.5) = ${trafficMultiplier.toFixed(2)}
  
  // Calcula valor adicional
  const trafficCharge: number = total * (trafficMultiplier - 1);
  // trafficCharge = ${total.toFixed(0)} * ${(trafficMultiplier - 1).toFixed(2)} = ${trafficCharge.toFixed(0)} Kz
  
  // Adiciona ao total
  total = total + trafficCharge;
  // total = ${(total + trafficCharge).toFixed(0)} Kz
  
  console.log("Acrescimo por transito aplicado!");
}`
      },
      description: `Transito acima de 30% aumenta o tempo da viagem`
    });
    total += trafficCharge;
  } else {
    steps.push({
      active: false,
      title: "6. Transito (sem impacto)",
      code: {
        javascript: `// Verifica intensidade do transito
const trafficIntensity = ${params.trafficIntensity};
if (trafficIntensity > 30) {
  // ...codigo de transito
} else {
  console.log("Transito ${params.trafficIntensity}% esta normal");
  // Sem acrescimo (apenas > 30%)
}`,
        python: `# Verifica intensidade do transito
traffic_intensity = ${params.trafficIntensity}
if traffic_intensity > 30:
    # ...codigo de transito
    pass
else:
    print("Transito ${params.trafficIntensity}% esta normal")
    # Sem acrescimo (apenas > 30%)`,
        typescript: `// Verifica intensidade do transito
const trafficIntensity: number = ${params.trafficIntensity};
if (trafficIntensity > 30) {
  // ...codigo de transito
} else {
  console.log("Transito ${params.trafficIntensity}% esta normal");
  // Sem acrescimo (apenas > 30%)
}`
      },
      description: "Apenas acima de 30% de intensidade"
    });
  }

  // Step 7: Special Event
  if (params.hasSpecialEvent) {
    const eventCharge = total * 0.30;
    steps.push({
      active: true,
      title: "7. Adiciona Evento Especial (+30%)",
      code: {
        javascript: `// Verifica eventos especiais na regiao
if (hasSpecialEvent === true) {
  // Eventos aumentam demanda em 30%
  const EVENT_MULTIPLIER = 0.30;
  const eventCharge = total * EVENT_MULTIPLIER;
  // eventCharge = ${total.toFixed(0)} * 0.30 = ${eventCharge.toFixed(0)} Kz
  
  // Adiciona ao total
  total = total + eventCharge;
  // total = ${total.toFixed(0)} + ${eventCharge.toFixed(0)} = ${(total + eventCharge).toFixed(0)} Kz
  
  console.log("Acrescimo por evento especial!");
}`,
        python: `# Verifica eventos especiais na regiao
if has_special_event:
    # Eventos aumentam demanda em 30%
    EVENT_MULTIPLIER = 0.30
    event_charge = total * EVENT_MULTIPLIER
    # event_charge = ${total.toFixed(0)} * 0.30 = ${eventCharge.toFixed(0)} Kz
    
    # Adiciona ao total
    total = total + event_charge
    # total = ${total.toFixed(0)} + ${eventCharge.toFixed(0)} = ${(total + eventCharge).toFixed(0)} Kz
    
    print("Acrescimo por evento especial!")`,
        typescript: `// Verifica eventos especiais na regiao
if (hasSpecialEvent === true) {
  // Eventos aumentam demanda em 30%
  const EVENT_MULTIPLIER: number = 0.30;
  const eventCharge: number = total * EVENT_MULTIPLIER;
  // eventCharge = ${total.toFixed(0)} * 0.30 = ${eventCharge.toFixed(0)} Kz
  
  // Adiciona ao total
  total = total + eventCharge;
  // total = ${total.toFixed(0)} + ${eventCharge.toFixed(0)} = ${(total + eventCharge).toFixed(0)} Kz
  
  console.log("Acrescimo por evento especial!");
}`
      },
      description: "Shows, jogos ou festivais aumentam a demanda"
    });
    total += eventCharge;
  } else {
    steps.push({
      active: false,
      title: "7. Evento Especial (desativado)",
      code: {
        javascript: `// Verifica eventos especiais na regiao
if (hasSpecialEvent === true) {
  // ...codigo de evento
} else {
  console.log("Sem eventos especiais");
  // Sem acrescimo ao total
}`,
        python: `# Verifica eventos especiais na regiao
if has_special_event:
    # ...codigo de evento
    pass
else:
    print("Sem eventos especiais")
    # Sem acrescimo ao total`,
        typescript: `// Verifica eventos especiais na regiao
if (hasSpecialEvent === true) {
  // ...codigo de evento
} else {
  console.log("Sem eventos especiais");
  // Sem acrescimo ao total
}`
      },
      description: "Condicao nao aplicada"
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
      title: `8. Aplica Tarifa Dinamica (${surgeMultiplier}x)`,
      code: {
        javascript: `// Verifica zona de demanda dinamica
const SURGE_ZONES = {
  none: 1.0,
  low: 1.2,
  medium: 1.5,
  high: 2.0
};

const surgeZone = "${params.surgeZone}";
if (surgeZone !== "none") {
  // Aplica multiplicador da zona
  const surgeMultiplier = SURGE_ZONES[surgeZone];
  // surgeMultiplier = ${surgeMultiplier}x
  
  // Calcula valor adicional
  const surgeCharge = total * (surgeMultiplier - 1);
  // surgeCharge = ${total.toFixed(0)} * ${(surgeMultiplier - 1).toFixed(1)} = ${surgeCharge.toFixed(0)} Kz
  
  // Calcula preco final
  const TOTAL_FINAL = total + surgeCharge;
  // TOTAL_FINAL = ${total.toFixed(0)} + ${surgeCharge.toFixed(0)} = ${(total + surgeCharge).toFixed(0)} Kz
  
  console.log("Tarifa dinamica aplicada!");
  return TOTAL_FINAL;
}`,
        python: `# Verifica zona de demanda dinamica
SURGE_ZONES = {
    "none": 1.0,
    "low": 1.2,
    "medium": 1.5,
    "high": 2.0
}

surge_zone = "${params.surgeZone}"
if surge_zone != "none":
    # Aplica multiplicador da zona
    surge_multiplier = SURGE_ZONES[surge_zone]
    # surge_multiplier = ${surgeMultiplier}x
    
    # Calcula valor adicional
    surge_charge = total * (surge_multiplier - 1)
    # surge_charge = ${total.toFixed(0)} * ${(surgeMultiplier - 1).toFixed(1)} = ${surgeCharge.toFixed(0)} Kz
    
    # Calcula preco final
    TOTAL_FINAL = total + surge_charge
    # TOTAL_FINAL = ${total.toFixed(0)} + ${surgeCharge.toFixed(0)} = ${(total + surgeCharge).toFixed(0)} Kz
    
    print("Tarifa dinamica aplicada!")
    return TOTAL_FINAL`,
        typescript: `// Verifica zona de demanda dinamica
const SURGE_ZONES: Record<string, number> = {
  none: 1.0,
  low: 1.2,
  medium: 1.5,
  high: 2.0
};

const surgeZone: string = "${params.surgeZone}";
if (surgeZone !== "none") {
  // Aplica multiplicador da zona
  const surgeMultiplier: number = SURGE_ZONES[surgeZone];
  // surgeMultiplier = ${surgeMultiplier}x
  
  // Calcula valor adicional
  const surgeCharge: number = total * (surgeMultiplier - 1);
  // surgeCharge = ${total.toFixed(0)} * ${(surgeMultiplier - 1).toFixed(1)} = ${surgeCharge.toFixed(0)} Kz
  
  // Calcula preco final
  const TOTAL_FINAL: number = total + surgeCharge;
  // TOTAL_FINAL = ${total.toFixed(0)} + ${surgeCharge.toFixed(0)} = ${(total + surgeCharge).toFixed(0)} Kz
  
  console.log("Tarifa dinamica aplicada!");
  return TOTAL_FINAL;
}`
      },
      description: "Multiplicador de zona de alta demanda"
    });
    total += surgeCharge;
  } else {
    steps.push({
      active: false,
      title: "8. Tarifa Dinamica (zona normal)",
      code: {
        javascript: `// Verifica zona de demanda dinamica
const surgeZone = "${params.surgeZone}";
if (surgeZone !== "none") {
  // ...codigo de surge pricing
} else {
  console.log("Zona normal - sem multiplicador");
  const TOTAL_FINAL = total;
  // TOTAL_FINAL = ${total.toFixed(0)} Kz
  
  return TOTAL_FINAL;
}`,
        python: `# Verifica zona de demanda dinamica
surge_zone = "${params.surgeZone}"
if surge_zone != "none":
    # ...codigo de surge pricing
    pass
else:
    print("Zona normal - sem multiplicador")
    TOTAL_FINAL = total
    # TOTAL_FINAL = ${total.toFixed(0)} Kz
    
    return TOTAL_FINAL`,
        typescript: `// Verifica zona de demanda dinamica
const surgeZone: string = "${params.surgeZone}";
if (surgeZone !== "none") {
  // ...codigo de surge pricing
} else {
  console.log("Zona normal - sem multiplicador");
  const TOTAL_FINAL: number = total;
  // TOTAL_FINAL = ${total.toFixed(0)} Kz
  
  return TOTAL_FINAL;
}`
      },
      description: "Sem multiplicador adicional"
    });
  }

  const getLanguageLabel = (lang: CodeLanguage) => {
    switch (lang) {
      case "javascript": return "JavaScript";
      case "python": return "Python";
      case "typescript": return "TypeScript";
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-700 flex flex-col h-[calc(100vh-6rem)]">
      <CardHeader className="pb-3 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2 text-slate-100">
            <Code2 className="h-4 w-4 text-yellow-400" />
            Algoritmo de Calculo
          </CardTitle>
          <Select value={language} onValueChange={(value: CodeLanguage) => setLanguage(value)}>
            <SelectTrigger className="w-[130px] h-8 bg-slate-800 border-slate-600 text-slate-200" data-testid="select-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="javascript" className="text-slate-200">JavaScript</SelectItem>
              <SelectItem value="python" className="text-slate-200">Python</SelectItem>
              <SelectItem value="typescript" className="text-slate-200">TypeScript</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Veja como o preco e calculado passo a passo
        </p>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
        <ScrollArea className="h-full px-6 pb-6">
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
                  <code className="text-green-400">{step.code[language]}</code>
                </pre>
              </div>
            ))}

            <div className="mt-6 p-4 rounded-lg bg-yellow-500/20 border-2 border-yellow-500">
              <div className="text-center">
                <p className="text-xs text-slate-300 mb-1">Preco Final Calculado</p>
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
