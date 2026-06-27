// run this once with: npm run seed
// it fills the places collection with a few sample destinations
// so the home page has something to show before you add your own data

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Place = require("../models/Place");

dotenv.config();

const samplePlaces = [
  {
    name: "Gulmarg",
    location: "Jammu & Kashmir, India",
    description: "A snow-capped hill town famous for skiing and the Gondola cable car ride.",
    image: "https://images.unsplash.com/photo-1605538883669-825200433431?w=800",
    category: "Mountains",
    rating: 4.8,
  },
  {
    name: "Spiti Valley",
    location: "Himachal Pradesh, India",
    description: "A cold desert mountain valley with ancient monasteries and quiet villages.",
    image: "https://images.unsplash.com/photo-1626621341169-32fda9930fc7?w=800",
    category: "Offbeat",
    rating: 4.9,
  },
  {
    name: "Goa",
    location: "Goa, India",
    description: "Sun, beaches and a laid back coastal vibe along the Arabian Sea.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
    category: "Beach",
    rating: 4.6,
  },
  {
    name: "Rishikesh",
    location: "Uttarakhand, India",
    description: "The yoga capital of the world, set on the banks of the river Ganga.",
    image: "https://images.unsplash.com/photo-1591017683521-a3c8da5c01b4?w=800",
    category: "Adventure",
    rating: 4.7,
  },
];

const seedPlaces = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding");

    await Place.deleteMany();
    await Place.insertMany(samplePlaces);

    console.log("Sample places added successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedPlaces();
