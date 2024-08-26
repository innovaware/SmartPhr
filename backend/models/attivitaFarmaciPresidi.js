const mongoose = require("mongoose");

const AttivitaFarmaciPresidiSchema = mongoose.Schema({
    operator: String,
    operatorName: String,
    paziente: String,
    pazienteName: String,
    data: Date,
    elemento: String,
    elemento_id: String,
    type: String,
    data: String,
    qty: String
});

module.exports = mongoose.model("AttivitaFarmaciPresidi", AttivitaFarmaciPresidiSchema, "attivitaFarmaciPresidi");
