const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// allow requests only from our client app (set CLIENT_URL in .env)
// falls back to allowing everything if it's not set, so local dev still works
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);

// lets us read JSON from the request body
app.use(express.json());

// simple route to check the API is alive - useful for Render's health checks
app.get("/", (req, res) => {
  res.json({ message: "Tripify API is up and running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/trips", require("./routes/tripRoutes"));
app.use("/api/places", require("./routes/placeRoutes"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Tripify server running on port ${PORT}`);
});
