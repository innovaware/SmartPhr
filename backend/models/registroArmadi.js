const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const RegistroArmadiSchema = mongoose.Schema({
    idCamera: ObjectId,
    stato: Boolean,
    paziente: ObjectId,
  data: Date,
  note: String,
  firma: String
});

module.exports = mongoose.model("RegistroArmadi", RegistroArmadiSchema, "registroArmadi");
