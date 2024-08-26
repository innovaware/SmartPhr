const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const MaterialiSchema = mongoose.Schema({
    Title: String,
    tye:String,
});

module.exports = mongoose.model("Materiali", MaterialiSchema, "materiali");
