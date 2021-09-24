const mongoose = require("mongoose");

const SmartDocumentSchema = mongoose.Schema({
  file: String,
  typeDocument: String,
  note: String,
  path: String,
  name: String,
  user: String,
  dateupload: Date,
});

module.exports = mongoose.model(
  "SmartDocument",
  SmartDocumentSchema,
  "smartDocument"
);
