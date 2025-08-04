const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 4000;
const fileRoutes = require("./routes/file");
const connectDB = require("./config/database");
const cloudinaryStorage = require("./config/cloudinary");
const fileupload = require("express-fileupload");
app.use(cors());
app.use(express.json());

cloudinaryStorage();
connectDB();

app.use(fileupload({ useTempFiles: true }));
app.use("/api/v1", fileRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
