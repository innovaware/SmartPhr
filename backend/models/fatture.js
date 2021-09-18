const mongoose = require("mongoose");

const FattureSchema = mongoose.Schema({
  paziente: String,
});

module.exports = mongoose.model(
  "Fatture",
  FattureSchema,
  "fatture"
);
