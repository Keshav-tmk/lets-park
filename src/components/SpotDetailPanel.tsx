import { motion } from "framer-motion";
import {
  X, ExternalLink, MapPin, Clock, DollarSign, Users, Shield,
  AlertTriangle, TreePine, Footprints, Eye, Navigation
} from "lucide-react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell,
  PieChart, Pie, Tooltip
} from "recharts";
import { ScoredSpot } from "@/data/parkingSpots";

interface SpotDetailPanelProps {
  spot: ScoredSpot;
  allSpots: ScoredSpot[];
  onClose: () => void;
}

const SCORE_COLORS: Record<string, string> = {
  Legal: "#22c55e",
  Safety: "#f59e0b",
  Shade: "#2dd4bf",
  Access: "#a855f7",
  Cost: "#3b82f6",
};

export default function SpotDetailPanel({ spot, allSpots, onClose }: SpotDetailPanelProps) {
  // Radar chart data
  const radarData = [
    { metric: "Legal", value: Math.round(spot.legalityScore * 100), fullMark: 100 },
    { metric: "Safety", value: Math.round(spot.safetyScore * 100), fullMark: 100 },
    { metric: "Shade", value: Math.round(spot.shadeScore * 100), fullMark: 100 },
    { metric: "Access", value: Math.round(spot.accessibilityScore * 100), fullMark: 100 },
  ];

  // Bar chart: compare this spot vs top 5
  const comparisonData = allSpots.slice(0, 5).map((s, i) => ({
    name: s.name.length > 12 ? s.name.slice(0, 12) + "…" : s.name,
    score: Math.round(s.finalScore * 100),
    isCurrent: s.id === spot.id,
  }));

  // Occupancy pie
  const occupancyPercent = Math.round((spot.occupied / spot.capacity) * 100);
  const occupancyData = [
    { name: "Occupied", value: spot.occupied },
    { name: "Available", value: spot.capacity - spot.occupied },
  ];

  // Risk assessment data
  const riskMetrics = [
    {
      label: "Fine Risk",
      value: spot.legalityScore < 0.5 ? "HIGH" : spot.legalityScore < 0.8 ? "MEDIUM" : "LOW",
      color: spot.legalityScore < 0.5 ? "#ef4444" : spot.legalityScore < 0.8 ? "#f59e0b" : "#22c55e",
      detail: spot.legalityScore < 0.5 ? "Likely illegal spot" : spot.legalityScore < 0.8 ? "Some risk of fines" : "Legally safe",
    },
    {
      label: "Theft Risk",
      value: spot.safetyScore < 0.5 ? "HIGH" : spot.safetyScore < 0.7 ? "MEDIUM" : "LOW",
      color: spot.safetyScore < 0.5 ? "#ef4444" : spot.safetyScore < 0.7 ? "#f59e0b" : "#22c55e",
      detail: spot.lighting === "poor" ? "Poor lighting area" : spot.lighting === "good" ? "Well-lit area" : "Moderate lighting",
    },
    {
      label: "Shade Cover",
      value: spot.shadeScore > 0.7 ? "EXCELLENT" : spot.shadeScore > 0.4 ? "MODERATE" : "POOR",
      color: spot.shadeScore > 0.7 ? "#22c55e" : spot.shadeScore > 0.4 ? "#f59e0b" : "#ef4444",
      detail: spot.shadeScore > 0.7 ? "Good tree cover" : spot.shadeScore > 0.4 ? "Partial shade" : "Direct sunlight",
    },
  ];

  const googleMapsUrl = `https://www.google.com/maps/@${spot.lat},${spot.lng},18z`;
  const streetViewUrl = `https://www.google.com/maps?layer=c&cbll=${spot.lat},${spot.lng}`;
  const embedUrl = `https://maps.google.com/maps?q=${spot.lat},${spot.lng}&t=k&z=19&ie=UTF8&iwloc=&output=embed`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="w-[380px] shrink-0 glass-card rounded-xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-base font-bold text-foreground leading-tight">{spot.name}</h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                spot.riskLevel === "low" ? "bg-neon-green/10 border-neon-green/20 text-neon-green" :
                spot.riskLevel === "medium" ? "bg-neon-amber/10 border-neon-amber/20 text-neon-amber" :
                "bg-neon-red/10 border-neon-red/20 text-neon-red"
              }`}>{spot.riskLevel.toUpperCase()} RISK</span>
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                <Footprints className="w-3 h-3" /> {spot.walkTimeMinutes} min
              </span>
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {spot.walkDistanceMeters}m
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-2xl font-mono font-black text-primary">{spot.finalScore.toFixed(2)}</div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Google Maps Satellite Embed */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <Eye className="w-3 h-3" /> Satellite View
          </h3>
          <div className="rounded-lg overflow-hidden border border-border/50 h-[180px]">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "saturate(1.1) contrast(1.05)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Satellite view of ${spot.name}`}
            />
          </div>
          <div className="flex gap-2">
            <a
              href={streetViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-mono font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
            >
              <Navigation className="w-3 h-3" /> Street View 360°
            </a>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-mono font-bold uppercase bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all"
            >
              <ExternalLink className="w-3 h-3" /> Google Maps
            </a>
          </div>
        </div>

        {/* Score Radar Chart */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <Shield className="w-3 h-3" /> Score Analysis
          </h3>
          <div className="glass-card rounded-lg p-3 border border-border/30">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid
                  stroke="hsl(220, 16%, 20%)"
                  strokeDasharray="3 3"
                />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#2dd4bf"
                  fill="#2dd4bf"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" /> Risk Assessment
          </h3>
          <div className="space-y-2">
            {riskMetrics.map((metric) => (
              <div key={metric.label} className="glass-card rounded-lg p-3 border border-border/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-semibold text-foreground">{metric.label}</div>
                  <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{metric.detail}</div>
                </div>
                <span
                  className="text-[10px] font-mono font-black px-2.5 py-1 rounded-full"
                  style={{
                    color: metric.color,
                    backgroundColor: `${metric.color}15`,
                    border: `1px solid ${metric.color}30`,
                  }}
                >
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Occupancy */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <Users className="w-3 h-3" /> Occupancy
          </h3>
          <div className="glass-card rounded-lg p-3 border border-border/30">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={occupancyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={38}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      <Cell fill="#ef4444" />
                      <Cell fill="#22c55e" />
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(220, 18%, 10%)",
                        border: "1px solid hsl(220, 16%, 18%)",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontFamily: "JetBrains Mono",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-mono font-black text-foreground">
                  {spot.capacity - spot.occupied}
                  <span className="text-sm text-muted-foreground font-normal"> / {spot.capacity}</span>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase">Spots Available</div>
                <div className="mt-2 w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${occupancyPercent}%`,
                      background: occupancyPercent > 80 ? "#ef4444" : occupancyPercent > 50 ? "#f59e0b" : "#22c55e",
                    }}
                  />
                </div>
                <div className="text-[10px] font-mono text-muted-foreground mt-1">{occupancyPercent}% Full</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost info */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <DollarSign className="w-3 h-3" /> Pricing
          </h3>
          <div className="glass-card rounded-lg p-3 border border-border/30">
            {spot.type === "free" ? (
              <div className="text-lg font-mono font-black text-neon-green">FREE PARKING 🎉</div>
            ) : (
              <div className="flex items-baseline gap-3">
                <div className="text-lg font-mono font-black text-foreground">₹{spot.costPerHour}<span className="text-xs text-muted-foreground">/hr</span></div>
                <div className="text-xs font-mono text-muted-foreground">
                  Est. total: <span className="text-foreground font-bold">₹{spot.costPerHour * 2}</span> (2hrs)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            📊 Spot Comparison
          </h3>
          <div className="glass-card rounded-lg p-3 border border-border/30">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={comparisonData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid stroke="hsl(220, 16%, 18%)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 9, fontFamily: "JetBrains Mono" }}
                  axisLine={{ stroke: "hsl(220, 16%, 18%)" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 9, fontFamily: "JetBrains Mono" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(220, 18%, 10%)",
                    border: "1px solid hsl(220, 16%, 18%)",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontFamily: "JetBrains Mono",
                  }}
                  formatter={(value: number) => [`${value}%`, "Score"]}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.isCurrent ? "#2dd4bf" : "hsl(220, 16%, 24%)"}
                      opacity={entry.isCurrent ? 1 : 0.6}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <TreePine className="w-3 h-3" /> AI Insights
          </h3>
          <div className="glass-card rounded-lg p-3 border border-border/30 space-y-2">
            {spot.nearMainRoad && (
              <div className="flex items-start gap-2 text-xs font-mono">
                <span className="text-neon-amber">⚠️</span>
                <span className="text-muted-foreground">Near main road — higher visibility but more fine patrols</span>
              </div>
            )}
            {spot.lighting === "poor" && (
              <div className="flex items-start gap-2 text-xs font-mono">
                <span className="text-neon-red">🔦</span>
                <span className="text-muted-foreground">Poor lighting — avoid parking after dark</span>
              </div>
            )}
            {spot.lighting === "good" && (
              <div className="flex items-start gap-2 text-xs font-mono">
                <span className="text-neon-green">💡</span>
                <span className="text-muted-foreground">Well-lit area — safe for evening parking</span>
              </div>
            )}
            {spot.shadeScore > 0.7 && (
              <div className="flex items-start gap-2 text-xs font-mono">
                <span className="text-neon-green">🌳</span>
                <span className="text-muted-foreground">Good tree cover — your vehicle stays cool</span>
              </div>
            )}
            {spot.shadeScore < 0.3 && (
              <div className="flex items-start gap-2 text-xs font-mono">
                <span className="text-neon-amber">☀️</span>
                <span className="text-muted-foreground">Direct sunlight — consider using a vehicle cover</span>
              </div>
            )}
            {occupancyPercent > 80 && (
              <div className="flex items-start gap-2 text-xs font-mono">
                <span className="text-neon-red">🅿️</span>
                <span className="text-muted-foreground">High occupancy — arrive early to secure a spot</span>
              </div>
            )}
            {spot.reports.length > 0 && (
              <div className="flex items-start gap-2 text-xs font-mono">
                <span className="text-neon-amber">📋</span>
                <span className="text-muted-foreground">
                  {spot.reports.length} community report{spot.reports.length > 1 ? "s" : ""} filed
                </span>
              </div>
            )}
            {spot.type === "free" && spot.legalityScore > 0.8 && (
              <div className="flex items-start gap-2 text-xs font-mono">
                <span className="text-neon-green">✨</span>
                <span className="text-muted-foreground">Great deal — free and legally safe!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
