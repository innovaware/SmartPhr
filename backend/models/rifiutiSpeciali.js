const mongoose = require("mongoose");

const RifiutiSpecialiSchema = mongoose.Schema({
    anno: { type: Number, required: true }, // Anno di riferimento
    mesi: [
        {
            mese: { type: String, required: true }, // Nome del mese
            data: { type: Date, required: false }, // Data
            rifiutiSpeciali: { type: Number, required: true }, // Quantità rifiuti speciali
            farmaciScaduti: { type: Number, required: true }, // Quantità farmaci scaduti
            firmaIp: { type: String, required: false }, // Firma IP
            IpId: { type: String, required: false }, 
            note: { type: String, required: false }, // Note
        },
    ],
});

module.exports = mongoose.model("RifiutiSpeciali", RifiutiSpecialiSchema, "rifiutiSpeciali");
