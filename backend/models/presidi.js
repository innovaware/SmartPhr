const mongoose = require("mongoose");

const PresidiSchema = mongoose.Schema({
    nome:String,
    descrizione: String,
    note: String,
    taglia: String,
    qty: Number
});

module.exports = mongoose.model('Presidi', PresidiSchema, 'presidi');