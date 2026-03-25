import express from "express";
import Report from "../models/Report.js";
import ParkingSpot from "../models/ParkingSpot.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// POST /api/reports - Submit a report (requires auth)
router.post("/", auth, async (req, res) => {
  try {
    const { spotId, type } = req.body;

    if (!spotId || !type) {
      return res.status(400).json({ message: "spotId and type are required" });
    }

    if (!["safe", "fine", "theft"].includes(type)) {
      return res.status(400).json({ message: "Invalid report type" });
    }

    // Find ParkingSpot document
    const spot = await ParkingSpot.findOne({ spotId });
    if (!spot) {
      return res.status(404).json({ message: "Parking spot not found" });
    }

    const report = await Report.create({
      spot: spot._id,
      spotId,
      user: req.userId,
      type,
    });

    res.status(201).json({
      message: "Report submitted successfully",
      report: {
        id: report._id,
        spotId: report.spotId,
        type: report.type,
        timestamp: report.createdAt,
      },
    });
  } catch (error) {
    console.error("Report error:", error);
    res.status(500).json({ message: "Server error submitting report" });
  }
});

// GET /api/reports/:spotId - Get reports for a spot
router.get("/:spotId", async (req, res) => {
  try {
    const reports = await Report.find({ spotId: req.params.spotId })
      .sort({ createdAt: -1 })
      .populate("user", "name")
      .lean();

    res.json(
      reports.map((r) => ({
        id: r._id,
        type: r.type,
        userName: r.user?.name || "Anonymous",
        timestamp: r.createdAt,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
