const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    // every trip belongs to the user who created it
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    from: {
      type: String,
      required: [true, "Starting point is required"],
      trim: true,
    },
    to: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Travel date is required"],
    },
    distanceText: {
      // human readable distance, e.g. "412 km" - comes straight from Google Maps
      type: String,
      default: "",
    },
    durationText: {
      // human readable duration, e.g. "6 hours 30 mins"
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      // lets the user track progress on the trip
      type: String,
      enum: ["planned", "completed"],
      default: "planned",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trip", tripSchema);
