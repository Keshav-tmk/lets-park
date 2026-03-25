import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, Loader2, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import SearchPanel from "@/components/SearchPanel";
import ParkingMap from "@/components/ParkingMap";
import SpotCard from "@/components/SpotCard";
import SpotDetailPanel from "@/components/SpotDetailPanel";
import ReportModal from "@/components/ReportModal";
import { ParkingSpot, ScoredSpot, UserPreferences } from "@/data/parkingSpots";
import { rankParkingSpots } from "@/engine/scoringEngine";
import { apiGetSpots } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useGeocoding } from "@/hooks/useGeocoding";

export default function Index() {
  const [destLat, setDestLat] = useState(12.9756);
  const [destLng, setDestLng] = useState(77.6064);
  const [results, setResults] = useState<ScoredSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<ScoredSpot | null>(null);
  const [reportSpot, setReportSpot] = useState<ScoredSpot | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [isLoadingSpots, setIsLoadingSpots] = useState(true);
  const [dataSource, setDataSource] = useState<"backend" | "mock">("mock");
  const [mapClickedLocation, setMapClickedLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [lastPrefs, setLastPrefs] = useState<UserPreferences>({
    freeOnly: false,
    maxWalkingDistance: 800,
    shadePriority: "medium",
    parkingDuration: 2,
  });

  const { isAuthenticated } = useAuth();
  const { reverseGeocode } = useGeocoding();

  // Fetch parking spots from backend
  const fetchSpots = useCallback(async () => {
    setIsLoadingSpots(true);
    try {
      const spots = await apiGetSpots();
      setParkingSpots(spots);
      setDataSource("backend");
    } catch (error) {
      console.warn("Backend unavailable, using mock data:", error);
      const { mockParkingSpots } = await import("@/data/parkingSpots");
      setParkingSpots(mockParkingSpots);
      setDataSource("mock");
    } finally {
      setIsLoadingSpots(false);
    }
  }, []);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  const handleSearch = useCallback(
    (lat: number, lng: number, prefs: UserPreferences) => {
      setDestLat(lat);
      setDestLng(lng);
      setLastPrefs(prefs);
      const ranked = rankParkingSpots(parkingSpots, lat, lng, prefs);
      setResults(ranked);
      setSelectedSpot(null);
      setHasSearched(true);
    },
    [parkingSpots]
  );

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setDestLat(lat);
    setDestLng(lng);
  }, []);

  // Handle map click → reverse geocode → set as destination
  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    const name = await reverseGeocode(lat, lng);
    const shortName = name.split(",").slice(0, 2).join(",");
    setMapClickedLocation({ lat, lng, name: shortName });
    setDestLat(lat);
    setDestLng(lng);

    // Auto-search with current preferences
    const ranked = rankParkingSpots(parkingSpots, lat, lng, lastPrefs);
    setResults(ranked);
    setSelectedSpot(null);
    setHasSearched(true);
  }, [reverseGeocode, parkingSpots, lastPrefs]);

  const handleReportSuccess = useCallback(() => {
    fetchSpots();
  }, [fetchSpots]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background p-2 gap-2">
      {/* Header */}
      <Header />

      {/* Status Bar */}
      <div className="flex items-center justify-center gap-3">
        <div
          className={`text-[10px] font-mono px-3 py-1 rounded-full border ${
            dataSource === "backend"
              ? "text-neon-green bg-neon-green/10 border-neon-green/20"
              : "text-neon-amber bg-neon-amber/10 border-neon-amber/20"
          }`}
        >
          {isLoadingSpots ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" /> Connecting...
            </span>
          ) : dataSource === "backend" ? (
            "● Live — Connected to Backend"
          ) : (
            "○ Offline — Using Mock Data"
          )}
        </div>
        {hasSearched && (
          <div className="text-[10px] font-mono px-3 py-1 rounded-full border text-primary bg-primary/10 border-primary/20">
            {results.length} spots found
          </div>
        )}
      </div>

      {/* Main 3-panel content */}
      <div className="flex-1 flex gap-2 min-h-0">
        {/* Left: Search + Results */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={`${selectedSpot ? "w-[280px]" : "w-[340px]"} shrink-0 flex flex-col gap-2 overflow-hidden transition-all duration-300`}
        >
          <SearchPanel
            onSearch={handleSearch}
            onLocationSelect={handleLocationSelect}
            mapClickedLocation={mapClickedLocation}
          />

          {/* Results list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
            {hasSearched && results.length === 0 && (
              <div className="glass-card rounded-xl p-5 text-center">
                <div className="text-3xl mb-2">🔍</div>
                <p className="text-xs font-mono text-muted-foreground">
                  No spots found. Try increasing walk distance or changing location.
                </p>
              </div>
            )}

            <AnimatePresence>
              {results.map((spot, i) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  rank={i + 1}
                  isSelected={selectedSpot?.id === spot.id}
                  onClick={() => setSelectedSpot(spot)}
                  compact={!!selectedSpot}
                />
              ))}
            </AnimatePresence>

            {/* Report button */}
            {selectedSpot && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setReportSpot(selectedSpot)}
                className="w-full py-2 rounded-xl text-[10px] font-mono font-semibold uppercase tracking-wider bg-neon-amber/10 text-neon-amber border border-neon-amber/20 hover:bg-neon-amber/20 transition-all flex items-center justify-center gap-2"
              >
                <Flag className="w-3 h-3" /> Report this spot
              </motion.button>
            )}
          </div>
        </motion.aside>

        {/* Center: Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 glass-card rounded-xl overflow-hidden min-w-0"
        >
          <ParkingMap
            spots={results}
            destLat={destLat}
            destLng={destLng}
            onSpotClick={setSelectedSpot}
            selectedSpotId={selectedSpot?.id}
            onMapClick={handleMapClick}
            walkRadius={lastPrefs.maxWalkingDistance}
          />
        </motion.div>

        {/* Right: Detail Panel (slides in when spot selected) */}
        <AnimatePresence>
          {selectedSpot && (
            <SpotDetailPanel
              spot={selectedSpot}
              allSpots={results}
              onClose={() => setSelectedSpot(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Report Modal */}
      {reportSpot && (
        <ReportModal
          spot={reportSpot}
          onClose={() => setReportSpot(null)}
          onSubmit={handleReportSuccess}
        />
      )}
    </div>
  );
}
