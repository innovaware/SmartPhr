const mongoose = require("mongoose");

const PresenzeSchema = mongoose.Schema({
  data: Date,
  turno: String,
  user: mongoose.Types.ObjectId
});

module.exports = mongoose.model("Presenze", PresenzeSchema, "presenze");
