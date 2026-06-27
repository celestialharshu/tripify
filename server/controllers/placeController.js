const Place = require("../models/Place");

// GET /api/places
// public route, returns every destination so the home page grid can render them
const getPlaces = async (req, res, next) => {
  try {
    const places = await Place.find().sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    next(error);
  }
};

// GET /api/places/:id
const getPlaceById = async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      res.status(404);
      throw new Error("Place not found");
    }

    res.json(place);
  } catch (error) {
    next(error);
  }
};

// POST /api/places
// protected route - lets a logged in user add a new destination card
// (handy for now since there's no separate admin panel yet)
const createPlace = async (req, res, next) => {
  try {
    const { name, location, description, image, category, rating } = req.body;

    if (!name || !location || !description || !image) {
      res.status(400);
      throw new Error("Name, location, description and image are required");
    }

    const place = await Place.create({
      name,
      location,
      description,
      image,
      category,
      rating,
    });

    res.status(201).json(place);
  } catch (error) {
    next(error);
  }
};

module.exports = { getPlaces, getPlaceById, createPlace };
