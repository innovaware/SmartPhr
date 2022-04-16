const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const CameraSchema = mongoose.Schema({
  camera: String,
  piano: String,
  geometry: String,
  forPatient: Boolean,
  order: Number,
  numPostiLiberi: Number,
  numMaxPosti: Number,

  sanificata: Boolean,
  dataSanificazione: Date,
  firmaSanificazione: ObjectId,

  armadioCheck: Boolean,
  dataArmadioCheck: Date,
  firmaArmadio: ObjectId,

});

module.exports = mongoose.model("Camera", CameraSchema, "camera");
