const mongoose = require("mongoose");

const FarmaciSchema = mongoose.Schema({
    nome:String,
    rif_id: String,
    descrizione: String,
    formulazione: String,
    lotto: String,
    scadenza: Date,
    classe: String,
    formato: String,
    dose: String,
    qty: Number, 
    qtyTot: Number,
    giacenza: Number,
    note:String,
    codice_interno: String,
    paziente: String,
    pazienteName: String,
});

module.exports = mongoose.model('Farmaci', FarmaciSchema, 'farmaci');