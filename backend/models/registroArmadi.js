const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const RegistroArmadiSchema = mongoose.Schema({
  cameraId: ObjectId,
  stato: Number,
  data: Date,
  note: String,
  firma: ObjectId
});

module.exports = mongoose.model("RegistroArmadi", RegistroArmadiSchema, "registroArmadi");
