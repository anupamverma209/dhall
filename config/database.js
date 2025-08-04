const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
      process.exit(1);
    });
};

module.exports = connectDB;
