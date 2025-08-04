const Image = require("../models/Image");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const fetch = require("node-fetch");
require("dotenv").config();

const getRandomScenario = () => {
  return Math.random() < 0.5 ? "real" : "fake";
};

async function fileUploadToCloudinary(
  file,
  folder = "uploaded-images",
  type = "image"
) {
  return await cloudinary.uploader.upload(file.tempFilePath, {
    folder,
    resource_type: type,
  });
}

const REALITY_API =
  process.env.REALITY_DEFENDER_API_URL ||
  "https://api.realitydefender.com/v1/image/check";

async function checkImageByUrl(imageUrl) {
  const res = await fetch(REALITY_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REALITY_DEFENDER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: imageUrl }),
  });
  return await res.json();
}

const imageCheckController = async (req, res) => {
  try {
    if (!req.files || !req.files.images) {
      return res.status(400).json({
        message: "At least one image file is required",
      });
    }

    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    const responseArray = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const uploadResult = await fileUploadToCloudinary(file);

      const scenario = getRandomScenario();

      const newImage = new Image({
        image: uploadResult.secure_url,
        scenario,
      });

      await newImage.save();

      responseArray.push({
        id: i + 1,
        image: newImage.image,
        scenario: newImage.scenario,
      });
    }
    // Clean up temporary files
    files.forEach((file) => {
      fs.unlink(file.tempFilePath, (err) => {
        if (err) {
          console.error("Error deleting temporary file:", err);
        }
      });
    });
    res.status(201).json({
      message: "All images uploaded successfully",
      data: responseArray,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const detectDeepfakeAndStore = async (req, res) => {
  try {
    const image = req.files.image;
    if (!image) {
      return res.status(400).json({
        message: "Image file is required",
      });
    }
    const upload = await fileUploadToCloudinary(
      image,
      "deepfake/detection",
      "image"
    );
    const url = upload.secure_url;
    const hive = await checkImageByUrl(url);

    const verdict = hive.is_deepfake ? "fake" : "real";
    const confidence = hive.confidence;

    const newImage = await Image.create({ image: url, scenario: verdict });
    res.json({
      id: newImage._id,
      image: url,
      scenario: verdict,
      confidence,
      hiveResponse: hive,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { imageCheckController, detectDeepfakeAndStore };
