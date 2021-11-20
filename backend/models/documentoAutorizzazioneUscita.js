const mongoose = require("mongoose");

const DocumentoAutorizzazioneUscita = mongoose.Schema({
  idPaziente: String,
  filename: String,
  dateupload: Date,
  note: String,
  type: String,
});

module.exports = mongoose.model(
  "documentoAutorizzazioneUscita",
  DocumentoAutorizzazioneUscita,
  "documentoAutorizzazioneUscita"
);
