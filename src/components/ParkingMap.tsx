import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ScoredSpot } from "@/data/parkingSpots";

// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

function createMarkerIcon(riskLevel: "low" | "medium" | "high", rank?: number) {
  const color = riskLevel === "low" ? "#22c55e" : riskLevel === "medium" ? "#f59e0b" : "#ef4444";
  const glow = riskLevel === "low" ? "rgba(34,197,94,0.5)" : riskLevel === "medium" ? "rgba(245,158,11,0.5)" : "rgba(239,68,68,0.5)";

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width:${rank ? 36 : 26}px;height:${rank ? 36 : 26}px;
      background:${color};border-radius:50%;
      box-shadow:0 0 16px ${glow}, 0 0 6px ${glow};
      display:flex;align-items:center;justify-content:center;
      font-size:13px;font-weight:800;color:#0a0f1a;
      border:2px solid rgba(255,255,255,0.3);
      transition: transform 0.2s;
      cursor: pointer;
    ">${rank ?? ""}</div>`,
    iconSize: [rank ? 36 : 26, rank ? 36 : 26],
    iconAnchor: [rank ? 18 : 13, rank ? 18 : 13],
  });
}

function selectedMarkerIcon(rank: number) {
  return L.divIcon({
    className: "custom-marker-selected",
    html: `<div style="
      width:44px;height:44px;
      background:linear-gradient(135deg, #2dd4bf, #22c55e);
      border-radius:50%;
      box-shadow:0 0 24px rgba(45,212,191,0.7), 0 0 48px rgba(45,212,191,0.3);
      display:flex;align-items:center;justify-content:center;
      font-size:16px;font-weight:900;color:#0a0f1a;
      border:3px solid rgba(255,255,255,0.5);
      animation: pulse-marker 2s ease-in-out infinite;
    ">${rank}</div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

function destIcon() {
  return L.divIcon({
    className: "dest-marker",
    html: `<div style="
      width:24px;height:24px;position:relative;
    ">
      <div style="
        width:24px;height:24px;background:hsl(172,80%,50%);
        border-radius:50%;border:3px solid #fff;
        box-shadow:0 0 24px rgba(45,212,191,0.7), 0 0 48px rgba(45,212,191,0.3);
        animation: pulse-dest 2s ease-in-out infinite;
      "></div>
      <div style="
        position:absolute;top:-8px;left:50%;transform:translateX(-50%);
        font-size:16px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));
      ">📍</div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 15, { duration: 1.2 });
  }, [lat, lng, map]);
  return null;
}

// Click handler component for map
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface ParkingMapProps {
  spots: ScoredSpot[];
  destLat: number;
  destLng: number;
  onSpotClick?: (spot: ScoredSpot) => void;
  selectedSpotId?: string | null;
  onMapClick?: (lat: number, lng: number) => void;
  walkRadius?: number;
}

export default function ParkingMap({
  spots,
  destLat,
  destLng,
  onSpotClick,
  selectedSpotId,
  onMapClick,
  walkRadius = 800,
}: ParkingMapProps) {
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

      {/* Click handler */}
      {onMapClick && <MapClickHandler onMapClick={onMapClick} />}

      {/* Destination marker */}
      <Marker position={[destLat, destLng]} icon={destIcon()}>
        <Popup>
          <div className="text-center font-mono text-sm">
            <div className="font-bold">📍 Your Destination</div>
            <div className="text-xs text-gray-500 mt-1">
              {destLat.toFixed(4)}, {destLng.toFixed(4)}
            </div>
          </div>
        </Popup>
      </Marker>

      {/* Walking radius */}
      <Circle
        center={[destLat, destLng]}
        radius={walkRadius}
        pathOptions={{
          color: "hsl(172,80%,50%)",
          fillColor: "hsl(172,80%,50%)",
          fillOpacity: 0.04,
          weight: 1.5,
          dashArray: "8 6",
          opacity: 0.4,
        }}
      />

      {/* Inner radius indicator */}
      <Circle
        center={[destLat, destLng]}
        radius={walkRadius / 3}
        pathOptions={{
          color: "hsl(145,70%,50%)",
          fillColor: "hsl(145,70%,50%)",
          fillOpacity: 0.03,
          weight: 1,
          dashArray: "4 4",
          opacity: 0.25,
        }}
      />

      {/* Parking spot markers */}
      {spots.map((spot, i) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={
            selectedSpotId === spot.id
              ? selectedMarkerIcon(i + 1)
              : createMarkerIcon(spot.riskLevel, i + 1)
          }
          eventHandlers={{
            click: () => onSpotClick?.(spot),
          }}
        >
          <Popup>
            <div className="font-mono text-xs space-y-1.5 min-w-[180px] p-1">
              <div className="font-bold text-sm">{spot.name}</div>
              <div className="flex justify-between">
                <span>Score:</span>
                <span className="font-bold text-green-600">{spot.finalScore.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Walk:</span>
                <span>{spot.walkTimeMinutes} min ({spot.walkDistanceMeters}m)</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span>{spot.type === "free" ? "🆓 Free" : `₹${spot.costPerHour}/hr`}</span>
              </div>
              <div className="flex justify-between">
                <span>Risk:</span>
                <span className={
                  spot.riskLevel === "low" ? "text-green-600" :
                  spot.riskLevel === "medium" ? "text-yellow-600" : "text-red-600"
                }>{spot.riskLevel.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>Occupancy:</span>
                <span>{spot.occupied}/{spot.capacity}</span>
              </div>
              <a
                href={`https://www.google.com/maps/@${spot.lat},${spot.lng},3a,75y,90t/data=!3m6!1e1!3m4!1s!2e0!3e2!4s`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center mt-1 py-1 px-2 bg-blue-500 text-white rounded text-[10px] font-bold hover:bg-blue-600"
              >
                🌐 Open Street View
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
