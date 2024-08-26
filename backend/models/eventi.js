const mongoose = require("mongoose");

const EventiSchema = mongoose.Schema({
    data: Date,
    dataCreazione: Date,
  descrizione: String,
  tipo: String,
    utente: String,
    visibile: Boolean,
    finito: Boolean,
    dataCompletato: Date,
});

module.exports = mongoose.model('Eventi', EventiSchema, 'eventi');