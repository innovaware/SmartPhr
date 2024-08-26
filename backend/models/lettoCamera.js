const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const LettoCameraSchema = mongoose.Schema({
    tipo: String,
    carico: Number,
    scarico: Number,
    giacenza: Number,
    laceratiNum: Number,
    dataUltimaModifica: Date,
    firma: String,
    isInternal: Boolean,
    operatore: ObjectId,
});
 
module.exports = mongoose.model("LettoCamera", LettoCameraSchema, "lettoCamera");
