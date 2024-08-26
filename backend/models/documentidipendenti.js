const mongoose = require("mongoose");

const DocDipendenteSchema = mongoose.Schema({
  dipendente: String,
  filename: String,
  dateupload: Date,
  dataScadenza: Date,
  note: String,
  type: String,
  descrizione: String,
  filenameesito: String,
    closed: Boolean,
    accettata: Boolean,
});

module.exports = mongoose.model(
  "DocDipendente",
  DocDipendenteSchema,
  "docDipendente"
);
