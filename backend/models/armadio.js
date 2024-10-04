const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const indumenti = require("./indumenti");

const ArmadioSchema = mongoose.Schema({
    idCamera: ObjectId,
    pazienteId: ObjectId,
    contenuto: [{
        type: mongoose.Schema.Types.Mixed,
        ref: 'indumenti'
    }],
    lastChecked: {
        _id: String,
      idUser: String,
      datacheck: Date,
    },
    verified: Boolean,
    stagionale: Boolean,
    rateVerifica: Number,
    cancellato: Boolean,
    DataEliminazione: Date,
    dateStartRif: Date,
    dateEndRif: Date
  
});

module.exports = mongoose.model("Armadio", ArmadioSchema, "armadio");
