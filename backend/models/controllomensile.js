const mongoose = require("mongoose");

const ControlloMensileSchema = mongoose.Schema({
    utente: String,
    dataControllo: Date,
    esitoPositivo: Boolean,
    utenteNome: String,
    note: String,
    tipologia: String,
});

module.exports = mongoose.model("ControlloMensile", ControlloMensileSchema, "controlloMensile");
