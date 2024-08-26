const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const CucinaGeneraleSchema = mongoose.Schema({

  year: Number,
  day: Number,
  type: Number,
  week: Number,

  dataStartRif: Date,
  dataEndRif: Date,
  dataInsert: Date,

  colazione: String,
  spuntino: String,
  pranzo: String,
  merenda: String,
  cena: String,
});

module.exports = mongoose.model("CucinaGenerale", CucinaGeneraleSchema, "cucinaGenerale");
