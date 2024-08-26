const mongoose = require("mongoose");
const { ObjectId } = require("bson");

const RichiestePresidiSchema = mongoose.Schema({
    materiale: String,
    type: String,
    dataRichiesta: Date,
    dataAcquisto: Date,
    dataConsegna: Date,
    status: String,
    dataAnnullamento: Date,
    dipendente: ObjectId,
    quantita: Number,
    dipendenteName: String,
    note: String,
});

module.exports = mongoose.model('RichiestePresidi', RichiestePresidiSchema, 'richiestePresidi');