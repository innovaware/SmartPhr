const mongoose = require("mongoose");

const MansioniSchema = mongoose.Schema({
    descrizione: String,
    codice: String,
    id: mongoose.Types.ObjectId
});

module.exports = mongoose.model('Mansioni', MansioniSchema, 'mansioni');