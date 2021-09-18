const mongoose = require("mongoose");

const FattureSchema = mongoose.Schema({
  paziente: String,
  filename: String,
  dateupload: Date,
});

module.exports = mongoose.model(
  "Fatture",
  FattureSchema,
  "fatture"
);
