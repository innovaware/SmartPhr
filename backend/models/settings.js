const mongoose = require("mongoose");

const settingsSchema = mongoose.Schema({
    alertContratto: Number,
    alertDiarioClinico: Number,
    menuInvernaleStart: Date,
    menuInvernaleEnd: Date,
    menuEstivoStart: Date,
    menuEstivoEnd: Date,
});

module.exports = mongoose.model("Settings", settingsSchema, "settings");
