const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 4000;
const fileRoutes = require("./routes/file");
const connectDB = require("./config/database");
const cloudinaryStorage = require("./config/cloudinary");
const fileupload = require("express-fileupload");
const fetch = require("node-fetch");
app.use(cors());
app.use(express.json());

cloudinaryStorage();
connectDB();

app.use(fileupload({ useTempFiles: true }));
app.use("/api/v1", fileRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/test-rd", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.realitydefender.com/v1/image/check",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REALITY_DEFENDER_API_KEY}`,
        },
        body: JSON.stringify({
          image_url:
            "https://res.cloudinary.com/dnykejpyx/image/upload/v1754323007/deepfake/detection/ompk56i0llq9fdmszwai.jpg",
        }),
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
