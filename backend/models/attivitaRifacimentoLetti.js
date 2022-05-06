const mongoose = require("mongoose");

const AttivitaRifacimentoLettiSchema = mongoose.Schema({

    camera: String,
    carico_lenzuola: Number,
    carico_lenzuola_lacerati: Number,
    carico_traverse: Number,
    carico_traverse_lacerati: Number,
    carico_cuscini: Number,
    carico_cuscini_lacerati: Number,
    carico_coprimaterassi: Number,
    carico_coprimaterassi_lacerati: Number,
    carico_copriletti: Number,
    carico_copriletti_lacerati: Number,
    carico_coperte: Number,
    carico_coperte_lacerati: Number,
    carico_federe: Number,
    carico_federe_lacerati: Number,
    isInternal:Boolean,
    operator: String,
    operatorName: String,
    data: Date


});

module.exports = mongoose.model("AttivitaRifacimentoLetti", AttivitaRifacimentoLettiSchema, "attivitaRifacimentoLetti");
