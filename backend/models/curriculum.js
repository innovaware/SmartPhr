const mongoose = require("mongoose");

const CurriculumSchema = mongoose.Schema({
    filename: String,
    dateupload: Date,
    note: String,
    mansione: String,
    nome: String,
    cognome: String,
    codiceFiscale: String,
    status: String,
});

module.exports = mongoose.model("Curriculum", CurriculumSchema, "curriculum");
