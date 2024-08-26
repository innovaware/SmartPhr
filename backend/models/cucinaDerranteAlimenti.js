const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const CucinaDerranteAlimentiSchema = mongoose.Schema({

  nome: String,
  /**
   * Data di inserimento 
   */
  dateInsert: Date,

  /**
   * Note 
   */
  note: String,
  quantita: Number,
  unita: String,
  
  idUser: String,
  conforme: Boolean, 
  nonConsumato: Boolean,

  dateScadenza: Date,
});

module.exports = mongoose.model("CucinaDerranteAlimenti", CucinaDerranteAlimentiSchema, "cucinaDerranteAlimenti");
