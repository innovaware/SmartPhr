const mongoose = require("mongoose");

const DocMedicinaLavoroSchema = mongoose.Schema({
  dipendente: String,
  filenameRichiesta: String,
  dateuploadRichiesta: Date,
  noteRichiesta: String,
  filenameCertificato: String,
  dateuploadCertificato: Date,
  noteCertificato: String
});

module.exports = mongoose.model(
  "DocMedicinaLavoro",
  DocMedicinaLavoroSchema,
  "docMedicinaLavoro"
);
