const mongoose = require("mongoose");

const TurniMensiliSchema = mongoose.Schema({
  cognome: String,
  nome: String,
  cf: String,
  mansione: String,
  data: Date,
  turno: String
});

module.exports = mongoose.model("TurniMensili", TurniMensiliSchema, "turnimensili");
