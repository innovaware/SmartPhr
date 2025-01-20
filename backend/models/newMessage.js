const mongoose = require("mongoose");

const newMessageSchema = mongoose.Schema({
    mittente: String,
    mittenteId: String,
    oggetto: String,
    corpo: String,
    destinatario: String,
    destinatarioId: String,
    letto: {
        type: Boolean,
        default: false
    },
    data: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('NewMessage', newMessageSchema, 'newMessage');