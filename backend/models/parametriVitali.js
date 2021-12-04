const mongoose = require("mongoose");

const ParametriVitaliSchema = mongoose.Schema({
  idPaziente: String,
  dateRif: String,
  data: [
    {
      gg: Number,
      pa: [
        {
          x: Date,
          y: Number,
          modify: Boolean,
        },
      ],
      tc: [
        {
          x: Date,
          y: Number,
          modify: Boolean,
        },
      ],
      spo2: [
        {
          x: Date,
          y: Number,
          modify: Boolean,
        },
      ],
      diurisi: [
        {
          x: Date,
          y: Number,
          modify: Boolean,
        },
      ],
      glic: [
        {
          x: Date,
          y: Number,
          modify: Boolean,
        },
      ],
      annotazioni: String,
    },
  ],
});

module.exports = mongoose.model(
  "ParametriVitali",
  ParametriVitaliSchema,
  "parametriVitali"
);
