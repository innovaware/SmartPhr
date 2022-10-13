const mongoose = require("mongoose");

const PresidiSchema = mongoose.Schema({
    nome:String,
    rif_id: String,
    descrizione: String,
    note: String,
    taglia: String,
    qty: Number,
    qtyTot: Number,
    giacenza: Number,
    paziente: String,
    pazienteName: String,
});

module.exports = mongoose.model('Presidi', PresidiSchema, 'presidi');