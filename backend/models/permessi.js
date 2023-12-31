const mongoose = require("mongoose");

const PermessiSchema = mongoose.Schema({
  cognome: String,
  nome: String,
  cf: String,
  dataInizio: Date,
  dataFine: Date,
  dataRichiesta: Date,
  accettata: Boolean,
  user: String,
  closed: Boolean
});

module.exports = mongoose.model("Permessi", PermessiSchema, "permessi");
