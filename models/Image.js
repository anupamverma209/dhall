const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    scenario: {
      type: String,
      enum: ["real", "fake"],
      required: true,
    },
  },
  {
    timestamps: true, // optional, but useful for sorting or tracking
  }
);

module.exports = mongoose.model("Image", imageSchema);
