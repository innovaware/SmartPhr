const mongoose = require("mongoose");

const PresenzeSchema = mongoose.Schema({
  cognome: String,
  nome: String,
  cf: String,
  mansione: String,
  data: Date,
  turno: String
});

module.exports = mongoose.model("Presenze", PresenzeSchema, "presenze");
