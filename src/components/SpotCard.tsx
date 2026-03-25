import { motion } from "framer-motion";
import { ScoredSpot } from "@/data/parkingSpots";
import { Shield, Sun, Footprints, AlertTriangle, DollarSign, MapPin, ChevronRight } from "lucide-react";

interface SpotCardProps {
  spot: ScoredSpot;
  rank: number;
  isSelected: boolean;
  onClick: () => void;
  compact?: boolean;
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="score-bar">
      <div className="score-bar-fill" style={{ width: `${value * 100}%`, background: color }} />
    </div>
  );
}

export default function SpotCard({ spot, rank, isSelected, onClick, compact }: SpotCardProps) {
  const riskColor =
    spot.riskLevel === "low" ? "text-neon-green" :
    spot.riskLevel === "medium" ? "text-neon-amber" : "text-neon-red";

  const riskBg =
    spot.riskLevel === "low" ? "bg-neon-green/10 border-neon-green/20" :
    spot.riskLevel === "medium" ? "bg-neon-amber/10 border-neon-amber/20" :
    "bg-neon-red/10 border-neon-red/20";

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: rank * 0.05 }}
        onClick={onClick}
        className={`glass-card-hover rounded-lg p-3 cursor-pointer ${
          isSelected ? "border-primary/60 shadow-[0_0_20px_hsl(172_80%_50%/0.15)]" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
            {rank}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-semibold text-foreground truncate">{spot.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono text-muted-foreground">
                {spot.walkTimeMinutes}m
              </span>
              <span className={`text-[9px] font-mono px-1 py-0.5 rounded border ${riskBg} ${riskColor}`}>
                {spot.riskLevel}
              </span>
            </div>
          </div>
          <div className="text-right flex items-center gap-1">
            <span className="text-sm font-mono font-bold text-primary">{spot.finalScore.toFixed(2)}</span>
            <ChevronRight className={`w-3 h-3 transition-colors ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.06 }}
      onClick={onClick}
      className={`glass-card-hover rounded-xl p-3.5 cursor-pointer ${
        isSelected ? "border-primary/60 shadow-[0_0_20px_hsl(172_80%_50%/0.15)]" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-mono font-bold">
            {rank}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground leading-tight">{spot.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono text-muted-foreground">
                {spot.walkTimeMinutes} min walk
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${riskBg} ${riskColor}`}>
                {spot.riskLevel}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-mono font-bold text-primary">
            {spot.finalScore.toFixed(2)}
          </div>
          <div className="text-[9px] font-mono text-muted-foreground uppercase">score</div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <Shield className="w-3 h-3 text-neon-green shrink-0" />
          <span className="text-muted-foreground w-12">Legal</span>
          <div className="flex-1"><ScoreBar value={spot.legalityScore} color="hsl(145,70%,50%)" /></div>
          <span className="text-foreground w-7 text-right">{(spot.legalityScore * 100).toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <AlertTriangle className="w-3 h-3 text-neon-amber shrink-0" />
          <span className="text-muted-foreground w-12">Safety</span>
          <div className="flex-1"><ScoreBar value={spot.safetyScore} color="hsl(38,92%,55%)" /></div>
          <span className="text-foreground w-7 text-right">{(spot.safetyScore * 100).toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <Sun className="w-3 h-3 text-neon-cyan shrink-0" />
          <span className="text-muted-foreground w-12">Shade</span>
          <div className="flex-1"><ScoreBar value={spot.shadeScore} color="hsl(172,80%,50%)" /></div>
          <span className="text-foreground w-7 text-right">{(spot.shadeScore * 100).toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <Footprints className="w-3 h-3 text-neon-purple shrink-0" />
          <span className="text-muted-foreground w-12">Access</span>
          <div className="flex-1"><ScoreBar value={spot.accessibilityScore} color="hsl(265,70%,60%)" /></div>
          <span className="text-foreground w-7 text-right">{(spot.accessibilityScore * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/50">
        <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
          <DollarSign className="w-3 h-3" />
          {spot.type === "free" ? (
            <span className="text-neon-green font-semibold">FREE</span>
          ) : (
            <span>₹{spot.costPerHour}/hr</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {spot.walkDistanceMeters}m
        </div>
        <div className="text-[10px] font-mono text-muted-foreground">
          {spot.occupied}/{spot.capacity} filled
        </div>
      </div>
    </motion.div>
  );
}
