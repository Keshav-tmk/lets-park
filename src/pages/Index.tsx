import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import SearchPanel from "@/components/SearchPanel";
import ParkingMap from "@/components/ParkingMap";
import SpotCard from "@/components/SpotCard";
import ReportModal from "@/components/ReportModal";
import { ParkingSpot, ScoredSpot, UserPreferences } from "@/data/parkingSpots";
import { rankParkingSpots } from "@/engine/scoringEngine";
import { apiGetSpots } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

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

  const { isAuthenticated } = useAuth();

  // Fetch parking spots from backend
  const fetchSpots = useCallback(async () => {
    setIsLoadingSpots(true);
    try {
      const spots = await apiGetSpots();
      setParkingSpots(spots);
      setDataSource("backend");
    } catch (error) {
      console.warn("Backend unavailable, using mock data:", error);
      // Fallback to mock data
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
      const ranked = rankParkingSpots(parkingSpots, lat, lng, prefs);
      setResults(ranked);
      setSelectedSpot(null);
      setHasSearched(true);
    },
    [parkingSpots]
  );

  const handleReportSuccess = useCallback(() => {
    // Refresh spots data after a report
    fetchSpots();
  }, [fetchSpots]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background p-3 gap-3">
      {/* Header */}
      <Header />

      {/* Data source indicator */}
      <div className="flex items-center justify-center">
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
      </div>

      {/* Main content */}
      <div className="flex-1 flex gap-3 min-h-0">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-[340px] shrink-0 flex flex-col gap-3 overflow-hidden"
        >
          <SearchPanel onSearch={handleSearch} />

          {/* Results */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-0">
            {hasSearched && results.length === 0 && (
              <div className="glass-card rounded-xl p-6 text-center">
                <div className="text-3xl mb-2">🔍</div>
                <p className="text-sm font-mono text-muted-foreground">
                  No spots found. Try increasing walk distance.
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
                />
              ))}
            </AnimatePresence>

            {/* Report button */}
            {selectedSpot && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => {
                  if (!isAuthenticated) {
                    // Will be handled inside the report modal
                  }
                  setReportSpot(selectedSpot);
                }}
                className="w-full py-2.5 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-neon-amber/10 text-neon-amber border border-neon-amber/20 hover:bg-neon-amber/20 transition-all flex items-center justify-center gap-2"
              >
                <Flag className="w-3.5 h-3.5" /> Report this spot
              </motion.button>
            )}
          </div>
        </motion.aside>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 glass-card rounded-xl overflow-hidden"
        >
          <ParkingMap
            spots={results}
            destLat={destLat}
            destLng={destLng}
            onSpotClick={setSelectedSpot}
            selectedSpotId={selectedSpot?.id}
          />
        </motion.div>
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
