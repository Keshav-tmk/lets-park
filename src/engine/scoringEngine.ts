import { ParkingSpot, ScoredSpot, UserPreferences } from "@/data/parkingSpots";

const WEIGHTS = {
  legality: 0.3,
  safety: 0.2,
  shade: 0.2,
  accessibility: 0.2,
  cost: 0.1,
};

/** Haversine distance in meters */
function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Compute cost score: free=1, paid scales inversely with cost×duration */
function computeCostScore(spot: ParkingSpot, duration: number): number {
  if (spot.type === "free") return 1;
  const totalCost = spot.costPerHour * duration;
  // Normalize: ₹0 = 1, ₹100+ = ~0
  return Math.max(0, 1 - totalCost / 100);
}

/** Adjust shade score based on current hour (stronger midday) */
function adjustShadeForTime(baseShade: number): number {
  const hour = new Date().getHours();
  // Peak sun 10am-4pm: shade matters most
  if (hour >= 10 && hour <= 16) return baseShade;
  // Morning/evening: shade less critical
  if (hour >= 7 && hour < 10) return 0.3 + baseShade * 0.7;
  if (hour > 16 && hour <= 19) return 0.3 + baseShade * 0.7;
  // Night: shade irrelevant
  return 1;
}

/** Adjust safety based on reports */
function adjustSafetyForReports(spot: ParkingSpot): number {
  let score = spot.safetyScore;
  const recentReports = spot.reports.filter((r) => {
    const d = new Date(r.timestamp);
    const now = new Date();
    return now.getTime() - d.getTime() < 90 * 24 * 60 * 60 * 1000; // 90 days
  });
  for (const r of recentReports) {
    if (r.type === "theft") score -= 0.15;
    if (r.type === "fine") score -= 0.1;
    if (r.type === "safe") score += 0.05;
  }
  return Math.max(0, Math.min(1, score));
}

/** Determine fine risk level */
function computeRiskLevel(spot: ParkingSpot): "low" | "medium" | "high" {
  if (spot.legalityScore < 0.5) return "high";
  if (spot.nearMainRoad && spot.legalityScore < 0.8) return "medium";
  if (spot.reports.some((r) => r.type === "fine")) return "medium";
  return "low";
}

/** Main ranking engine */
export function rankParkingSpots(
  spots: ParkingSpot[],
  destLat: number,
  destLng: number,
  prefs: UserPreferences
): ScoredSpot[] {
  // Apply shade weight multiplier based on priority
  const shadeMultiplier =
    prefs.shadePriority === "high" ? 1.5 : prefs.shadePriority === "medium" ? 1.0 : 0.5;

  const scored: ScoredSpot[] = spots
    .filter((spot) => {
      // Filter illegal spots (legalityScore = 0)
      if (spot.legalityScore === 0) return false;
      // Filter by free preference
      if (prefs.freeOnly && spot.type === "paid") return false;
      return true;
    })
    .map((spot) => {
      const distMeters = haversineDistance(spot.lat, spot.lng, destLat, destLng);
      const walkTimeMin = Math.round(distMeters / 80); // ~80m/min walking

      // Accessibility score: normalized inverse of distance
      const maxDist = Math.max(prefs.maxWalkingDistance, 100);
      const accessScore = Math.max(0, 1 - distMeters / maxDist);

      const costScore = computeCostScore(spot, prefs.parkingDuration);
      const shadeScore = adjustShadeForTime(spot.shadeScore);
      const safetyScore = adjustSafetyForReports(spot);

      // Adjusted weights
      const totalWeight =
        WEIGHTS.legality + WEIGHTS.safety + WEIGHTS.shade * shadeMultiplier + WEIGHTS.accessibility + WEIGHTS.cost;

      const finalScore =
        (WEIGHTS.legality * spot.legalityScore +
          WEIGHTS.safety * safetyScore +
          WEIGHTS.shade * shadeMultiplier * shadeScore +
          WEIGHTS.accessibility * accessScore +
          WEIGHTS.cost * costScore) /
        totalWeight;

      return {
        ...spot,
        finalScore: Math.round(finalScore * 100) / 100,
        walkTimeMinutes: walkTimeMin,
        walkDistanceMeters: Math.round(distMeters),
        riskLevel: computeRiskLevel(spot),
        safetyScore,
        shadeScore,
        accessibilityScore: accessScore,
      };
    })
    // Filter by max walking distance
    .filter((s) => s.walkDistanceMeters <= prefs.maxWalkingDistance);

  // Sort descending by finalScore
  scored.sort((a, b) => b.finalScore - a.finalScore);

  return scored.slice(0, 5);
}
