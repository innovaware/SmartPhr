const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  group: String,
  username: String,
  password: String,
  active: Boolean
});

module.exports = mongoose.model('User', UserSchema, 'user');