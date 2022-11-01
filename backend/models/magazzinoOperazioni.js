const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const MagazzinoOperazioniSchema = mongoose.Schema({
  dateInsert: Date,
  idUser: String,
  tipologiaOperazione: String,
  idMagazzino: String,
  old: Object 

});

module.exports = mongoose.model("MagazzinoOperazioni", MagazzinoOperazioniSchema, "magazzinoOperazioni");
