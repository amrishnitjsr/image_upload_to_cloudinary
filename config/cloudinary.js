const cloudinary = require("cloudinary").v2;
require("dotenv").config();

exports.cloudinaryConnect = () => {
  try {
    if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
      throw new Error("❌ Cloudinary environment variables missing");
    }

    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    console.log("✅ Cloudinary connected");
  } catch (error) {
    console.error("❌ Cloudinary connection failed:", error.message);
    process.exit(1); // Stop server if Cloudinary fails to configure
  }
};

// Export cloudinary itself too if needed
exports.cloudinary = cloudinary;
