const mongoose = require("mongoose");

const DipendentiSchema = mongoose.Schema({
  cognome: String,
  nome: String,
  cf: String,
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
  idUser: mongoose.Types.ObjectId,
  accettatoRegolamento : Boolean
});

module.exports = mongoose.model('Dipendenti', DipendentiSchema, 'dipendenti');