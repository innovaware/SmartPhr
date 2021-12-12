const mongoose = require("mongoose");

const DocPazienteSchema = mongoose.Schema({
  paziente: String,
  filename: String,
  dateupload: Date,
  note: String,
  type: String,
  typeDocument: String,
  descrizione: String,
  filenameesito: String,
  cancellato: Boolean,
  dataCancellazione: Date,
});

module.exports = mongoose.model(
  "DocPaziente",
  DocPazienteSchema,
  "docPaziente"
);
