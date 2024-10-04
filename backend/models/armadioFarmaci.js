const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const farmaci = require("./farmaci");
const presidi = require("./presidi");

const armadioFarmaciSchema = mongoose.Schema({
    pazienteId: ObjectId,
    farmaci: [{
        farmacoID: String,
        nome: String,
        quantita: String,
        dataScadenza: Date,
        note: String,
    }
    ],
    presidi: [{
        presidioID: String,
        nome: String,
        quantita: String,
        dataScadenza: Date,
        note: String,
    }],
    lastChecked: {
        idUser: String,
        datacheck: Date,
    },
    cancellato: Boolean,
    DataEliminazione: Date,
    dataCreazione: Date,

});

module.exports = mongoose.model("ArmadioFarmaci", armadioFarmaciSchema, "armadioFarmaci");
