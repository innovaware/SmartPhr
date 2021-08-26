const mongoose = require("mongoose");

const PazienteSchema = mongoose.Schema({
    cognome: String,
    nome: String,
    sesso: String,
    luogoNascita: String,
    dataNascita: Date,
    residenza: String,
    statoCivile: String,
    figli: Number,
    scolarita: String,
    situazioneLavorativa: String,
    personeRiferimento: String,
    telefono: String,
    dataIngresso: Date,
    provincia: String,
    localita: String,
});

module.exports = mongoose.model('Pazienti', PazienteSchema, 'pazienti');