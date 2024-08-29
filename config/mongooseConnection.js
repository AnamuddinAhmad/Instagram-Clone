const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGO_URI;

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
}

connectToDatabase();

module.exports = mongoose.connection;
