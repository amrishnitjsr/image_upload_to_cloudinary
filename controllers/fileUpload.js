// controllers/fileUpload.js
const path = require("path");
const fs = require("fs");
const File = require("../models/File");
const { cloudinary } = require("../config/cloudinary");
const sendMail = require("../utils/sendEmail");

exports.localFileUpload = async (req, res) => {
  try {
    const file = req.files?.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const uploadPath = path.join(__dirname, "..", "uploads");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(uploadPath, fileName);

    file.mv(filePath, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "File move failed", error: err });
      }
      res.status(200).json({ success: true, message: "Local file uploaded", filePath: `/uploads/${fileName}` });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.imageUpload = async (req, res) => {
  try {
    const file = req.files?.image;
    const { name, tags, email } = req.body;

    if (!file || !name || !email) {
      return res.status(400).json({ success: false, message: "Image, name, and email are required" });
    }

    // Save temporarily
    const tempDir = path.join(__dirname, "..", "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempPath = path.join(tempDir, `${Date.now()}_${file.name}`);
    await file.mv(tempPath);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempPath, {
      folder: "fileupload",
    });

    // Delete temp file
    fs.unlinkSync(tempPath);

    // Save record to DB
    const newFile = await File.create({
      name: name.trim(),
      tags: tags?.trim() || "",
      email: email.trim(),
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    console.log("Metadata saved to DB:", newFile);

    // Send email
    await sendMail(
      email,
      "Your image has been uploaded",
      `Hi ${name},\n\nYour image has been successfully uploaded.\n\nImage Link: ${result.secure_url}`
    );

    res.status(200).json({
      success: true,
      message: "File uploaded, saved and email sent",
      file: newFile,
    });

  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};
