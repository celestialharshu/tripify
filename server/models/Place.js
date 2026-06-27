const mongoose = require("mongoose");

// these are the destination cards shown on the home page
// add more documents to this collection and the home page grid grows on its own
const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Place name is required"],
      trim: true,
    },
    location: {
      // e.g. "Himachal Pradesh, India"
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "A short description is required"],
      trim: true,
    },
    image: {
      // direct image URL (Unsplash links work great for this)
      type: String,
      required: [true, "Image URL is required"],
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Place", placeSchema);
