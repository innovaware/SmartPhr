const mongoose = require("mongoose");

const PresenzeSchema = mongoose.Schema({
    data: Date,
    oraInizio: String,
    oraFine: String,
    turno: String,
    mansione: mongoose.Types.ObjectId,
    user: mongoose.Types.ObjectId,
    note: String
});

module.exports = mongoose.model("Presenze", PresenzeSchema, "presenze");
