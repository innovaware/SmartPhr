const mongoose = require("mongoose");

const AttivitaSchema = mongoose.Schema({
    operator: String,
    operatorName: String,
    paziente: String,
    pazienteName: String,
    data: Date,
    turno: String,
    //description: String,
    note: String,
    //completato: Boolean,

    letto: Boolean,
    diuresi: Boolean,
    evacuazione: Boolean,
    igiene: Boolean,
    doccia: Boolean,
    barba: Boolean,
    tagliocapelli: Boolean,
    tagliounghie: Boolean,
    lenzuola: Boolean
});

module.exports = mongoose.model("Attivita", AttivitaSchema, "attivitaPerOspiti");
