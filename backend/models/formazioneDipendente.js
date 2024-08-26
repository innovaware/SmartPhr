const mongoose = require("mongoose");

const FormazioneDipendenteSchema = mongoose.Schema({
    dipendenteID: mongoose.Types.ObjectId,
    esito: String,
    dataCorso: Date,
    attestato: Boolean,
});

module.exports = mongoose.model('FormazioneDipendente', FormazioneDipendenteSchema, 'formazioneDipendente');