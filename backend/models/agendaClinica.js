const mongoose = require("mongoose");
const { ObjectId } = require("bson");
const AgendaClinicaSchema = mongoose.Schema({
    paziente: ObjectId,
    pazienteName: String,
    dataRequest: Date,
    dataEvento: Date,
    evento: String,
    tipo: String,
    status: String,
    note: String,
});

module.exports = mongoose.model("AgendaClinica", AgendaClinicaSchema, "agendaClinica");
