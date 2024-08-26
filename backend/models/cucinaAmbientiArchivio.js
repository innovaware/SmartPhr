const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const CucinaAmbientiArchivioSchema = mongoose.Schema({


  nome: String,

  /**
   * Data ultima sanificazione ordinaria 
   */
  dateSanficazioneOrdinaria: Date,

  /**
   * Data della sanificazione Straordinaria
   */
  dateSanficazioneStraordinaria: Date,

  /**
   * Id user che ha eseguito la sanificazione
   */
  idUser: String

});

module.exports = mongoose.model("CucinaAmbientiArchivio", CucinaAmbientiArchivioSchema, "cucinaAmbientiArchivio");
