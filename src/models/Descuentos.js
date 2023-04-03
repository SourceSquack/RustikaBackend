//Fecha de inicio
//Fecha de vencimiento
//Categoria (bool) (nombre)
//Especifico (bool) (nombre)
const mongoose = require("mongoose");

const discounts = new mongoose.Schema(
  {
    initialDate: {
      type: Date,
      required: true,
    },
    finalDate: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
    },
    specific: {
      type: String,
    },percentage: {
      type: Number,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("discounts", discounts);
