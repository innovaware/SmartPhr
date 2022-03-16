const mongoose = require("mongoose");

const FattureConsulentiSchema = mongoose.Schema({
  filename: String,
  dateupload: Date,
  note: String,
  cognome: String,
  nome: String,
  codiceFiscale: String,
  identifyUserObj: String
});

module.exports = mongoose.model(
  "FattureConsulenti",
  FattureConsulentiSchema,
  "fattureConsulenti"
);