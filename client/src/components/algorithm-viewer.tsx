import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code2 } from "lucide-react";
import { SimulationParams } from "@shared/schema";

type CodeLanguage = "javascript" | "python" | "typescript" | "go" | "java" | "ruby" | "csharp" | "php" | "rust" | "kotlin";

interface AlgorithmViewerProps {
  params: SimulationParams;
}

interface Step {
  active: boolean;
  title: string;
  description: string;
}

function generateCode(
  language: CodeLanguage,
  params: SimulationParams,
  fare: { base: number; perKm: number },
  baseFare: number,
  distanceCost: number,
  total: number
) {
  const step1Codes: Record<CodeLanguage, string> = {
    javascript: `// Define tarifas por categoria
const VEHICLE_FARES = {
  economy: { base: 500, perKm: 180 },
  comfort: { base: 800, perKm: 250 },
  premium: { base: 1200, perKm: 380 },
  xl: { base: 1000, perKm: 280 }
};

const vehicleType = "${params.vehicleType}";
const baseFare = VEHICLE_FARES[vehicleType].base;
// baseFare = ${baseFare.toFixed(0)} Kz

const perKm = VEHICLE_FARES[vehicleType].perKm;
const distance = ${params.distance};
const distanceCost = distance * perKm;
// distanceCost = ${distanceCost.toFixed(0)} Kz

let total = baseFare + distanceCost;
// total = ${total.toFixed(0)} Kz`,
    python: `# Define tarifas por categoria
VEHICLE_FARES = {
    "economy": {"base": 500, "per_km": 180},
    "comfort": {"base": 800, "per_km": 250},
    "premium": {"base": 1200, "per_km": 380},
    "xl": {"base": 1000, "per_km": 280}
}

vehicle_type = "${params.vehicleType}"
base_fare = VEHICLE_FARES[vehicle_type]["base"]
# base_fare = ${baseFare.toFixed(0)} Kz

per_km = VEHICLE_FARES[vehicle_type]["per_km"]
distance = ${params.distance}
distance_cost = distance * per_km
# distance_cost = ${distanceCost.toFixed(0)} Kz

total = base_fare + distance_cost
# total = ${total.toFixed(0)} Kz`,
    typescript: `interface VehicleFare {
  base: number;
  perKm: number;
}

const VEHICLE_FARES: Record<string, VehicleFare> = {
  economy: { base: 500, perKm: 180 },
  comfort: { base: 800, perKm: 250 },
  premium: { base: 1200, perKm: 380 },
  xl: { base: 1000, perKm: 280 }
};

const vehicleType: string = "${params.vehicleType}";
const baseFare: number = VEHICLE_FARES[vehicleType].base;
// baseFare = ${baseFare.toFixed(0)} Kz

const perKm: number = VEHICLE_FARES[vehicleType].perKm;
const distance: number = ${params.distance};
const distanceCost: number = distance * perKm;
// distanceCost = ${distanceCost.toFixed(0)} Kz

let total: number = baseFare + distanceCost;
// total = ${total.toFixed(0)} Kz`,
    go: `package main

type VehicleFare struct {
    Base  int
    PerKm int
}

var vehicleFares = map[string]VehicleFare{
    "economy": {Base: 500, PerKm: 180},
    "comfort": {Base: 800, PerKm: 250},
    "premium": {Base: 1200, PerKm: 380},
    "xl":      {Base: 1000, PerKm: 280},
}

vehicleType := "${params.vehicleType}"
fare := vehicleFares[vehicleType]
baseFare := fare.Base
// baseFare = ${baseFare.toFixed(0)} Kz

perKm := fare.PerKm
distance := ${params.distance}
distanceCost := distance * perKm
// distanceCost = ${distanceCost.toFixed(0)} Kz

total := baseFare + distanceCost
// total = ${total.toFixed(0)} Kz`,
    java: `import java.util.Map;
import java.util.HashMap;

class VehicleFare {
    int base;
    int perKm;
    
    VehicleFare(int base, int perKm) {
        this.base = base;
        this.perKm = perKm;
    }
}

Map<String, VehicleFare> vehicleFares = new HashMap<>();
vehicleFares.put("economy", new VehicleFare(500, 180));
vehicleFares.put("comfort", new VehicleFare(800, 250));
vehicleFares.put("premium", new VehicleFare(1200, 380));
vehicleFares.put("xl", new VehicleFare(1000, 280));

String vehicleType = "${params.vehicleType}";
VehicleFare fare = vehicleFares.get(vehicleType);
int baseFare = fare.base;
// baseFare = ${baseFare.toFixed(0)} Kz

int perKm = fare.perKm;
int distance = ${params.distance};
int distanceCost = distance * perKm;
// distanceCost = ${distanceCost.toFixed(0)} Kz

int total = baseFare + distanceCost;
// total = ${total.toFixed(0)} Kz`,
    ruby: `# Define tarifas por categoria
VEHICLE_FARES = {
  economy: { base: 500, per_km: 180 },
  comfort: { base: 800, per_km: 250 },
  premium: { base: 1200, per_km: 380 },
  xl: { base: 1000, per_km: 280 }
}

vehicle_type = :${params.vehicleType}
fare = VEHICLE_FARES[vehicle_type]
base_fare = fare[:base]
# base_fare = ${baseFare.toFixed(0)} Kz

per_km = fare[:per_km]
distance = ${params.distance}
distance_cost = distance * per_km
# distance_cost = ${distanceCost.toFixed(0)} Kz

total = base_fare + distance_cost
# total = ${total.toFixed(0)} Kz`,
    csharp: `using System.Collections.Generic;

public class VehicleFare {
    public int Base { get; set; }
    public int PerKm { get; set; }
}

var vehicleFares = new Dictionary<string, VehicleFare> {
    {"economy", new VehicleFare{Base=500, PerKm=180}},
    {"comfort", new VehicleFare{Base=800, PerKm=250}},
    {"premium", new VehicleFare{Base=1200, PerKm=380}},
    {"xl", new VehicleFare{Base=1000, PerKm=280}}
};

string vehicleType = "${params.vehicleType}";
var fare = vehicleFares[vehicleType];
int baseFare = fare.Base;
// baseFare = ${baseFare.toFixed(0)} Kz

int perKm = fare.PerKm;
int distance = ${params.distance};
int distanceCost = distance * perKm;
// distanceCost = ${distanceCost.toFixed(0)} Kz

int total = baseFare + distanceCost;
// total = ${total.toFixed(0)} Kz`,
    php: `<?php
// Define tarifas por categoria
$vehicleFares = [
    'economy' => ['base' => 500, 'perKm' => 180],
    'comfort' => ['base' => 800, 'perKm' => 250],
    'premium' => ['base' => 1200, 'perKm' => 380],
    'xl' => ['base' => 1000, 'perKm' => 280]
];

$vehicleType = '${params.vehicleType}';
$fare = $vehicleFares[$vehicleType];
$baseFare = $fare['base'];
// baseFare = ${baseFare.toFixed(0)} Kz

$perKm = $fare['perKm'];
$distance = ${params.distance};
$distanceCost = $distance * $perKm;
// distanceCost = ${distanceCost.toFixed(0)} Kz

$total = $baseFare + $distanceCost;
// total = ${total.toFixed(0)} Kz`,
    rust: `use std::collections::HashMap;

struct VehicleFare {
    base: i32,
    per_km: i32,
}

let mut vehicle_fares: HashMap<&str, VehicleFare> = HashMap::new();
vehicle_fares.insert("economy", VehicleFare { base: 500, per_km: 180 });
vehicle_fares.insert("comfort", VehicleFare { base: 800, per_km: 250 });
vehicle_fares.insert("premium", VehicleFare { base: 1200, per_km: 380 });
vehicle_fares.insert("xl", VehicleFare { base: 1000, per_km: 280 });

let vehicle_type = "${params.vehicleType}";
let fare = vehicle_fares.get(vehicle_type).unwrap();
let base_fare = fare.base;
// base_fare = ${baseFare.toFixed(0)} Kz

let per_km = fare.per_km;
let distance = ${params.distance};
let distance_cost = distance * per_km;
// distance_cost = ${distanceCost.toFixed(0)} Kz

let mut total = base_fare + distance_cost;
// total = ${total.toFixed(0)} Kz`,
    kotlin: `data class VehicleFare(val base: Int, val perKm: Int)

val vehicleFares = mapOf(
    "economy" to VehicleFare(500, 180),
    "comfort" to VehicleFare(800, 250),
    "premium" to VehicleFare(1200, 380),
    "xl" to VehicleFare(1000, 280)
)

val vehicleType = "${params.vehicleType}"
val fare = vehicleFares[vehicleType]!!
val baseFare = fare.base
// baseFare = ${baseFare.toFixed(0)} Kz

val perKm = fare.perKm
val distance = ${params.distance}
val distanceCost = distance * perKm
// distanceCost = ${distanceCost.toFixed(0)} Kz

var total = baseFare + distanceCost
// total = ${total.toFixed(0)} Kz`
  };

  return step1Codes[language];
}

