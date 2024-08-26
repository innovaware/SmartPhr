const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const RegistroSanificazioneSchema = mongoose.Schema({
  cameraId: ObjectId,
  stato: Boolean,
  data: Date,
  note: String,
  operatore: ObjectId,
  firma: String
});

module.exports = mongoose.model("RegistroSanificazione", RegistroSanificazioneSchema, "registroSanificazione");
