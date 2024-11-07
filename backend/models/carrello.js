const mongoose = require("mongoose");

const CarrelloSchema = mongoose.Schema({
    type: String,
    contenuto: [{
        elementoID: String,
        elementoName: String,
        elementoType:String,
        nome: String,
        quantita: Number,
        pazienteID: String,
        pazienteNome: String,
        note: String,
    }],
    inUso: Boolean,
    nomeCarrello: String,
    operatoreID: String,
    operatoreName: String,
    dataUtilizzo: Date,
});

module.exports = mongoose.model('Carrello', CarrelloSchema, 'carrello');