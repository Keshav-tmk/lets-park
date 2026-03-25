import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    spot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingSpot",
      required: true,
    },
    spotId: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["safe", "fine", "theft"],
      required: true,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
