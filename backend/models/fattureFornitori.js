const mongoose = require("mongoose");

const FattureFornitoriSchema = mongoose.Schema({
  filename: String,
  dateupload: Date,
  note: String,
  cognome: String,
  nome: String,
  codiceFiscale: String,
  identifyUserObj: String
});

module.exports = mongoose.model(
  "FattureFornitori",
  FattureFornitoriSchema,
  "FattureFornitori"
);