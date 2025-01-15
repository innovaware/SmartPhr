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
    cancellato: Boolean,
    DataCancellazione: Date,
});

module.exports = mongoose.model('Eventi', EventiSchema, 'eventi');