const mongoose = require("mongoose");

const MenuSchema = mongoose.Schema({
  title: String,
  link: String,
  icon: String,
  subMenu: [{
    title: String,
    link: String,
    icon: String,
    active: Boolean
  }],
  active: Boolean
});

module.exports = mongoose.model('Menu', MenuSchema, 'menu');