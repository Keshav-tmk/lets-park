import { useState, useCallback, useRef } from "react";

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
  type: string;
}

export function useGeocoding() {
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const search = useCallback(async (query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 3) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&addressdetails=1&countrycodes=in`
        );
        const data = await res.json();
        setResults(
          data.map((item: any) => ({
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            displayName: item.display_name,
            type: item.type || "place",
          }))
        );
      } catch (e) {
        console.error("Geocoding error:", e);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`
      );
      const data = await res.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }, []);

  return {
    results,
    isSearching,
    search,
    reverseGeocode,
    clearResults: () => setResults([]),
  };
}