function generateRushHourCode(
  language: CodeLanguage,
  active: boolean,
  total: number,
  rushCharge: number
) {
  if (active) {
    const codes: Record<CodeLanguage, string> = {
      javascript: `if (isRushHour === true) {
  const RUSH_MULTIPLIER = 0.35;
  const rushCharge = total * RUSH_MULTIPLIER;
  // rushCharge = ${total.toFixed(0)} * 0.35 = ${rushCharge.toFixed(0)} Kz
  
  total = total + rushCharge;
  // total = ${(total + rushCharge).toFixed(0)} Kz
  console.log("Horario de pico aplicado!");
}`,
      python: `if is_rush_hour:
    RUSH_MULTIPLIER = 0.35
    rush_charge = total * RUSH_MULTIPLIER
    # rush_charge = ${rushCharge.toFixed(0)} Kz
    
    total = total + rush_charge
    # total = ${(total + rushCharge).toFixed(0)} Kz
    print("Horario de pico aplicado!")`,
      typescript: `if (isRushHour === true) {
  const RUSH_MULTIPLIER: number = 0.35;
  const rushCharge: number = total * RUSH_MULTIPLIER;
  // rushCharge = ${rushCharge.toFixed(0)} Kz
  
  total = total + rushCharge;
  // total = ${(total + rushCharge).toFixed(0)} Kz
  console.log("Horario de pico aplicado!");
}`,
      go: `if isRushHour {
    rushMultiplier := 0.35
    rushCharge := float64(total) * rushMultiplier
    // rushCharge = ${rushCharge.toFixed(0)} Kz
    
    total = total + int(rushCharge)
    // total = ${(total + rushCharge).toFixed(0)} Kz
    fmt.Println("Horario de pico aplicado!")
}`,
      java: `if (isRushHour) {
    double RUSH_MULTIPLIER = 0.35;
    int rushCharge = (int)(total * RUSH_MULTIPLIER);
    // rushCharge = ${rushCharge.toFixed(0)} Kz
    
    total = total + rushCharge;
    // total = ${(total + rushCharge).toFixed(0)} Kz
    System.out.println("Horario de pico aplicado!");
}`,
      ruby: `if is_rush_hour
  RUSH_MULTIPLIER = 0.35
  rush_charge = (total * RUSH_MULTIPLIER).to_i
  # rush_charge = ${rushCharge.toFixed(0)} Kz
  
  total = total + rush_charge
  # total = ${(total + rushCharge).toFixed(0)} Kz
  puts "Horario de pico aplicado!"
end`,
      csharp: `if (isRushHour) {
    double RUSH_MULTIPLIER = 0.35;
    int rushCharge = (int)(total * RUSH_MULTIPLIER);
    // rushCharge = ${rushCharge.toFixed(0)} Kz
    
    total = total + rushCharge;
    // total = ${(total + rushCharge).toFixed(0)} Kz
    Console.WriteLine("Horario de pico aplicado!");
}`,
      php: `if ($isRushHour) {
    $RUSH_MULTIPLIER = 0.35;
    $rushCharge = (int)($total * $RUSH_MULTIPLIER);
    // rushCharge = ${rushCharge.toFixed(0)} Kz
    
    $total = $total + $rushCharge;
    // total = ${(total + rushCharge).toFixed(0)} Kz
    echo "Horario de pico aplicado!";
}`,
      rust: `if is_rush_hour {
    let rush_multiplier = 0.35;
    let rush_charge = (total as f64 * rush_multiplier) as i32;
    // rush_charge = ${rushCharge.toFixed(0)} Kz
    
    total = total + rush_charge;
    // total = ${(total + rushCharge).toFixed(0)} Kz
    println!("Horario de pico aplicado!");
}`,
      kotlin: `if (isRushHour) {
    val rushMultiplier = 0.35
    val rushCharge = (total * rushMultiplier).toInt()
    // rushCharge = ${rushCharge.toFixed(0)} Kz
    
    total = total + rushCharge
    // total = ${(total + rushCharge).toFixed(0)} Kz
    println("Horario de pico aplicado!")
}`
    };
    return codes[language];
  } else {
    const codes: Record<CodeLanguage, string> = {
      javascript: `if (isRushHour === true) {
  // ...codigo do horario de pico
} else {
  console.log("Nao e horario de pico");
}`,
      python: `if is_rush_hour:
    # ...codigo do horario de pico
    pass
else:
    print("Nao e horario de pico")`,
      typescript: `if (isRushHour === true) {
  // ...codigo do horario de pico
} else {
  console.log("Nao e horario de pico");
}`,
      go: `if isRushHour {
    // ...codigo do horario de pico
} else {
    fmt.Println("Nao e horario de pico")
}`,
      java: `if (isRushHour) {
    // ...codigo do horario de pico
} else {
    System.out.println("Nao e horario de pico");
}`,
      ruby: `if is_rush_hour
  # ...codigo do horario de pico
else
  puts "Nao e horario de pico"
end`,
      csharp: `if (isRushHour) {
    // ...codigo do horario de pico
} else {
    Console.WriteLine("Nao e horario de pico");
}`,
      php: `if ($isRushHour) {
    // ...codigo do horario de pico
} else {
    echo "Nao e horario de pico";
}`,
      rust: `if is_rush_hour {
    // ...codigo do horario de pico
} else {
    println!("Nao e horario de pico");
}`,
      kotlin: `if (isRushHour) {
    // ...codigo do horario de pico
} else {
    println("Nao e horario de pico")
}`
    };
    return codes[language];
  }
}

