const mongoose = require("mongoose");

const ConsulentiSchema = mongoose.Schema({
  cognome: String,
  nome: String,
  email: String,
  group: String,
  user: String,
});

module.exports = mongoose.model('Consulenti', ConsulentiSchema, 'consulenti');