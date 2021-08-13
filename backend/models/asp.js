const mongoose = require("mongoose");

const ASPSchema = mongoose.Schema({
  cognome: String,
  nome: String,
  email: String,
  group: String,
  user: String,
});

module.exports = mongoose.model('ASP', ASPSchema, 'asp');