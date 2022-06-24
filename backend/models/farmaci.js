const mongoose = require("mongoose");

const Farmacichema = mongoose.Schema({
    nome:String,
    descrizione: String,
    formulazione: String,
    lotto: String,
    scadenza: Date,
    classe: String,
    formato: String,
    dose: String,
    qty: Number,
    giacenza: Number,
    note:String,
    codice_interno: String,
});

module.exports = mongoose.model('Farmaci', Farmacichema, 'farmaci');