const mongoose = require("mongoose");

const ElementiArmadioSchema = mongoose.Schema({
    paziente: String,
    pazienteName: String,
    data: Date,
    elemento: String,
    note: String,
    quantita: Number
});

module.exports = mongoose.model("ElementiArmadio", ElementiArmadioSchema, "elementiArmadio");
