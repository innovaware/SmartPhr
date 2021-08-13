const mongoose = require("mongoose");

const FornitoriSchema = mongoose.Schema({
  cognome: String,
  nome: String,
  email: String,
  group: String,
  user: String,
});

module.exports = mongoose.model('Fornitori', FornitoriSchema, 'fornitori');