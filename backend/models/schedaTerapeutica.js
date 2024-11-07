const mongoose = require("mongoose");

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

const ItemsArraySchema = mongoose.Schema({
    DataInizio: { type: Date, required: true },
    Terapia: { type: String, required: true },
    FasceOrarie: [FasciaOrariaSchema],
    DataFine: { type: Date },
    Note: { type: String },
});

const SchedaTerapeuticaSchema = mongoose.Schema({
    idPaziente: { type: String, required: true },
    Orale: [ItemsArraySchema],
    IMEVSC: [ItemsArraySchema],
    Estemporanea: [ItemsArraySchema],
});

module.exports = mongoose.model("SchedaTerapeutica", SchedaTerapeuticaSchema, "schedaTerapeutica");
