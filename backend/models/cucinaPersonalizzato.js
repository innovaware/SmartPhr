const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const CucinaPersonalizzatoSchema = mongoose.Schema({
    /**
     * Identificativo del paziente
     */
    paziente: String,
    pazienteName: String,
    /**
     * Data utilizzo
     */
    dataCreazione: Date,
    dataUltimaModifica: Date,
    giornoRif: String,
    giornoRifNum: Number,
    active: Boolean,
    menuColazione: String,
    menuPranzo: String,
    menuCena: String,
    menuSpuntino: String,
    menuMerenda: String,
});

module.exports = mongoose.model("CucinaPersonalizzato", CucinaPersonalizzatoSchema, "cucinaPersonalizzato");
