const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const IndumentiIngressoSchema = mongoose.Schema({
    indumento: ObjectId,
    nome: String,
    quantita: Number,
    note: String,
    conforme: Boolean,
    richiesto: Boolean,
    noninelenco: Boolean,
    dataCaricamento: Date,
    operatore: ObjectId,
    nomeOperatore: String,
    paziente: ObjectId,
    nomePaziente:String,
});

module.exports = mongoose.model("IndumentiIngresso", IndumentiIngressoSchema, "indumentiIngresso");
