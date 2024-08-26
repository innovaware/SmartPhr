const mongoose = require("mongoose");

const FerieSchema = mongoose.Schema({
    cognome: String,
    nome: String,
    cf: String,
    dataInizio: Date,
    dataFine: Date,
    dataRichiesta: Date,
    accettata: Boolean,
    user: String,
    closed: Boolean,
    cancellato: Boolean,
    dataCancellazione: Date
});

module.exports = mongoose.model("Ferie", FerieSchema, "ferie");
