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
    quantitaDisponibile: Number,
    quantitaOccupata: Number,
    giacenza: Number,
    note: String,
    cestino: Boolean,
    codice_interno: String,
});

module.exports = mongoose.model('Farmaci', FarmaciSchema, 'farmaci');