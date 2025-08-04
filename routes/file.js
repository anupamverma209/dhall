const express = require("express");
const router = express.Router();
const {
  imageCheckController,
  detectDeepfakeAndStore,
} = require("../controllers/imageController");
router.post("/upload", imageCheckController);
router.post("/aiDetection", detectDeepfakeAndStore);

router.get("/images", (req, res) => {
  res.send("this is file.js");
});

module.exports = router;
