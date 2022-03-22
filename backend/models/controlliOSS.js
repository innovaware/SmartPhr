const mongoose = require("mongoose");

const ControlliOSSSchema = mongoose.Schema({

    operatorNamePrimavera: String,
    operatorNameEstate: String,
    operatorNameAutunno: String,
    operatorNameInverno: String,

    operatorNameGennaio: String,
    operatorNameFebbraio: String,
    operatorNameMarzo: String,
    operatorNameAprile: String,
    operatorNameMaggio: String,
    operatorNameGiugno: String,
    operatorNameLuglio: String,
    operatorNameAgosto: String,
    operatorNameSettembre: String,
    operatorNameOttobre: String,
    operatorNameNovembre: String,
    operatorNameDicembre: String,

    primavera: Date,
    estate: Date,
    autunno: Date,
    inverno: Date,

    gennaio: Date,
    febbraio: Date,
    marzo: Date,
    aprile: Date,
    maggio: Date,
    giugno: Date,
    luglio: Date,
    agosto: Date,
    settembre: Date,
    ottobre: Date,
    novembre: Date,
    dicembre: Date,


    paziente: String,
    pazienteName: String,


    anno: String,
});

module.exports = mongoose.model("ControlliOSS", ControlliOSSSchema, "controlliOSS");
