import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Footprints, Sun, Zap, MapPin, Loader2, Navigation, Crosshair } from "lucide-react";
import { UserPreferences } from "@/data/parkingSpots";
import { useGeocoding, GeocodingResult } from "@/hooks/useGeocoding";

interface SearchPanelProps {
  onSearch: (lat: number, lng: number, prefs: UserPreferences) => void;
  onLocationSelect: (lat: number, lng: number) => void;
  mapClickedLocation: { lat: number; lng: number; name: string } | null;
}

const POPULAR_LOCATIONS = [
  { name: "MG Road", lat: 12.9756, lng: 77.6064, icon: "🏙️" },
  { name: "Brigade Road", lat: 12.9738, lng: 77.607, icon: "🛍️" },
  { name: "Church Street", lat: 12.9745, lng: 77.6042, icon: "🍕" },
  { name: "Cubbon Park", lat: 12.977, lng: 77.596, icon: "🌳" },
  { name: "UB City Mall", lat: 12.9715, lng: 77.5965, icon: "💎" },
  { name: "Commercial Street", lat: 12.9828, lng: 77.6074, icon: "🛒" },
  { name: "Koramangala", lat: 12.9352, lng: 77.6245, icon: "🏘️" },
  { name: "Indiranagar", lat: 12.9784, lng: 77.6408, icon: "🎵" },
  { name: "HSR Layout", lat: 12.9116, lng: 77.6389, icon: "🏡" },
  { name: "Whitefield", lat: 12.9698, lng: 77.75, icon: "💻" },
  { name: "Jayanagar", lat: 12.9308, lng: 77.5838, icon: "🏛️" },
  { name: "Malleshwaram", lat: 12.9965, lng: 77.5706, icon: "🛕" },
  { name: "BTM Layout", lat: 12.9166, lng: 77.6101, icon: "🏢" },
  { name: "Electronic City", lat: 12.8456, lng: 77.6603, icon: "⚡" },
  { name: "Marathahalli", lat: 12.9562, lng: 77.7019, icon: "🚦" },
  { name: "Bannerghatta Rd", lat: 12.8876, lng: 77.5968, icon: "🐯" },
  { name: "Hebbal", lat: 13.035, lng: 77.597, icon: "🌊" },
  { name: "Yeshwanthpur", lat: 13.0222, lng: 77.5509, icon: "🚂" },
  { name: "Rajajinagar", lat: 12.9887, lng: 77.5553, icon: "🏗️" },
  { name: "Basavanagudi", lat: 12.9425, lng: 77.5737, icon: "🐂" },
];

