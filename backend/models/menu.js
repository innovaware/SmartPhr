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
  }],
  active: Boolean, 
  order: Number,
});

module.exports = mongoose.model('Menu', MenuSchema, 'menu');