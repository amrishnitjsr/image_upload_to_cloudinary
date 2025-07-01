const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    default: "",
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  }
}, {
  timestamps: true // adds createdAt and updatedAt fields automatically
});

const File = mongoose.model("File", fileSchema);
module.exports = File;
