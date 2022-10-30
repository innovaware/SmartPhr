const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const MagazzinoSchema = mongoose.Schema({
  dateInsert: Date,
  idUser: String,
  nome: String,
  descrizione: String,
  area: String,
  quantita: Number,
  giacenza: String,
  conformi: String,
  inuso: Boolean
});

module.exports = mongoose.model("Magazzino", MagazzinoSchema, "magazzino");
