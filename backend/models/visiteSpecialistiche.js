const mongoose = require("mongoose");

const VisiteSpecialisticheSchema = mongoose.Schema({
  dataReq: Date,
  dataEsec: Date,
  contenuto: String,
  user: String
});

module.exports = mongoose.model(
  "VisiteSpecialistiche",
  VisiteSpecialisticheSchema,
  "visiteSpecialistiche"
);
