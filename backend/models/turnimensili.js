const mongoose = require("mongoose");

const TurniMensiliSchema = mongoose.Schema({
  dataRifInizio: Date,
  dataRifFine: Date,
  turnoInizio: Number,
  turnoFine: Number,
    user: mongoose.Types.ObjectId,
    mansione: String,
    utente: String,
    tipoTurno: String,
});

module.exports = mongoose.model("TurniMensili", TurniMensiliSchema, "turnimensili");
