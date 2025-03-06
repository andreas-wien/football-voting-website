const mongoose = require("mongoose");

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("Already connected to MongoDB.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "football-voting",
    });
    console.log("MongoDB connected.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
