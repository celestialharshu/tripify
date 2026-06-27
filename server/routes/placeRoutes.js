const express = require("express");
const router = express.Router();
const { getPlaces, getPlaceById, createPlace } = require("../controllers/placeController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getPlaces).post(protect, createPlace);
router.route("/:id").get(getPlaceById);

module.exports = router;
