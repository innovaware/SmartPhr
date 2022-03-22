const mongoose = require("mongoose");

const AttivitaArmadioSchema = mongoose.Schema({
    operator: String,
    operatorName: String,
    paziente: String,
    pazienteName: String,
    data: Date,
    elemento: String,
    note: String,
    quantita: Number
});

module.exports = mongoose.model("AttivitaArmadio",AttivitaArmadioSchema, "attivitaArmadio");
