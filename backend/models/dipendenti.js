const mongoose = require("mongoose");

const DipendentiSchema = mongoose.Schema({
  cognome: String,
  nome: String,
  email: String,
  user: String,
});

module.exports = mongoose.model('Dipendenti', DipendentiSchema, 'dipendenti');