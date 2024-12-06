const mongoose = require("mongoose");

// Schema per le fasce orarie
const FasciaOrariaSchema = mongoose.Schema({
    sette: { type: Boolean, default: false },
    otto: { type: Boolean, default: false },
    dieci: { type: Boolean, default: false },
    dodici: { type: Boolean, default: false },
    sedici: { type: Boolean, default: false },
    diciassette: { type: Boolean, default: false },
    diciotto: { type: Boolean, default: false },
    venti: { type: Boolean, default: false },
    ventidue: { type: Boolean, default: false },
    ventitre: { type: Boolean, default: false },
});

// Schema per gli elementi di array di terapie
const ItemsArraySchema = mongoose.Schema({
    DataInizio: { type: Date }, // Campo opzionale
    Terapia: { type: String }, // Campo opzionale
    FasceOrarie: { type: [FasciaOrariaSchema], default: [{}] }, // Array di fasce orarie
    DataFine: { type: Date },
    Note: { type: String },
});

// Schema per gli elementi di alvo
const ItemsArrayAlvoSchema = mongoose.Schema({
    attivo: { type: Boolean }, // Campo opzionale
    data: { type: Date, required: true, unique: true },
    numeroAlviNormali: { type: Number, default: 0 },
    numeroAlviDiarroici: { type: Number, default: 0 },
});


const ItemsArrayFirmeSchema = mongoose.Schema({
    data: { type: Date },
    firmaMattina: { type: String },
    firmaPomeriggio: { type: String },
    firmaNotte: { type: String },
    attivaFirma: { type: Boolean, default: true },
});

// Schema principale per la scheda terapeutica
const SchedaTerapeuticaSchema = mongoose.Schema({
    idPaziente: { type: String, required: true },
    Orale: { type: [ItemsArraySchema], default: [] }, // Array di elementi terapia orale
    IMEVSC: { type: [ItemsArraySchema], default: [] }, // Array di elementi IMEVSC
    Estemporanea: { type: [ItemsArraySchema], default: [] }, // Array di elementi estemporanea
    firme: { type: [ItemsArrayFirmeSchema], default: [] }, // Array di firme
    alvo: { type: [ItemsArrayAlvoSchema], default: [] }, // Array di alvo
    allergie: { type: String }, // Campo allergie
});

module.exports = mongoose.model("SchedaTerapeutica", SchedaTerapeuticaSchema, "schedaTerapeutica");
