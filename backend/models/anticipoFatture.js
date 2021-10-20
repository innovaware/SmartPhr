const mongoose = require("mongoose");

const AnticipoFattureSchema = mongoose.Schema({
  identifyUser: String,
  filename: String,
  dateupload: Date,
  note: String,
});

module.exports = mongoose.model(
  "AnticipoFatture",
  AnticipoFattureSchema,
  "anticipoFatture"
);
