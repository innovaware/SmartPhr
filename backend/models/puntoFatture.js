const mongoose = require("mongoose");

const PuntoFattureSchema = mongoose.Schema({
  identifyUser: String,
  filename: String,
  dateupload: Date,
  note: String,
});

module.exports = mongoose.model(
  "PuntoFatture",
  PuntoFattureSchema,
  "puntoFatture"
);
