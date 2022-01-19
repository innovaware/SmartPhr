const mongoose = require("mongoose");

const DiarioEducativoSchema = mongoose.Schema({
    data: Date,
    contenuto: String,
    terapia: String,
    user: String
});

module.exports = mongoose.model(
  "DiarioEducativo",
  DiarioEducativoSchema,
  "diarioEducativo"
);
