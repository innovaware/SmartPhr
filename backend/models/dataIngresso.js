const mongoose = require("mongoose");

const DataIngressoSchema = mongoose.Schema({
    sanificazione: Boolean,
    sistemazione_letto : Boolean,
    armadio: String,
    trattamento_igienico : Boolean,
    paziente: String,
    user: String
});

module.exports = mongoose.model(
  "DataIngresso",
  DataIngressoSchema,
  "dataIngresso"
);
