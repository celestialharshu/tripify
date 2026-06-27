const express = require("express");
const router = express.Router();
const {
  createTrip,
  getMyTrips,
  updateTrip,
  deleteTrip,
} = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware");

// every trip route needs the user to be logged in
router.route("/").post(protect, createTrip).get(protect, getMyTrips);
router.route("/:id").put(protect, updateTrip).delete(protect, deleteTrip);

module.exports = router;
