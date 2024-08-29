const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const MenuSchema = mongoose.Schema({
    title: String,
    link: String,
    icon: String,
    roles: [ObjectId],
    subMenu: [{
        title: String,
        link: String,
        icon: String,
        active: Boolean,
        roles: [ObjectId],
        status: Boolean,
        order: Number, //If true then subMenu is opened else closed
        subMenu: [{
            title: String,
            link: String,
            icon: String,
            active: Boolean,
            roles: [ObjectId],
            order: Number,
            status: Boolean, //If true then subMenu is opened else closed
        }],
    }],
    active: Boolean,
    order: Number,
});

module.exports = mongoose.model('Menu', MenuSchema, 'menu');