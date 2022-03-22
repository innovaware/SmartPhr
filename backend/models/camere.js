const mongoose = require("mongoose");

const CameraSchema = mongoose.Schema({
  camera: String,
  piano: String,
  geometry: String,
});

module.exports = mongoose.model("Camera", CameraSchema, "camera");
