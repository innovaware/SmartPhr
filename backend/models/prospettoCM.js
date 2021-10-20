const mongoose = require("mongoose");

const ProspettoCMSchema = mongoose.Schema({
  identifyUser: String,
  filename: String,
  dateupload: Date,
  note: String,
});

module.exports = mongoose.model(
  "ProspettoCM",
  ProspettoCMSchema,
  "prospettoCM"
);
