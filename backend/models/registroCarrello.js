const mongoose = require("mongoose");

const RegistroCarrelloSchema = mongoose.Schema({
    operator: String,
    operatorName: String,
    paziente: String,
    type: String,
    dataModifica: Date,
    pazienteName: String,
    operation: String,
    carrelloID: String,
    elemento: String,
    carrelloName: String,
    quantita: Number,
    quantitaRes: Number,
});

module.exports = mongoose.model("RegistroCarrello", RegistroCarrelloSchema, "registroCarrello");