const mongoose = require("mongoose");

const LettoCameraSchema = mongoose.Schema({

    camera: String,
    lenzuola: Number,
    lenzuola_lacerati: Number,
    traverse: Number,
    traverse_lacerati: Number,
    cuscini: Number,
    cuscini_lacerati: Number,
    coprimaterassi: Number,
    coprimaterassi_lacerati: Number,
    copriletti: Number,
    copriletti_lacerati: Number,
    coperte: Number,
    coperte_lacerati: Number,
    federe: Number,
    federe_lacerati: Number,


});

module.exports = mongoose.model("LettoCamera", LettoCameraSchema, "lettoCamera");
