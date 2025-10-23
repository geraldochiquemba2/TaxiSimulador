import { z } from "zod";

// Simulation parameters schema
export const simulationParamsSchema = z.object({
  // Trip details
  distance: z.number().min(0).max(100),
  vehicleType: z.enum(["economy", "comfort", "premium", "xl"]),
  
  // Time factors
  hour: z.number().min(0).max(23),
  isRushHour: z.boolean(),
  isHoliday: z.boolean(),
  
  // Weather and traffic
  hasRain: z.boolean(),
  weatherSeverity: z.number().min(0).max(100),
  trafficIntensity: z.number().min(0).max(100),
  
  // Special scenarios
  hasSpecialEvent: z.boolean(),
  surgeZone: z.enum(["none", "low", "medium", "high"]),
});

export type SimulationParams = z.infer<typeof simulationParamsSchema>;

// Price breakdown item
export interface PriceBreakdownItem {
  label: string;
  value: number;
  multiplier?: number;
  impact: "low" | "medium" | "high";
}

// Price calculation result
export interface PriceResult {
  totalPrice: number;
  baseFare: number;
  breakdown: PriceBreakdownItem[];
  surgeMultiplier: number;
  percentageChange: number;
}

// Scenario preset
export interface ScenarioPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  params: Partial<SimulationParams>;
}
