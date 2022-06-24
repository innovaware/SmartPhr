const mongoose = require("mongoose");

const DocFarmaciSchema = mongoose.Schema({
  paziente: String,
  paziente_id: String,
  filename: String,
  dateupload: Date,
  note: String,
  type: String,
  descrizione: String,
  operator_id: String,
  operator: String,
  cancellato: Boolean,
  dataCancellazione: Date,
});

module.exports = mongoose.model(
  "DocFarmaci",
  DocFarmaciSchema,
  "docFarmaci"
);
