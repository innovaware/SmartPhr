const mongoose = require("mongoose");

const IndumentiSchema = mongoose.Schema({
  nome: String,
  dateStartRif: Date,
  dateEndRif: Date,
});

module.exports = mongoose.model("Indumenti", IndumentiSchema, "indumenti");
