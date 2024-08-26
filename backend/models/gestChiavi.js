const mongoose = require("mongoose");

const GestChiaviSchema = mongoose.Schema({
  operatorPrelievo: String,
  operatorPrelievoName: String,
  operatorRiconsegna: String,
  operatorRiconsegnaName: String,
  dataPrelievo: Date,
  dataRiconsegna: Date,
  chiave: Number
});

module.exports = mongoose.model("GestChiavi", GestChiaviSchema, "gestChiavi");
