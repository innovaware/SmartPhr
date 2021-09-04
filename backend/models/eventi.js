const mongoose = require("mongoose");

const EventiSchema = mongoose.Schema({
  data: Date,
  descrizione: String,
  tipo: String,
  utente: String
});

module.exports = mongoose.model('Eventi', EventiSchema, 'eventi');