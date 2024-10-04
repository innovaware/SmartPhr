const mongoose = require("mongoose");

const AttivitaFarmaciPresidiSchema = mongoose.Schema({
    operator: String,
    operatorName: String,
    paziente: String,
    pazienteName: String,
    dataOP: Date,
    elemento: String,
    elementotype: String,
    elemento_id: String,
    type: String,
    operation: String,
    qty: String,
    qtyRes: String,
});

module.exports = mongoose.model("AttivitaFarmaciPresidi", AttivitaFarmaciPresidiSchema, "attivitaFarmaciPresidi");
