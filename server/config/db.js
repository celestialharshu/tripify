const mongoose = require("mongoose");

// connects to MongoDB using the URI from our .env file
// this is called once when the server starts up
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
    // no point running the server without a database, so we exit
    process.exit(1);
  }
};

module.exports = connectDB;
