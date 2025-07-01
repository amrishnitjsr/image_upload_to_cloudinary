// Create express app
const express = require("express");
const app = express();
const path = require("path");

// Load environment variables
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
const fileUpload = require("express-fileupload");
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "public"))); // To serve static files if needed

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// DB connection
const db = require("./config/database");
db.connect(); // Make sure ./config/database.js exports a function named connect()

// Cloudinary connection
const { cloudinaryConnect } = require("./config/cloudinary");
cloudinaryConnect(); // Make sure it exports cloudinaryConnect()

// Routes
const uploadRoutes = require("./routes/FileUpload");
app.use("/api/v1/upload", uploadRoutes);

// Render index.ejs on root route
app.get("/", (req, res) => {
  res.render("index");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