function generateNightFareCode(
  language: CodeLanguage,
  active: boolean,
  hour: number,
  total: number,
  nightCharge: number
) {
  if (active) {
    const codes: Record<CodeLanguage, string> = {
      javascript: `const hour = ${hour};
if (hour >= 0 && hour < 6) {
  const NIGHT_MULTIPLIER = 0.20;
  const nightCharge = total * NIGHT_MULTIPLIER;
  // nightCharge = ${nightCharge.toFixed(0)} Kz
  
  total = total + nightCharge;
  // total = ${(total + nightCharge).toFixed(0)} Kz
  console.log("Tarifa noturna aplicada!");
}`,
      python: `hour = ${hour}
if 0 <= hour < 6:
    NIGHT_MULTIPLIER = 0.20
    night_charge = total * NIGHT_MULTIPLIER
    # night_charge = ${nightCharge.toFixed(0)} Kz
    
    total = total + night_charge
    # total = ${(total + nightCharge).toFixed(0)} Kz
    print("Tarifa noturna aplicada!")`,
      typescript: `const hour: number = ${hour};
if (hour >= 0 && hour < 6) {
  const NIGHT_MULTIPLIER: number = 0.20;
  const nightCharge: number = total * NIGHT_MULTIPLIER;
  // nightCharge = ${nightCharge.toFixed(0)} Kz
  
  total = total + nightCharge;
  // total = ${(total + nightCharge).toFixed(0)} Kz
  console.log("Tarifa noturna aplicada!");
}`,
      go: `hour := ${hour}
if hour >= 0 && hour < 6 {
    nightMultiplier := 0.20
    nightCharge := float64(total) * nightMultiplier
    // nightCharge = ${nightCharge.toFixed(0)} Kz
    
    total = total + int(nightCharge)
    // total = ${(total + nightCharge).toFixed(0)} Kz
    fmt.Println("Tarifa noturna aplicada!")
}`,
      java: `int hour = ${hour};
if (hour >= 0 && hour < 6) {
    double NIGHT_MULTIPLIER = 0.20;
    int nightCharge = (int)(total * NIGHT_MULTIPLIER);
    // nightCharge = ${nightCharge.toFixed(0)} Kz
    
    total = total + nightCharge;
    // total = ${(total + nightCharge).toFixed(0)} Kz
    System.out.println("Tarifa noturna aplicada!");
}`,
      ruby: `hour = ${hour}
if hour >= 0 && hour < 6
  NIGHT_MULTIPLIER = 0.20
  night_charge = (total * NIGHT_MULTIPLIER).to_i
  # night_charge = ${nightCharge.toFixed(0)} Kz
  
  total = total + night_charge
  # total = ${(total + nightCharge).toFixed(0)} Kz
  puts "Tarifa noturna aplicada!"
end`,
      csharp: `int hour = ${hour};
if (hour >= 0 && hour < 6) {
    double NIGHT_MULTIPLIER = 0.20;
    int nightCharge = (int)(total * NIGHT_MULTIPLIER);
    // nightCharge = ${nightCharge.toFixed(0)} Kz
    
    total = total + nightCharge;
    // total = ${(total + nightCharge).toFixed(0)} Kz
    Console.WriteLine("Tarifa noturna aplicada!");
}`,
      php: `$hour = ${hour};
if ($hour >= 0 && $hour < 6) {
    $NIGHT_MULTIPLIER = 0.20;
    $nightCharge = (int)($total * $NIGHT_MULTIPLIER);
    // nightCharge = ${nightCharge.toFixed(0)} Kz
    
    $total = $total + $nightCharge;
    // total = ${(total + nightCharge).toFixed(0)} Kz
    echo "Tarifa noturna aplicada!";
}`,
      rust: `let hour = ${hour};
if hour >= 0 && hour < 6 {
    let night_multiplier = 0.20;
    let night_charge = (total as f64 * night_multiplier) as i32;
    // night_charge = ${nightCharge.toFixed(0)} Kz
    
    total = total + night_charge;
    // total = ${(total + nightCharge).toFixed(0)} Kz
    println!("Tarifa noturna aplicada!");
}`,
      kotlin: `val hour = ${hour}
if (hour in 0..5) {
    val nightMultiplier = 0.20
    val nightCharge = (total * nightMultiplier).toInt()
    // nightCharge = ${nightCharge.toFixed(0)} Kz
    
    total = total + nightCharge
    // total = ${(total + nightCharge).toFixed(0)} Kz
    println("Tarifa noturna aplicada!")
}`
    };
    return codes[language];
  } else {
    const codes: Record<CodeLanguage, string> = {
      javascript: `const hour = ${hour};
if (hour >= 0 && hour < 6) {
  // ...codigo tarifa noturna
} else {
  console.log("Horario ${hour}h nao e noturno");
}`,
      python: `hour = ${hour}
if 0 <= hour < 6:
    # ...codigo tarifa noturna
    pass
else:
    print("Horario ${hour}h nao e noturno")`,
      typescript: `const hour: number = ${hour};
if (hour >= 0 && hour < 6) {
  // ...codigo tarifa noturna
} else {
  console.log("Horario ${hour}h nao e noturno");
}`,
      go: `hour := ${hour}
if hour >= 0 && hour < 6 {
    // ...codigo tarifa noturna
} else {
    fmt.Printf("Horario %dh nao e noturno", hour)
}`,
      java: `int hour = ${hour};
if (hour >= 0 && hour < 6) {
    // ...codigo tarifa noturna
} else {
    System.out.println("Horario " + hour + "h nao e noturno");
}`,
      ruby: `hour = ${hour}
if hour >= 0 && hour < 6
  # ...codigo tarifa noturna
else
  puts "Horario #{hour}h nao e noturno"
end`,
      csharp: `int hour = ${hour};
if (hour >= 0 && hour < 6) {
    // ...codigo tarifa noturna
} else {
    Console.WriteLine($"Horario {hour}h nao e noturno");
}`,
      php: `$hour = ${hour};
if ($hour >= 0 && $hour < 6) {
    // ...codigo tarifa noturna
} else {
    echo "Horario {$hour}h nao e noturno";
}`,
      rust: `let hour = ${hour};
if hour >= 0 && hour < 6 {
    // ...codigo tarifa noturna
} else {
    println!("Horario {}h nao e noturno", hour);
}`,
      kotlin: `val hour = ${hour}
if (hour in 0..5) {
    // ...codigo tarifa noturna
} else {
    println("Horario \${hour}h nao e noturno")
}`
    };
    return codes[language];
  }
}

