const mongoose = require("mongoose");

const DiarioAssSocialeSchema = mongoose.Schema({
    data: Date,
    contenuto: String,
    firma: String,
    user: String
});

module.exports = mongoose.model(
  "DiarioAssSociale",
  DiarioAssSocialeSchema,
  "diarioAssSociale"
);
