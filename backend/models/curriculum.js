const mongoose = require("mongoose");

const CurriculumSchema = mongoose.Schema({
  idDipendente: String,
  filename: String,
  dateupload: Date,
  note: String,
});

module.exports = mongoose.model('Curriculum', CurriculumSchema, 'curriculum');