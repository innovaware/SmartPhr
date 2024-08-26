const mongoose = require("mongoose");

const NominaDipendenteSchema = mongoose.Schema({
    dipendenteID: mongoose.Types.ObjectId,
    nomina: String,
    dataNomina: Date,
    nominato: Boolean,
    attestato: Boolean,
});

module.exports = mongoose.model('NominaDipendente', NominaDipendenteSchema, 'nominaDipendente');