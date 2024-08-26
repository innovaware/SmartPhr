const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const CucinaSchema = mongoose.Schema({
  /**
   * Identificativo del paziente
   */
  idPaziente: String, 

  /**
   * Data utilizzo
   */
  data: Date,

  descrizione: String,

  menuColazione: String,
  menuPranzo: String,
  menuCena: String,
});

module.exports = mongoose.model("Cucina", CucinaSchema, "cucina");
