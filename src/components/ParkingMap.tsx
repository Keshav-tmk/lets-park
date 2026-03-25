import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ScoredSpot } from "@/data/parkingSpots";

// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

function createMarkerIcon(riskLevel: "low" | "medium" | "high", rank?: number) {
  const color = riskLevel === "low" ? "#22c55e" : riskLevel === "medium" ? "#f59e0b" : "#ef4444";
  const glow = riskLevel === "low" ? "rgba(34,197,94,0.4)" : riskLevel === "medium" ? "rgba(245,158,11,0.4)" : "rgba(239,68,68,0.4)";

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width:${rank ? 32 : 24}px;height:${rank ? 32 : 24}px;
      background:${color};border-radius:50%;
      box-shadow:0 0 12px ${glow}, 0 0 4px ${glow};
      display:flex;align-items:center;justify-content:center;
      font-size:12px;font-weight:700;color:#0a0f1a;
      border:2px solid rgba(255,255,255,0.2);
    ">${rank ?? ""}</div>`,
    iconSize: [rank ? 32 : 24, rank ? 32 : 24],
    iconAnchor: [rank ? 16 : 12, rank ? 16 : 12],
  });
}

function destIcon() {
  return L.divIcon({
    className: "dest-marker",
    html: `<div style="
      width:20px;height:20px;background:hsl(172,80%,50%);
      border-radius:50%;border:3px solid #fff;
      box-shadow:0 0 20px rgba(45,212,191,0.6);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 15, { duration: 1.2 });
  }, [lat, lng, map]);
  return null;
}

interface ParkingMapProps {
  spots: ScoredSpot[];
  destLat: number;
  destLng: number;
  onSpotClick?: (spot: ScoredSpot) => void;
  selectedSpotId?: string | null;
}

export default function ParkingMap({ spots, destLat, destLng, onSpotClick, selectedSpotId }: ParkingMapProps) {
  const mapRef = useRef<any>(null);

  return (
    <MapContainer
      ref={mapRef}
      center={[destLat, destLng]}
      zoom={15}
      className="w-full h-full rounded-lg"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FlyTo lat={destLat} lng={destLng} />

      {/* Destination marker */}
      <Marker position={[destLat, destLng]} icon={destIcon()}>
        <Popup>
          <div className="text-center font-mono text-sm">
            <div className="font-bold">📍 Destination</div>
          </div>
        </Popup>
      </Marker>

      {/* Walking radius */}
      <Circle
        center={[destLat, destLng]}
        radius={800}
        pathOptions={{
          color: "hsl(172,80%,50%)",
          fillColor: "hsl(172,80%,50%)",
          fillOpacity: 0.04,
          weight: 1,
          dashArray: "6 4",
          opacity: 0.3,
        }}
      />

      {/* Parking spot markers */}
      {spots.map((spot, i) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={createMarkerIcon(spot.riskLevel, i + 1)}
          eventHandlers={{
            click: () => onSpotClick?.(spot),
          }}
        >
          <Popup>
            <div className="font-mono text-xs space-y-1 min-w-[160px]">
              <div className="font-bold text-sm">{spot.name}</div>
              <div>Score: <span className="font-bold">{spot.finalScore.toFixed(2)}</span></div>
              <div>Walk: {spot.walkTimeMinutes} min</div>
              <div>Type: {spot.type}</div>
              <div>Risk: {spot.riskLevel.toUpperCase()}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
