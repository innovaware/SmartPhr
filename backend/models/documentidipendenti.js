const mongoose = require("mongoose");

const DocDipendenteSchema = mongoose.Schema({
  dipendente: String,
  filename: String,
  dateupload: Date,
  note: String,
  type: String,
});

module.exports = mongoose.model(
  "DocDipendente",
  DocDipendenteSchema,
  "docDipendente"
);
