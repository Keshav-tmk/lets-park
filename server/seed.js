import mongoose from "mongoose";
import dotenv from "dotenv";
import ParkingSpot from "./models/ParkingSpot.js";

dotenv.config();

const spots = [
  { spotId: "ps-01", name: "Brigade Road Basement", lat: 12.9738, lng: 77.607, type: "paid", costPerHour: 20, legalityScore: 1.0, safetyScore: 0.9, shadeScore: 1.0, accessibilityScore: 0.85, capacity: 50, occupied: 35, lighting: "good", nearMainRoad: false },
  { spotId: "ps-02", name: "MG Road Metro Side", lat: 12.9756, lng: 77.6064, type: "free", costPerHour: 0, legalityScore: 0.9, safetyScore: 0.8, shadeScore: 0.6, accessibilityScore: 0.9, capacity: 20, occupied: 14, lighting: "good", nearMainRoad: true },
  { spotId: "ps-03", name: "Church Street Alley", lat: 12.9745, lng: 77.6042, type: "free", costPerHour: 0, legalityScore: 0.7, safetyScore: 0.6, shadeScore: 0.8, accessibilityScore: 0.7, capacity: 15, occupied: 12, lighting: "moderate", nearMainRoad: false },
  { spotId: "ps-04", name: "Residency Road Parking", lat: 12.972, lng: 77.609, type: "paid", costPerHour: 15, legalityScore: 1.0, safetyScore: 0.85, shadeScore: 0.5, accessibilityScore: 0.6, capacity: 30, occupied: 20, lighting: "good", nearMainRoad: true },
  { spotId: "ps-05", name: "Lavelle Road Shade", lat: 12.971, lng: 77.602, type: "free", costPerHour: 0, legalityScore: 0.85, safetyScore: 0.75, shadeScore: 0.95, accessibilityScore: 0.5, capacity: 10, occupied: 6, lighting: "moderate", nearMainRoad: false },
  { spotId: "ps-06", name: "UB City Two-Wheeler", lat: 12.9715, lng: 77.5965, type: "paid", costPerHour: 30, legalityScore: 1.0, safetyScore: 0.95, shadeScore: 1.0, accessibilityScore: 0.4, capacity: 100, occupied: 60, lighting: "good", nearMainRoad: false },
  { spotId: "ps-07", name: "Cubbon Park Gate", lat: 12.977, lng: 77.596, type: "free", costPerHour: 0, legalityScore: 0.4, safetyScore: 0.5, shadeScore: 0.9, accessibilityScore: 0.65, capacity: 8, occupied: 5, lighting: "poor", nearMainRoad: false },
  { spotId: "ps-08", name: "Kamaraj Road Spot", lat: 12.979, lng: 77.601, type: "free", costPerHour: 0, legalityScore: 0.6, safetyScore: 0.55, shadeScore: 0.3, accessibilityScore: 0.75, capacity: 12, occupied: 8, lighting: "moderate", nearMainRoad: true },
  { spotId: "ps-09", name: "Museum Road Secure", lat: 12.9735, lng: 77.599, type: "paid", costPerHour: 10, legalityScore: 1.0, safetyScore: 0.88, shadeScore: 0.7, accessibilityScore: 0.72, capacity: 25, occupied: 15, lighting: "good", nearMainRoad: false },
  { spotId: "ps-10", name: "Vittal Mallya Road", lat: 12.9698, lng: 77.5985, type: "free", costPerHour: 0, legalityScore: 0.75, safetyScore: 0.7, shadeScore: 0.4, accessibilityScore: 0.55, capacity: 18, occupied: 10, lighting: "moderate", nearMainRoad: true },
  { spotId: "ps-11", name: "Cunningham Road Bay", lat: 12.982, lng: 77.594, type: "paid", costPerHour: 12, legalityScore: 1.0, safetyScore: 0.82, shadeScore: 0.6, accessibilityScore: 0.45, capacity: 40, occupied: 28, lighting: "good", nearMainRoad: true },
  { spotId: "ps-12", name: "Infantry Road Corner", lat: 12.98, lng: 77.6, type: "free", costPerHour: 0, legalityScore: 0.3, safetyScore: 0.4, shadeScore: 0.2, accessibilityScore: 0.8, capacity: 6, occupied: 5, lighting: "poor", nearMainRoad: true },
  { spotId: "ps-13", name: "St. Marks Road Tree", lat: 12.9725, lng: 77.6035, type: "free", costPerHour: 0, legalityScore: 0.8, safetyScore: 0.72, shadeScore: 0.85, accessibilityScore: 0.68, capacity: 10, occupied: 7, lighting: "moderate", nearMainRoad: false },
  { spotId: "ps-14", name: "Commissariat Road", lat: 12.9705, lng: 77.6055, type: "paid", costPerHour: 8, legalityScore: 0.95, safetyScore: 0.78, shadeScore: 0.55, accessibilityScore: 0.82, capacity: 22, occupied: 14, lighting: "good", nearMainRoad: false },
  { spotId: "ps-15", name: "Kasturba Road Open", lat: 12.9755, lng: 77.593, type: "free", costPerHour: 0, legalityScore: 0.5, safetyScore: 0.6, shadeScore: 0.15, accessibilityScore: 0.5, capacity: 15, occupied: 9, lighting: "moderate", nearMainRoad: true },
  { spotId: "ps-16", name: "Rest House Crescent", lat: 12.9742, lng: 77.6085, type: "free", costPerHour: 0, legalityScore: 0.88, safetyScore: 0.76, shadeScore: 0.7, accessibilityScore: 0.78, capacity: 12, occupied: 8, lighting: "good", nearMainRoad: false },
  { spotId: "ps-17", name: "Dickenson Road Multi", lat: 12.9692, lng: 77.6105, type: "paid", costPerHour: 25, legalityScore: 1.0, safetyScore: 0.92, shadeScore: 1.0, accessibilityScore: 0.35, capacity: 60, occupied: 40, lighting: "good", nearMainRoad: false },
  { spotId: "ps-18", name: "Primrose Road Spot", lat: 12.9717, lng: 77.6045, type: "free", costPerHour: 0, legalityScore: 0.72, safetyScore: 0.65, shadeScore: 0.75, accessibilityScore: 0.62, capacity: 8, occupied: 4, lighting: "moderate", nearMainRoad: false },
  { spotId: "ps-19", name: "Ali Asker Road Open", lat: 12.981, lng: 77.597, type: "free", costPerHour: 0, legalityScore: 0.55, safetyScore: 0.5, shadeScore: 0.35, accessibilityScore: 0.42, capacity: 10, occupied: 7, lighting: "poor", nearMainRoad: false },
  { spotId: "ps-20", name: "Richmond Road Circle", lat: 12.968, lng: 77.607, type: "paid", costPerHour: 18, legalityScore: 1.0, safetyScore: 0.84, shadeScore: 0.45, accessibilityScore: 0.58, capacity: 35, occupied: 22, lighting: "good", nearMainRoad: true },
  { spotId: "ps-21", name: "Hosur Road Flyover", lat: 12.9665, lng: 77.6095, type: "free", costPerHour: 0, legalityScore: 0.2, safetyScore: 0.35, shadeScore: 0.9, accessibilityScore: 0.3, capacity: 5, occupied: 3, lighting: "poor", nearMainRoad: true },
  { spotId: "ps-22", name: "Double Road Lane", lat: 12.9675, lng: 77.601, type: "free", costPerHour: 0, legalityScore: 0.82, safetyScore: 0.7, shadeScore: 0.6, accessibilityScore: 0.48, capacity: 14, occupied: 9, lighting: "moderate", nearMainRoad: false },
  { spotId: "ps-23", name: "Queens Road Secure", lat: 12.9795, lng: 77.595, type: "paid", costPerHour: 15, legalityScore: 1.0, safetyScore: 0.9, shadeScore: 0.8, accessibilityScore: 0.4, capacity: 45, occupied: 30, lighting: "good", nearMainRoad: true },
  { spotId: "ps-24", name: "Shivaji Nagar Gate", lat: 12.983, lng: 77.603, type: "free", costPerHour: 0, legalityScore: 0.65, safetyScore: 0.58, shadeScore: 0.5, accessibilityScore: 0.38, capacity: 20, occupied: 15, lighting: "moderate", nearMainRoad: true },
  { spotId: "ps-25", name: "Mahatma Gandhi Rd E", lat: 12.9762, lng: 77.61, type: "free", costPerHour: 0, legalityScore: 0.78, safetyScore: 0.68, shadeScore: 0.55, accessibilityScore: 0.88, capacity: 16, occupied: 11, lighting: "moderate", nearMainRoad: true },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing spots
    await ParkingSpot.deleteMany({});
    console.log("Cleared existing parking spots");

    // Insert spots
    await ParkingSpot.insertMany(spots);
    console.log(`✅ Seeded ${spots.length} parking spots`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
