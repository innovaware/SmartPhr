const mongoose = require("mongoose");

const CameraSchema = mongoose.Schema({
  camera: String,
  piano: Number,
});

module.exports = mongoose.model("Camera", CameraSchema, "camera");