export default function SearchPanel({ onSearch, onLocationSelect, mapClickedLocation }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [duration, setDuration] = useState(2);
  const [freeOnly, setFreeOnly] = useState(false);
  const [maxWalk, setMaxWalk] = useState(800);
  const [shadePriority, setShadePriority] = useState<"low" | "medium" | "high">("medium");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLng, setSelectedLng] = useState<number | null>(null);
  const [showPopular, setShowPopular] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { results: geoResults, isSearching, search: geoSearch, clearResults } = useGeocoding();

  // Handle map click location
  useEffect(() => {
    if (mapClickedLocation) {
      setQuery(mapClickedLocation.name);
      setSelectedLat(mapClickedLocation.lat);
      setSelectedLng(mapClickedLocation.lng);
      setShowSuggestions(false);
      clearResults();
    }
  }, [mapClickedLocation, clearResults]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setShowPopular(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSelectedLat(null);
    setSelectedLng(null);
    if (val.length >= 3) {
      geoSearch(val);
      setShowSuggestions(true);
      setShowPopular(false);
    } else if (val.length === 0) {
      clearResults();
      setShowSuggestions(false);
    }
  };

  const handleSelectGeo = (result: GeocodingResult) => {
    setQuery(result.displayName.split(",").slice(0, 2).join(","));
    setSelectedLat(result.lat);
    setSelectedLng(result.lng);
    setShowSuggestions(false);
    clearResults();
    onLocationSelect(result.lat, result.lng);
  };

  const handleSelectPopular = (loc: (typeof POPULAR_LOCATIONS)[0]) => {
    setQuery(loc.name);
    setSelectedLat(loc.lat);
    setSelectedLng(loc.lng);
    setShowSuggestions(false);
    setShowPopular(false);
    onLocationSelect(loc.lat, loc.lng);
    onSearch(loc.lat, loc.lng, {
      freeOnly,
      maxWalkingDistance: maxWalk,
      shadePriority,
      parkingDuration: duration,
    });
  };

  const handleSubmit = () => {
    if (selectedLat !== null && selectedLng !== null) {
      onSearch(selectedLat, selectedLng, {
        freeOnly,
        maxWalkingDistance: maxWalk,
        shadePriority,
        parkingDuration: duration,
      });
    }
  };

  // Filtered popular locations
  const filteredPopular = query
    ? POPULAR_LOCATIONS.filter((l) =>
        l.name.toLowerCase().includes(query.toLowerCase())
      )
    : POPULAR_LOCATIONS;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-4 space-y-3"
    >
      {/* Search */}
      <div ref={searchRef} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
        <input
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => {
            if (query.length >= 3) setShowSuggestions(true);
            else setShowPopular(true);
          }}
          placeholder="Search any location..."
          className="w-full bg-secondary/50 border border-border rounded-lg pl-10 pr-10 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
        )}
        {selectedLat !== null && !isSearching && (
          <Navigation className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-green" />
        )}

        {/* Geocoding results */}
        <AnimatePresence>
          {showSuggestions && geoResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-full left-0 right-0 mt-1 glass-card rounded-lg overflow-hidden z-50 max-h-[240px] overflow-y-auto"
            >
              {geoResults.map((result, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectGeo(result)}
                  className="w-full text-left px-4 py-2.5 text-xs font-mono text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors border-b border-border/30 last:border-0 flex items-start gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{result.displayName}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Popular locations */}
        <AnimatePresence>
          {showPopular && query.length < 3 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-full left-0 right-0 mt-1 glass-card rounded-lg overflow-hidden z-50 max-h-[280px] overflow-y-auto"
            >
              <div className="px-3 py-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest border-b border-border/30">
                Popular Destinations
              </div>
              {filteredPopular.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => handleSelectPopular(loc)}
                  className="w-full text-left px-4 py-2 text-xs font-mono text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span>{loc.icon}</span>
                  <span>{loc.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click-on-map hint */}
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-primary/5 border border-primary/10">
        <Crosshair className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="text-[10px] font-mono text-muted-foreground">
          Click anywhere on the map to set destination
        </span>
      </div>

      {/* Duration */}
      <div className="space-y-1">
        <label className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          <Clock className="w-3 h-3" /> Duration: {duration}h
        </label>
        <input
          type="range"
          min={0.5}
          max={8}
          step={0.5}
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full accent-primary h-1"
        />
      </div>

      {/* Max Walk */}
      <div className="space-y-1">
        <label className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          <Footprints className="w-3 h-3" /> Max walk: {maxWalk}m
        </label>
        <input
          type="range"
          min={200}
          max={2000}
          step={100}
          value={maxWalk}
          onChange={(e) => setMaxWalk(Number(e.target.value))}
          className="w-full accent-primary h-1"
        />
      </div>

      {/* Shade Priority */}
      <div className="space-y-1">
        <label className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
          <Sun className="w-3 h-3" /> Shade priority
        </label>
        <div className="flex gap-1.5">
          {(["low", "medium", "high"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setShadePriority(p)}
              className={`flex-1 py-1.5 rounded-md text-[10px] font-mono font-semibold uppercase transition-all ${
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
        className={`w-full py-2 rounded-lg text-[10px] font-mono font-semibold uppercase tracking-wider transition-all ${
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
        disabled={selectedLat === null}
        className="w-full py-2.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider bg-primary text-primary-foreground neon-glow hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Zap className="w-4 h-4" /> Find Smart Parking
      </button>
    </motion.div>
  );
}
