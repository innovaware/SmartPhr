const mongoose = require("mongoose");

const testRiabilitativoSchema = mongoose.Schema({
    data:Date,
    fim: Number,
    tinetti: Number,
    barthel: Number,
    paziente: mongoose.Types.ObjectId,
});

module.exports = mongoose.model("TestRiabilitativo", testRiabilitativoSchema, "testRiabilitativo");
