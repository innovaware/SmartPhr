const mongoose = require("mongoose");

const CameraSchema = mongoose.Schema({
  camera: String,
  piano: String,
  geometry: String,
  forPatient: Boolean,
  order: Number,
  numPostiLiberi: Number,
  numMaxPosti: Number,
});

module.exports = mongoose.model("Camera", CameraSchema, "camera");
