const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const PuliziaAmbienteSchema = mongoose.Schema({
  idCamera: String,
  idUser: String,
  data: Date,
  descrizione: String,
  statoPulizia: Number
});

module.exports = mongoose.model("PuliziaAmbiente", PuliziaAmbienteSchema, "puliziaAmbiente");
