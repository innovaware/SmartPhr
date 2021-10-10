const mongoose = require("mongoose");

const ContrattoSchema = mongoose.Schema({
  idConsulente: String,
  filename: String,
  dateupload: Date,
  note: String,
});

module.exports = mongoose.model('Contratto', ContrattoSchema, 'contratto');