const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const CucinaDocumentiSchema = mongoose.Schema({
  filename: String,
  dateupload: Date,
  type: String,
  typeDocument: String,
  note: String,
  cancellato: Boolean,
  dataCancellazione: Date,
});

module.exports = mongoose.model("CucinaDocumenti", CucinaDocumentiSchema, "cucinaDocumenti");
