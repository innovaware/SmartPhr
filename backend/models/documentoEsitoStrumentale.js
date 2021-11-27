const mongoose = require("mongoose");

const DocumentoEsitoStrumentale = mongoose.Schema({
  idPaziente: String,
  filename: String,
  dateupload: Date,
  note: String,
  type: String,
  cancellato: Boolean,
  dataCancellazione: Date,
});

module.exports = mongoose.model(
  "documentoEsitoStrumentale",
  DocumentoEsitoStrumentale,
  "documentoEsitoStrumentale"
);
