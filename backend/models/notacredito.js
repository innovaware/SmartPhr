const mongoose = require("mongoose");

const NotaCreditoSchema = mongoose.Schema({
  paziente: String,
  filename: String,
  dateupload: Date,
  note: String,
});

module.exports = mongoose.model(
  "NotaCredito",
  NotaCreditoSchema,
  "notacredito"
);
