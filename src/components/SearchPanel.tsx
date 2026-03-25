import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Clock, Footprints, Sun, Zap } from "lucide-react";
import { UserPreferences } from "@/data/parkingSpots";

interface SearchPanelProps {
  onSearch: (lat: number, lng: number, prefs: UserPreferences) => void;
}

const PRESET_LOCATIONS = [
  { name: "MG Road", lat: 12.9756, lng: 77.6064 },
  { name: "Brigade Road", lat: 12.9738, lng: 77.6070 },
  { name: "Cubbon Park", lat: 12.9770, lng: 77.5960 },
  { name: "UB City Mall", lat: 12.9715, lng: 77.5965 },
  { name: "Church Street", lat: 12.9745, lng: 77.6042 },
];

export default function SearchPanel({ onSearch }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [duration, setDuration] = useState(2);
  const [freeOnly, setFreeOnly] = useState(false);
  const [maxWalk, setMaxWalk] = useState(800);
  const [shadePriority, setShadePriority] = useState<"low" | "medium" | "high">("medium");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = PRESET_LOCATIONS.filter((l) =>
    l.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (loc: (typeof PRESET_LOCATIONS)[0]) => {
    setQuery(loc.name);
    setShowSuggestions(false);
    onSearch(loc.lat, loc.lng, { freeOnly, maxWalkingDistance: maxWalk, shadePriority, parkingDuration: duration });
  };

  const handleSubmit = () => {
    const loc = PRESET_LOCATIONS.find((l) =>
      l.name.toLowerCase().includes(query.toLowerCase())
    );
    if (loc) {
      onSearch(loc.lat, loc.lng, { freeOnly, maxWalkingDistance: maxWalk, shadePriority, parkingDuration: duration });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-4 space-y-4"
    >
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search destination..."
          className="w-full bg-secondary/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        />
        {showSuggestions && query.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 glass-card rounded-lg overflow-hidden z-50">
            {filtered.map((loc) => (
              <button
                key={loc.name}
                onClick={() => handleSelect(loc)}
                className="w-full text-left px-4 py-2.5 text-sm font-mono text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                📍 {loc.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Duration */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" /> Duration: {duration}h
        </label>
        <input
          type="range" min={0.5} max={8} step={0.5} value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full accent-primary h-1"
        />
      </div>

      {/* Max Walk */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
          <Footprints className="w-3.5 h-3.5" /> Max walk: {maxWalk}m
        </label>
        <input
          type="range" min={200} max={2000} step={100} value={maxWalk}
          onChange={(e) => setMaxWalk(Number(e.target.value))}
          className="w-full accent-primary h-1"
        />
      </div>

      {/* Shade Priority */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
          <Sun className="w-3.5 h-3.5" /> Shade priority
        </label>
        <div className="flex gap-2">
          {(["low", "medium", "high"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setShadePriority(p)}
              className={`flex-1 py-1.5 rounded-md text-xs font-mono font-semibold uppercase transition-all ${
                shadePriority === p
                  ? "bg-primary text-primary-foreground neon-glow"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Free Only */}
      <button
        onClick={() => setFreeOnly(!freeOnly)}
        className={`w-full py-2 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all ${
          freeOnly
            ? "bg-neon-green/20 text-neon-green border border-neon-green/30"
            : "bg-secondary text-secondary-foreground border border-border"
        }`}
      >
        {freeOnly ? "✓ Free parking only" : "All parking types"}
      </button>

      {/* Search Button */}
      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-lg font-mono font-bold text-sm uppercase tracking-wider bg-primary text-primary-foreground neon-glow hover:opacity-90 transition-all flex items-center justify-center gap-2"
      >
        <Zap className="w-4 h-4" /> Find Smart Parking
      </button>
    </motion.div>
  );
}
