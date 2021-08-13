const mongoose = require("mongoose");

const DipendentiSchema = mongoose.Schema({
  cognome: String,
  nome: String,
  email: String,
  group: String,
  user: String,
});

module.exports = mongoose.model('Dipendenti', DipendentiSchema, 'dipendenti');