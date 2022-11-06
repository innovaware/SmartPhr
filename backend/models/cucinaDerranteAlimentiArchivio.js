const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const CucinaDerranteAlimentiArchivioSchema = mongoose.Schema({

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
  operazione: String,
  dataOperazione: Date,
  idDerranteAlimenti: String,
  conforme: Boolean, 
  nonConsumato: Boolean,
  dateScadenza: Date,
});

module.exports = mongoose.model("CucinaDerranteAlimentiArchivio", CucinaDerranteAlimentiArchivioSchema, "cucinaDerranteAlimentiArchvio");
