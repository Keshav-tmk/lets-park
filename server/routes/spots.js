import express from "express";
import ParkingSpot from "../models/ParkingSpot.js";
import Report from "../models/Report.js";

const router = express.Router();

// GET /api/spots - Get all parking spots with their reports
router.get("/", async (req, res) => {
  try {
    const spots = await ParkingSpot.find().lean();

    // Fetch reports for each spot
    const spotIds = spots.map((s) => s.spotId);
    const reports = await Report.find({ spotId: { $in: spotIds } })
      .sort({ createdAt: -1 })
      .lean();

    // Group reports by spotId
    const reportMap = {};
    for (const r of reports) {
      if (!reportMap[r.spotId]) reportMap[r.spotId] = [];
      reportMap[r.spotId].push({
        type: r.type,
        timestamp: r.createdAt,
      });
    }

    // Attach reports to spots and format for frontend
    const formatted = spots.map((spot) => ({
      id: spot.spotId,
      name: spot.name,
      lat: spot.lat,
      lng: spot.lng,
      type: spot.type,
      costPerHour: spot.costPerHour,
      legalityScore: spot.legalityScore,
      safetyScore: spot.safetyScore,
      shadeScore: spot.shadeScore,
      accessibilityScore: spot.accessibilityScore,
      capacity: spot.capacity,
      occupied: spot.occupied,
      lighting: spot.lighting,
      nearMainRoad: spot.nearMainRoad,
      reports: reportMap[spot.spotId] || [],
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching spots:", error);
    res.status(500).json({ message: "Server error fetching spots" });
  }
});

// GET /api/spots/:spotId - Get single spot
router.get("/:spotId", async (req, res) => {
  try {
    const spot = await ParkingSpot.findOne({ spotId: req.params.spotId }).lean();
    if (!spot) {
      return res.status(404).json({ message: "Spot not found" });
    }

    const reports = await Report.find({ spotId: req.params.spotId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      id: spot.spotId,
      name: spot.name,
      lat: spot.lat,
      lng: spot.lng,
      type: spot.type,
      costPerHour: spot.costPerHour,
      legalityScore: spot.legalityScore,
      safetyScore: spot.safetyScore,
      shadeScore: spot.shadeScore,
      accessibilityScore: spot.accessibilityScore,
      capacity: spot.capacity,
      occupied: spot.occupied,
      lighting: spot.lighting,
      nearMainRoad: spot.nearMainRoad,
      reports: reports.map((r) => ({ type: r.type, timestamp: r.createdAt })),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
