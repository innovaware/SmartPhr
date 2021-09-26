const mongoose = require("mongoose");

const DipendentiSchema = mongoose.Schema({
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
  titoloStudio: String,
  mansione: String,
  tipoContratto: String,
  telefono: String,
  email: String,
  idUser: String,
});

module.exports = mongoose.model('Dipendenti', DipendentiSchema, 'dipendenti');