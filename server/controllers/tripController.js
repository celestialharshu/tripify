const Trip = require("../models/Trip");

// POST /api/trips
// saves a planned trip against the logged in user
const createTrip = async (req, res, next) => {
  try {
    const { from, to, date, distanceText, durationText, notes } = req.body;

    if (!from || !to || !date) {
      res.status(400);
      throw new Error("From, to and date are required");
    }

    const trip = await Trip.create({
      user: req.user._id,
      from,
      to,
      date,
      distanceText,
      durationText,
      notes,
    });

    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

// GET /api/trips
// returns only the trips that belong to the logged in user, newest first
const getMyTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ date: 1 });
    res.json(trips);
  } catch (error) {
    next(error);
  }
};

// PUT /api/trips/:id
// used mainly for flipping a trip between "planned" and "completed"
const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404);
      throw new Error("Trip not found");
    }

    // make sure people can only edit their own trips
    if (trip.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized to update this trip");
    }

    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedTrip);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/trips/:id
const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      res.status(404);
      throw new Error("Trip not found");
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized to delete this trip");
    }

    await trip.deleteOne();
    res.json({ message: "Trip removed", id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTrip, getMyTrips, updateTrip, deleteTrip };
