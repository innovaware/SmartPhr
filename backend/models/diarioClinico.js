const mongoose = require("mongoose");

const DiarioClinicoSchema = mongoose.Schema({
    data: Date,
    contenuto: String,
    terapia: String,
    user: String
});

module.exports = mongoose.model(
  "DiarioClinico",
  DiarioClinicoSchema,
  "diarioClinico"
);
