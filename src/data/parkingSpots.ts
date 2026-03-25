export interface ParkingSpot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: "free" | "paid";
  costPerHour: number;
  legalityScore: number;
  safetyScore: number;
  shadeScore: number;
  accessibilityScore: number;
  capacity: number;
  occupied: number;
  lighting: "good" | "moderate" | "poor";
  nearMainRoad: boolean;
  reports: Report[];
}

export interface Report {
  type: "safe" | "fine" | "theft";
  timestamp: string;
}

export interface ScoredSpot extends ParkingSpot {
  finalScore: number;
  walkTimeMinutes: number;
  riskLevel: "low" | "medium" | "high";
  walkDistanceMeters: number;
}

export interface UserPreferences {
  freeOnly: boolean;
  maxWalkingDistance: number; // meters
  shadePriority: "low" | "medium" | "high";
  parkingDuration: number; // hours
}

// 25 mock parking spots around Bangalore (MG Road area)
export const mockParkingSpots: ParkingSpot[] = [
  { id: "ps-01", name: "Brigade Road Basement", lat: 12.9738, lng: 77.6070, type: "paid", costPerHour: 20, legalityScore: 1.0, safetyScore: 0.9, shadeScore: 1.0, accessibilityScore: 0.85, capacity: 50, occupied: 35, lighting: "good", nearMainRoad: false, reports: [] },
  { id: "ps-02", name: "MG Road Metro Side", lat: 12.9756, lng: 77.6064, type: "free", costPerHour: 0, legalityScore: 0.9, safetyScore: 0.8, shadeScore: 0.6, accessibilityScore: 0.9, capacity: 20, occupied: 14, lighting: "good", nearMainRoad: true, reports: [] },
  { id: "ps-03", name: "Church Street Alley", lat: 12.9745, lng: 77.6042, type: "free", costPerHour: 0, legalityScore: 0.7, safetyScore: 0.6, shadeScore: 0.8, accessibilityScore: 0.7, capacity: 15, occupied: 12, lighting: "moderate", nearMainRoad: false, reports: [{ type: "fine", timestamp: "2024-01-15" }] },
  { id: "ps-04", name: "Residency Road Parking", lat: 12.9720, lng: 77.6090, type: "paid", costPerHour: 15, legalityScore: 1.0, safetyScore: 0.85, shadeScore: 0.5, accessibilityScore: 0.6, capacity: 30, occupied: 20, lighting: "good", nearMainRoad: true, reports: [] },
  { id: "ps-05", name: "Lavelle Road Shade", lat: 12.9710, lng: 77.6020, type: "free", costPerHour: 0, legalityScore: 0.85, safetyScore: 0.75, shadeScore: 0.95, accessibilityScore: 0.5, capacity: 10, occupied: 6, lighting: "moderate", nearMainRoad: false, reports: [] },
  { id: "ps-06", name: "UB City Two-Wheeler", lat: 12.9715, lng: 77.5965, type: "paid", costPerHour: 30, legalityScore: 1.0, safetyScore: 0.95, shadeScore: 1.0, accessibilityScore: 0.4, capacity: 100, occupied: 60, lighting: "good", nearMainRoad: false, reports: [] },
  { id: "ps-07", name: "Cubbon Park Gate", lat: 12.9770, lng: 77.5960, type: "free", costPerHour: 0, legalityScore: 0.4, safetyScore: 0.5, shadeScore: 0.9, accessibilityScore: 0.65, capacity: 8, occupied: 5, lighting: "poor", nearMainRoad: false, reports: [{ type: "fine", timestamp: "2024-02-10" }, { type: "theft", timestamp: "2024-01-20" }] },
  { id: "ps-08", name: "Kamaraj Road Spot", lat: 12.9790, lng: 77.6010, type: "free", costPerHour: 0, legalityScore: 0.6, safetyScore: 0.55, shadeScore: 0.3, accessibilityScore: 0.75, capacity: 12, occupied: 8, lighting: "moderate", nearMainRoad: true, reports: [] },
  { id: "ps-09", name: "Museum Road Secure", lat: 12.9735, lng: 77.5990, type: "paid", costPerHour: 10, legalityScore: 1.0, safetyScore: 0.88, shadeScore: 0.7, accessibilityScore: 0.72, capacity: 25, occupied: 15, lighting: "good", nearMainRoad: false, reports: [{ type: "safe", timestamp: "2024-03-01" }] },
  { id: "ps-10", name: "Vittal Mallya Road", lat: 12.9698, lng: 77.5985, type: "free", costPerHour: 0, legalityScore: 0.75, safetyScore: 0.7, shadeScore: 0.4, accessibilityScore: 0.55, capacity: 18, occupied: 10, lighting: "moderate", nearMainRoad: true, reports: [] },
  { id: "ps-11", name: "Cunningham Road Bay", lat: 12.9820, lng: 77.5940, type: "paid", costPerHour: 12, legalityScore: 1.0, safetyScore: 0.82, shadeScore: 0.6, accessibilityScore: 0.45, capacity: 40, occupied: 28, lighting: "good", nearMainRoad: true, reports: [] },
  { id: "ps-12", name: "Infantry Road Corner", lat: 12.9800, lng: 77.6000, type: "free", costPerHour: 0, legalityScore: 0.3, safetyScore: 0.4, shadeScore: 0.2, accessibilityScore: 0.8, capacity: 6, occupied: 5, lighting: "poor", nearMainRoad: true, reports: [{ type: "fine", timestamp: "2024-03-05" }, { type: "fine", timestamp: "2024-02-28" }] },
  { id: "ps-13", name: "St. Marks Road Tree", lat: 12.9725, lng: 77.6035, type: "free", costPerHour: 0, legalityScore: 0.8, safetyScore: 0.72, shadeScore: 0.85, accessibilityScore: 0.68, capacity: 10, occupied: 7, lighting: "moderate", nearMainRoad: false, reports: [{ type: "safe", timestamp: "2024-03-10" }] },
  { id: "ps-14", name: "Commissariat Road", lat: 12.9705, lng: 77.6055, type: "paid", costPerHour: 8, legalityScore: 0.95, safetyScore: 0.78, shadeScore: 0.55, accessibilityScore: 0.82, capacity: 22, occupied: 14, lighting: "good", nearMainRoad: false, reports: [] },
  { id: "ps-15", name: "Kasturba Road Open", lat: 12.9755, lng: 77.5930, type: "free", costPerHour: 0, legalityScore: 0.5, safetyScore: 0.6, shadeScore: 0.15, accessibilityScore: 0.5, capacity: 15, occupied: 9, lighting: "moderate", nearMainRoad: true, reports: [] },
  { id: "ps-16", name: "Rest House Crescent", lat: 12.9742, lng: 77.6085, type: "free", costPerHour: 0, legalityScore: 0.88, safetyScore: 0.76, shadeScore: 0.7, accessibilityScore: 0.78, capacity: 12, occupied: 8, lighting: "good", nearMainRoad: false, reports: [] },
  { id: "ps-17", name: "Dickenson Road Multi", lat: 12.9692, lng: 77.6105, type: "paid", costPerHour: 25, legalityScore: 1.0, safetyScore: 0.92, shadeScore: 1.0, accessibilityScore: 0.35, capacity: 60, occupied: 40, lighting: "good", nearMainRoad: false, reports: [] },
  { id: "ps-18", name: "Primrose Road Spot", lat: 12.9717, lng: 77.6045, type: "free", costPerHour: 0, legalityScore: 0.72, safetyScore: 0.65, shadeScore: 0.75, accessibilityScore: 0.62, capacity: 8, occupied: 4, lighting: "moderate", nearMainRoad: false, reports: [] },
  { id: "ps-19", name: "Ali Asker Road Open", lat: 12.9810, lng: 77.5970, type: "free", costPerHour: 0, legalityScore: 0.55, safetyScore: 0.5, shadeScore: 0.35, accessibilityScore: 0.42, capacity: 10, occupied: 7, lighting: "poor", nearMainRoad: false, reports: [{ type: "theft", timestamp: "2024-02-15" }] },
  { id: "ps-20", name: "Richmond Road Circle", lat: 12.9680, lng: 77.6070, type: "paid", costPerHour: 18, legalityScore: 1.0, safetyScore: 0.84, shadeScore: 0.45, accessibilityScore: 0.58, capacity: 35, occupied: 22, lighting: "good", nearMainRoad: true, reports: [] },
  { id: "ps-21", name: "Hosur Road Flyover", lat: 12.9665, lng: 77.6095, type: "free", costPerHour: 0, legalityScore: 0.2, safetyScore: 0.35, shadeScore: 0.9, accessibilityScore: 0.3, capacity: 5, occupied: 3, lighting: "poor", nearMainRoad: true, reports: [{ type: "fine", timestamp: "2024-03-12" }, { type: "theft", timestamp: "2024-03-08" }] },
  { id: "ps-22", name: "Double Road Lane", lat: 12.9675, lng: 77.6010, type: "free", costPerHour: 0, legalityScore: 0.82, safetyScore: 0.7, shadeScore: 0.6, accessibilityScore: 0.48, capacity: 14, occupied: 9, lighting: "moderate", nearMainRoad: false, reports: [] },
  { id: "ps-23", name: "Queens Road Secure", lat: 12.9795, lng: 77.5950, type: "paid", costPerHour: 15, legalityScore: 1.0, safetyScore: 0.9, shadeScore: 0.8, accessibilityScore: 0.4, capacity: 45, occupied: 30, lighting: "good", nearMainRoad: true, reports: [{ type: "safe", timestamp: "2024-03-14" }] },
  { id: "ps-24", name: "Shivaji Nagar Gate", lat: 12.9830, lng: 77.6030, type: "free", costPerHour: 0, legalityScore: 0.65, safetyScore: 0.58, shadeScore: 0.5, accessibilityScore: 0.38, capacity: 20, occupied: 15, lighting: "moderate", nearMainRoad: true, reports: [] },
  { id: "ps-25", name: "Mahatma Gandhi Rd E", lat: 12.9762, lng: 77.6100, type: "free", costPerHour: 0, legalityScore: 0.78, safetyScore: 0.68, shadeScore: 0.55, accessibilityScore: 0.88, capacity: 16, occupied: 11, lighting: "moderate", nearMainRoad: true, reports: [] },
];
