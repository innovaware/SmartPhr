const mongoose = require("mongoose");

const PazienteSchema = mongoose.Schema({
  cognome: String,
  nome: String,
  sesso: String,
  luogoNascita: String,
  dataNascita: Date,
  indirizzoResidenza: String,
  comuneResidenza: String,
  provinciaResidenza: String,
  statoCivile: String,
  figli: Number,
  scolarita: String,
  situazioneLavorativa: String,
  personeRiferimento: String,
  telefono: String,
  dataIngresso: Date,
  indirizzoNascita: String,
  comuneNascita: String,
  provinciaNascita: String,
  cancellato: Boolean,
  dataCancellazione: Date,
});

module.exports = mongoose.model("Pazienti", PazienteSchema, "pazienti");
