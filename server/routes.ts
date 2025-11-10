import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { simulationParamsSchema, type PriceResult, type PriceBreakdownItem } from "@shared/schema";

function calculatePrice(params: z.infer<typeof simulationParamsSchema>): PriceResult {
  const VEHICLE_BASE_FARES = {
    economy: 500,
    comfort: 800,
    premium: 1200,
    xl: 1000,
  };

  const VEHICLE_PER_KM = {
    economy: 180,
    comfort: 250,
    premium: 380,
    xl: 280,
  };

  let baseFare = VEHICLE_BASE_FARES[params.vehicleType];
  const distanceCost = params.distance * VEHICLE_PER_KM[params.vehicleType];
  
  const breakdown: PriceBreakdownItem[] = [];
  
  breakdown.push({
    label: "Tarifa Base",
    value: baseFare,
    impact: "medium",
  });

  breakdown.push({
    label: `Distância (${params.distance} km)`,
    value: distanceCost,
    impact: params.distance > 20 ? "high" : params.distance > 10 ? "medium" : "low",
  });

  let totalPrice = baseFare + distanceCost;
  let surgeMultiplier = 1.0;

  if (params.isRushHour) {
    const rushHourCharge = totalPrice * 0.35;
    breakdown.push({
      label: "Horário de Pico",
      value: rushHourCharge,
      multiplier: 1.35,
      impact: "high",
    });
    totalPrice += rushHourCharge;
  }

  if (params.hour >= 0 && params.hour < 6) {
    const nightCharge = totalPrice * 0.20;
    breakdown.push({
      label: "Tarifa Noturna",
      value: nightCharge,
      multiplier: 1.20,
      impact: "medium",
    });
    totalPrice += nightCharge;
  }

  if (params.isHoliday) {
    const holidayCharge = totalPrice * 0.25;
    breakdown.push({
      label: "Feriado",
      value: holidayCharge,
      multiplier: 1.25,
      impact: "high",
    });
    totalPrice += holidayCharge;
  }

  if (params.hasRain && params.weatherSeverity > 0) {
    const weatherMultiplier = 1 + (params.weatherSeverity / 100) * 0.4;
    const weatherCharge = totalPrice * (weatherMultiplier - 1);
    breakdown.push({
      label: `Chuva (${params.weatherSeverity}% intensidade)`,
      value: weatherCharge,
      multiplier: weatherMultiplier,
      impact: params.weatherSeverity > 60 ? "high" : "medium",
    });
    totalPrice += weatherCharge;
  }

  if (params.trafficIntensity > 30) {
    const trafficMultiplier = 1 + ((params.trafficIntensity - 30) / 100) * 0.5;
    const trafficCharge = totalPrice * (trafficMultiplier - 1);
    breakdown.push({
      label: `Trânsito Intenso (${params.trafficIntensity}%)`,
      value: trafficCharge,
      multiplier: trafficMultiplier,
      impact: params.trafficIntensity > 70 ? "high" : "medium",
    });
    totalPrice += trafficCharge;
  }

  if (params.hasSpecialEvent) {
    const eventCharge = totalPrice * 0.30;
    breakdown.push({
      label: "Evento Especial na Região",
      value: eventCharge,
      multiplier: 1.30,
      impact: "high",
    });
    totalPrice += eventCharge;
  }

  if (params.surgeZone !== "none") {
    const surgeMultipliers = {
      none: 1.0,
      low: 1.2,
      medium: 1.5,
      high: 2.0,
    };
    
    surgeMultiplier = surgeMultipliers[params.surgeZone];
    const surgeCharge = totalPrice * (surgeMultiplier - 1);
    
    breakdown.push({
      label: `Tarifa Dinâmica - Zona ${params.surgeZone === "low" ? "Baixa" : params.surgeZone === "medium" ? "Média" : "Alta"}`,
      value: surgeCharge,
      multiplier: surgeMultiplier,
      impact: "high",
    });
    totalPrice += surgeCharge;
  }

  const baseComparisonPrice = VEHICLE_BASE_FARES[params.vehicleType] + distanceCost;
  const percentageChange = ((totalPrice - baseComparisonPrice) / baseComparisonPrice) * 100;

  return {
    totalPrice: Math.round(totalPrice * 100) / 100,
    baseFare: Math.round((baseFare + distanceCost) * 100) / 100,
    breakdown,
    surgeMultiplier,
    percentageChange: Math.round(percentageChange * 10) / 10,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime() 
    });
  });

  app.post("/api/calculate-price", async (req, res) => {
    try {
      const params = simulationParamsSchema.parse(req.body);
      const result = calculatePrice(params);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid parameters", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
