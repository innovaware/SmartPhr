const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const IndumentiSchema = mongoose.Schema({
    nome: String,
    quantita: Number,
    note: String,
    carico: Number,
    scarico: Number,
    dataCaricamento: Date,
    lastChecked: {
        UserName: String,
        datacheck: Date,
    },
  dateStartRif: Date,
  dateEndRif: Date,
});

module.exports = mongoose.model("Indumenti", IndumentiSchema, "indumenti");
