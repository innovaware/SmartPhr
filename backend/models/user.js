const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  group: String,
  username: String,
  password: String,
  active: Boolean,
  role: ObjectId,
});

module.exports = mongoose.model('User', UserSchema, 'user');