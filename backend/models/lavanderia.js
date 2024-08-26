const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const LavanderiaSchema = mongoose.Schema({
  /**
   * Identificativo del paziente
   */
  idDipendente: String, 

  /**
   * Data utilizzo
   */
  data: Date,


  descrizione: String,

  /**
   * Tipologia di strumento
   * 
   * 0: Asciugatrice; 1: Lavatrice
   */
  tipologia: Number,

  /**
   * Descrizione della Tipologia di strumento
   *
   * Valori possibili: 
   * - Asciugatrice; 
   * - Lavatrice
   */
  descrizioneTipologia: String
});

module.exports = mongoose.model("Lavanderia", LavanderiaSchema, "lavanderia");
