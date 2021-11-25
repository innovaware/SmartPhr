const mongoose = require("mongoose");

const DocPazienteSchema = mongoose.Schema({
  paziente: String,
  filename: String,
  dateupload: Date,
  note: String,
  type: String,
  descrizione: String,
  filenameesito: String
});

module.exports = mongoose.model(
  "DocPaziente",
  DocPazienteSchema,
  "docPaziente"
);
