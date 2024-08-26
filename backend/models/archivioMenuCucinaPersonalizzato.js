const mongoose = require("mongoose");
const Pazienti = require("./pazienti");
const Menu = require("./cucinaPersonalizzato");

const ArchivioMenuCucinaPersonalizzatoSchema = mongoose.Schema({
    paziente: String,
    pazienteNome: String,
    pazienteCognome: String,
    menu: [{
        type: mongoose.Schema.Types.Mixed,
        ref: 'Menu',
        required: true
    }],
    dataCreazione: {
        type: Date,
        default: Date.now
    },
    dataUltimaModifica: {
        type: Date,
        default: Date.now
    },
});

// Middleware per aggiornare `dataUltimaModifica` ad ogni salvataggio
ArchivioMenuCucinaPersonalizzatoSchema.pre('save', function (next) {
    this.dataUltimaModifica = Date.now();
    next();
});

module.exports = mongoose.model("ArchivioMenuCucinaPersonalizzato", ArchivioMenuCucinaPersonalizzatoSchema, "archivioMenuCucinaPersonalizzato");
