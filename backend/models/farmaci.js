const mongoose = require("mongoose");

const Farmacichema = mongoose.Schema({
    nome:String,
    descrizione: String,
    formato: String,
    dose: String,
    qty: Number,
    codice_interno: String,
});

module.exports = mongoose.model('Farmaci', Farmacichema, 'farmaci');