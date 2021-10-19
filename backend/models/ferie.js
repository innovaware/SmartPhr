const mongoose = require("mongoose");

const FerieSchema = mongoose.Schema({
  cognome: String,
  nome: String,
  cf: String,
  dataInizio: Date,
  dataFine: Date,
  dataRichiesta: Date,
  accettata: Boolean,
  user:String,
  closed: Boolean
});

module.exports = mongoose.model("Ferie", FerieSchema, "ferie");
