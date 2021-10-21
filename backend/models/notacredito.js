const mongoose = require("mongoose");

const NotaCreditoSchema = mongoose.Schema({
  identifyUser: String,
  filename: String,
  dateupload: Date,
  note: String,
});

module.exports = mongoose.model(
  "NotaCredito",
  NotaCreditoSchema,
  "notacredito"
);
