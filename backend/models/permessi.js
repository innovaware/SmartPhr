const mongoose = require("mongoose");

const PermessiSchema = mongoose.Schema({
    cognome: String,
    nome: String,
    cf: String,
    dataPermesso: Date,
    oraInizio: String,
    oraFine: String,
    dataRichiesta: Date,
    accettata: Boolean,
    user: String,
    closed: Boolean,
    cancellato: Boolean,
    dataCancellazione: Date
});

module.exports = mongoose.model("Permessi", PermessiSchema, "permessi");
