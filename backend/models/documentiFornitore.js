const mongoose = require("mongoose");

const DocumentiFornitoreSchema = mongoose.Schema({
  fornitore: String,
  filename: String,
  dateupload: Date,
  note: String,
});

module.exports = mongoose.model(
  "DocumentiFornitore",
  DocumentiFornitoreSchema,
  "DocumentiFornitore"
);
