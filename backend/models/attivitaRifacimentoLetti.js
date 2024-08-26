const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const AttivitaRifacimentoLettiSchema = mongoose.Schema({

    tipo: String,
    carico: Number,
    scarico: Number,
    laceratiNum: Number,
    dataUltimaModifica: Date,
    firma: String,
    isInternal: Boolean,
    operatore: ObjectId,
    turno: String,
});

module.exports = mongoose.model("AttivitaRifacimentoLetti", AttivitaRifacimentoLettiSchema, "attivitaRifacimentoLetti");