function generateGenericConditionCode(
  language: CodeLanguage,
  conditionName: string,
  active: boolean,
  multiplier: number,
  total: number,
  charge: number,
  messageActive: string,
  messageInactive: string
) {
  if (active) {
    const codes: Record<CodeLanguage, string> = {
      javascript: `if (${conditionName} === true) {
  const MULTIPLIER = ${multiplier.toFixed(2)};
  const charge = total * MULTIPLIER;
  // charge = ${total.toFixed(0)} * ${multiplier.toFixed(2)} = ${charge.toFixed(0)} Kz
  
  total = total + charge;
  // total = ${(total + charge).toFixed(0)} Kz
  console.log("${messageActive}");
}`,
      python: `if ${conditionName.replace(/([A-Z])/g, '_$1').toLowerCase()}:
    MULTIPLIER = ${multiplier.toFixed(2)}
    charge = total * MULTIPLIER
    # charge = ${charge.toFixed(0)} Kz
    
    total = total + charge
    # total = ${(total + charge).toFixed(0)} Kz
    print("${messageActive}")`,
      typescript: `if (${conditionName} === true) {
  const MULTIPLIER: number = ${multiplier.toFixed(2)};
  const charge: number = total * MULTIPLIER;
  // charge = ${charge.toFixed(0)} Kz
  
  total = total + charge;
  // total = ${(total + charge).toFixed(0)} Kz
  console.log("${messageActive}");
}`,
      go: `if ${conditionName} {
    multiplier := ${multiplier.toFixed(2)}
    charge := float64(total) * multiplier
    // charge = ${charge.toFixed(0)} Kz
    
    total = total + int(charge)
    // total = ${(total + charge).toFixed(0)} Kz
    fmt.Println("${messageActive}")
}`,
      java: `if (${conditionName}) {
    double MULTIPLIER = ${multiplier.toFixed(2)};
    int charge = (int)(total * MULTIPLIER);
    // charge = ${charge.toFixed(0)} Kz
    
    total = total + charge;
    // total = ${(total + charge).toFixed(0)} Kz
    System.out.println("${messageActive}");
}`,
      ruby: `if ${conditionName.replace(/([A-Z])/g, '_$1').toLowerCase()}
  MULTIPLIER = ${multiplier.toFixed(2)}
  charge = (total * MULTIPLIER).to_i
  # charge = ${charge.toFixed(0)} Kz
  
  total = total + charge
  # total = ${(total + charge).toFixed(0)} Kz
  puts "${messageActive}"
end`,
      csharp: `if (${conditionName}) {
    double MULTIPLIER = ${multiplier.toFixed(2)};
    int charge = (int)(total * MULTIPLIER);
    // charge = ${charge.toFixed(0)} Kz
    
    total = total + charge;
    // total = ${(total + charge).toFixed(0)} Kz
    Console.WriteLine("${messageActive}");
}`,
      php: `if ($${conditionName}) {
    $MULTIPLIER = ${multiplier.toFixed(2)};
    $charge = (int)($total * $MULTIPLIER);
    // charge = ${charge.toFixed(0)} Kz
    
    $total = $total + $charge;
    // total = ${(total + charge).toFixed(0)} Kz
    echo "${messageActive}";
}`,
      rust: `if ${conditionName.replace(/([A-Z])/g, '_$1').toLowerCase()} {
    let multiplier = ${multiplier.toFixed(2)};
    let charge = (total as f64 * multiplier) as i32;
    // charge = ${charge.toFixed(0)} Kz
    
    total = total + charge;
    // total = ${(total + charge).toFixed(0)} Kz
    println!("${messageActive}");
}`,
      kotlin: `if (${conditionName}) {
    val multiplier = ${multiplier.toFixed(2)}
    val charge = (total * multiplier).toInt()
    // charge = ${charge.toFixed(0)} Kz
    
    total = total + charge
    // total = ${(total + charge).toFixed(0)} Kz
    println("${messageActive}")
}`
    };
    return codes[language];
  } else {
    const codes: Record<CodeLanguage, string> = {
      javascript: `if (${conditionName} === true) {
  // ...codigo
} else {
  console.log("${messageInactive}");
}`,
      python: `if ${conditionName.replace(/([A-Z])/g, '_$1').toLowerCase()}:
    # ...codigo
    pass
else:
    print("${messageInactive}")`,
      typescript: `if (${conditionName} === true) {
  // ...codigo
} else {
  console.log("${messageInactive}");
}`,
      go: `if ${conditionName} {
    // ...codigo
} else {
    fmt.Println("${messageInactive}")
}`,
      java: `if (${conditionName}) {
    // ...codigo
} else {
    System.out.println("${messageInactive}");
}`,
      ruby: `if ${conditionName.replace(/([A-Z])/g, '_$1').toLowerCase()}
  # ...codigo
else
  puts "${messageInactive}"
end`,
      csharp: `if (${conditionName}) {
    // ...codigo
} else {
    Console.WriteLine("${messageInactive}");
}`,
      php: `if ($${conditionName}) {
    // ...codigo
} else {
    echo "${messageInactive}";
}`,
      rust: `if ${conditionName.replace(/([A-Z])/g, '_$1').toLowerCase()} {
    // ...codigo
} else {
    println!("${messageInactive}");
}`,
      kotlin: `if (${conditionName}) {
    // ...codigo
} else {
    println("${messageInactive}")
}`
    };
    return codes[language];
  }
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
  let runningTotal = baseFare + distanceCost;

  interface DisplayStep extends Step {
    code: string;
  }

  const steps: DisplayStep[] = [];

  // Step 1: Base calculation
  steps.push({
    active: true,
    title: "1. Tarifa Base + Distancia",
    description: "Calcula o preco inicial baseado no tipo de veiculo e distancia",
    code: generateCode(language, params, fare, baseFare, distanceCost, runningTotal)
  });

  // Step 2: Rush hour
  const rushCharge = runningTotal * 0.35;
  steps.push({
    active: params.isRushHour,
    title: params.isRushHour ? "2. Adiciona Horario de Pico (+35%)" : "2. Horario de Pico (desativado)",
    description: params.isRushHour ? "Aplica multiplicador de horario de pico" : "Condicao nao aplicada",
    code: generateRushHourCode(language, params.isRushHour, runningTotal, rushCharge)
  });
  if (params.isRushHour) runningTotal += rushCharge;

  // Step 3: Night fare
  const nightCharge = runningTotal * 0.20;
  const isNight = params.hour >= 0 && params.hour < 6;
  steps.push({
    active: isNight,
    title: isNight ? "3. Adiciona Tarifa Noturna (+20%)" : "3. Tarifa Noturna (desativada)",
    description: isNight ? "Horario entre 00h-06h tem adicional noturno" : "Apenas entre 00h-06h",
    code: generateNightFareCode(language, isNight, params.hour, runningTotal, nightCharge)
  });
  if (isNight) runningTotal += nightCharge;

  // Step 4: Holiday
  const holidayCharge = runningTotal * 0.25;
  steps.push({
    active: params.isHoliday,
    title: params.isHoliday ? "4. Adiciona Feriado (+25%)" : "4. Feriado (desativado)",
    description: params.isHoliday ? "Tarifa extra para feriados" : "Condicao nao aplicada",
    code: generateGenericConditionCode(language, "isHoliday", params.isHoliday, 0.25, runningTotal, holidayCharge, "Tarifa de feriado aplicada!", "Nao e feriado")
  });
  if (params.isHoliday) runningTotal += holidayCharge;

  // Step 5: Rain
  const weatherMultiplier = params.hasRain && params.weatherSeverity > 0 ? (params.weatherSeverity / 100) * 0.4 : 0;
  const weatherCharge = runningTotal * weatherMultiplier;
  const hasWeather = params.hasRain && params.weatherSeverity > 0;
  steps.push({
    active: hasWeather,
    title: hasWeather ? `5. Adiciona Chuva (+${(weatherMultiplier * 100).toFixed(0)}%)` : "5. Chuva (desativada)",
    description: hasWeather ? `Intensidade ${params.weatherSeverity}% aumenta o preco` : "Condicao nao aplicada",
    code: generateGenericConditionCode(language, "hasRain", hasWeather, weatherMultiplier, runningTotal, weatherCharge, "Acrescimo por chuva aplicado!", "Sem chuva")
  });
  if (hasWeather) runningTotal += weatherCharge;

  // Step 6: Traffic
  const trafficMultiplier = params.trafficIntensity > 30 ? ((params.trafficIntensity - 30) / 100) * 0.5 : 0;
  const trafficCharge = runningTotal * trafficMultiplier;
  const hasTraffic = params.trafficIntensity > 30;
  steps.push({
    active: hasTraffic,
    title: hasTraffic ? `6. Adiciona Transito (+${(trafficMultiplier * 100).toFixed(0)}%)` : "6. Transito (sem impacto)",
    description: hasTraffic ? "Transito acima de 30% aumenta o tempo" : "Apenas acima de 30%",
    code: generateGenericConditionCode(language, "hasTraffic", hasTraffic, trafficMultiplier, runningTotal, trafficCharge, "Acrescimo por transito aplicado!", "Transito normal")
  });
  if (hasTraffic) runningTotal += trafficCharge;

  // Step 7: Special Event
  const eventCharge = runningTotal * 0.30;
  steps.push({
    active: params.hasSpecialEvent,
    title: params.hasSpecialEvent ? "7. Adiciona Evento Especial (+30%)" : "7. Evento Especial (desativado)",
    description: params.hasSpecialEvent ? "Shows, jogos ou festivais" : "Condicao nao aplicada",
    code: generateGenericConditionCode(language, "hasSpecialEvent", params.hasSpecialEvent, 0.30, runningTotal, eventCharge, "Evento especial aplicado!", "Sem eventos especiais")
  });
  if (params.hasSpecialEvent) runningTotal += eventCharge;

  // Step 8: Surge pricing
  const surgeMultipliers: Record<string, number> = { none: 1.0, low: 1.2, medium: 1.5, high: 2.0 };
  const surgeMultiplier = surgeMultipliers[params.surgeZone];
  const surgeCharge = runningTotal * (surgeMultiplier - 1);
  const hasSurge = params.surgeZone !== "none";
  steps.push({
    active: hasSurge,
    title: hasSurge ? `8. Aplica Tarifa Dinamica (${surgeMultiplier}x)` : "8. Tarifa Dinamica (zona normal)",
    description: hasSurge ? "Multiplicador de zona de alta demanda" : "Sem multiplicador adicional",
    code: generateGenericConditionCode(language, "hasSurge", hasSurge, surgeMultiplier - 1, runningTotal, surgeCharge, "Tarifa dinamica aplicada!", "Zona normal")
  });
  if (hasSurge) runningTotal += surgeCharge;

  const languageLabels: Record<CodeLanguage, string> = {
    javascript: "JavaScript",
    python: "Python",
    typescript: "TypeScript",
    go: "Go",
    java: "Java",
    ruby: "Ruby",
    csharp: "C#",
    php: "PHP",
    rust: "Rust",
    kotlin: "Kotlin"
  };

  return (
    <Card className="bg-slate-900 border-slate-700 flex flex-col h-[calc(100vh-6rem)]">
      <CardHeader className="pb-3 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2 text-slate-100">
            <Code2 className="h-4 w-4 text-yellow-400" />
            Algoritmo
          </CardTitle>
          <Select value={language} onValueChange={(value: CodeLanguage) => setLanguage(value)}>
            <SelectTrigger className="w-[120px] h-8 bg-slate-800 border-slate-600 text-slate-200 text-xs" data-testid="select-language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              {Object.entries(languageLabels).map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-slate-200 text-xs">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Veja o calculo passo a passo
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
                  <code className="text-green-400">{step.code}</code>
                </pre>
              </div>
            ))}

            <div className="mt-6 p-4 rounded-lg bg-yellow-500/20 border-2 border-yellow-500">
              <div className="text-center">
                <p className="text-xs text-slate-300 mb-1">Preco Final Calculado</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {runningTotal.toFixed(0)} Kz
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
