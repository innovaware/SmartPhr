const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const segnalazioneSchema = mongoose.Schema({
    utenteNome: String,
    utente: ObjectId,
    numTicket: Number,
    segnalato: Boolean,
    status: String,
    descrizione: String,
    presoincarico: Boolean,
    risolto: Boolean,
    dataSegnalazione: Date,
    datapresaincarico: Date,
    datarisoluzione: Date,
});

module.exports = mongoose.model("Segnalazione", segnalazioneSchema, "segnalazione");
