const mongoose = require("mongoose");

const FornitoriSchema = mongoose.Schema({
  cognome: String,
  nome: String,
  codiceFiscale: String,
  dataNascita: Date,
  comuneNascita: String,
  provinciaNascita: String,
  indirizzoNascita: String,
  indirizzoResidenza: String,
  comuneResidenza: String,
  provinciaResidenza: String,
  mansione: String,
  tipoContratto: String,
  telefono: String,
  email: String
});

module.exports = mongoose.model('Fornitori', FornitoriSchema, 'fornitori');