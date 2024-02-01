const mongoose = require("mongoose");

const ConsulentiSchema = mongoose.Schema({
    cognome: String,
    nome: String,
    codiceFiscale: String,
    dataNascita: Date,
    comuneNascita: String,
    provinciaNascita: String,
    indirizzoNascita: String,
    indirizzoResidenza: String,
    comuneResidenza: String,
    provinciaResidenza: String,
    mansione: String,
    tipologiaContratto: String,
    telefono: String,
    email: String,
    cancellato: Boolean,
    dataCancellazione: Date,
    dataUltimaModifica: Date,
    dataCreazione: Date,
    sesso: String,
});

module.exports = mongoose.model('Consulenti', ConsulentiSchema, 'consulenti');