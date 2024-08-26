const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const CameraSchema = mongoose.Schema({
    camera: String,
    piano: String,
    geometry: String,
    forPatient: Boolean,
    order: Number,
    numPostiLiberi: Number,
    numPostiOccupati: Number,
    numMaxPosti: Number,
    operatore: ObjectId,
    sanificata: Boolean,
    dataSanificazione: Date,
    firmaSanificazione: String,

    armadioCheck: Number,
    dataArmadioCheck: Date,
    firmaArmadio: String,

    statoPulizia: Number,
    trappola: Boolean,
    verificaDerattificazione: Boolean,
});

module.exports = mongoose.model("Camera", CameraSchema, "camera");
