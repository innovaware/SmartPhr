const mongoose = require("mongoose");

const CambiTurnoSchema = mongoose.Schema({
  cognome: String,
  nome: String,
  cf: String,
  dataInizioVT: Date,
  dataFineVT: Date,
  dataInizioNT: Date,
  dataFineNT: Date,
  motivazione: String,
  dataRichiesta: Date,
  accettata: Boolean
});

module.exports = mongoose.model("CambiTurno", CambiTurnoSchema, "cambiturno");
