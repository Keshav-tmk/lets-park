import mongoose from "mongoose";

const parkingSpotSchema = new mongoose.Schema(
  {
    spotId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    type: { type: String, enum: ["free", "paid"], required: true },
    costPerHour: { type: Number, default: 0 },
    legalityScore: { type: Number, min: 0, max: 1, required: true },
    safetyScore: { type: Number, min: 0, max: 1, required: true },
    shadeScore: { type: Number, min: 0, max: 1, required: true },
    accessibilityScore: { type: Number, min: 0, max: 1, required: true },
    capacity: { type: Number, required: true },
    occupied: { type: Number, default: 0 },
    lighting: { type: String, enum: ["good", "moderate", "poor"], required: true },
    nearMainRoad: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ParkingSpot = mongoose.model("ParkingSpot", parkingSpotSchema);
export default ParkingSpot;
