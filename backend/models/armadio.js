const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const ArmadioSchema = mongoose.Schema({
    idCamera: ObjectId,
    indumento: {
        idPaziente: ObjectId,
        nome: String,
        quantita: Number,
        note: String,
      },
  
      lastChecked: {
        idUser: ObjectId,
        data: Date,
      }
  
});

module.exports = mongoose.model("Armadio", ArmadioSchema, "armadio");
