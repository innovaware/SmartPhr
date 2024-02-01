const mongoose = require("mongoose");

const DipendentiSchema = mongoose.Schema({
    cognome: String,
    nome: String,
    cf: String,
    dataNascita: Date,
    comuneNascita: String,
    provinciaNascita: String,
    indirizzoNascita: String,
    indirizzoResidenza: String,
    sesso: String,
    comuneResidenza: String,
    provinciaResidenza: String,
    titoloStudio: String,
    mansione: mongoose.Types.ObjectId,
    tipoContratto: String,
    telefono: String,
    email: String,
    dataCreazione: Date,
    dataUltimaModifica: Date,
    cancellato: Boolean,
    dataCancellazione: Date,
    idUser: mongoose.Types.ObjectId,
    accettatoRegolamento: Boolean
});

module.exports = mongoose.model('Dipendenti', DipendentiSchema, 'dipendenti');