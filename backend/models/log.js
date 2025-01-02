const mongoose = require("mongoose");

const LogSchema = mongoose.Schema({
    data: { type: Date, required: true },
    operatore: String,
    operatoreID: String,
    className: String,
    operazione: String,
});

module.exports = mongoose.model('Log', LogSchema, 'log');
