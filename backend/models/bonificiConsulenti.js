const mongoose = require("mongoose");

const BonificiConsulentiSchema = mongoose.Schema({
  filename: String,
  dateupload: Date,
  note: String,
  cognome: String,
  nome: String,
  codiceFiscale: String,
  identifyUserObj: String
});

module.exports = mongoose.model(
  "BonificiConsulenti",
  BonificiConsulentiSchema,
  "BonificiConsulenti"
);