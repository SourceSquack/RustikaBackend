//Fecha
//hora de inicio
//hora de finalizacion
//Decoracion (bool)
//Pagado (bool)
//numero de personas
//Motivo (string) //

const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');

const booking = new mongoose.Schema(
  {
    initialDateTime: {
      type: Date,
      required: true,
    },
    finalDateTime: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      require: true,
    },
    payed: {
      type: Boolean,
      require: true,
    },
    decoration: {
      type: Boolean,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    active: {
        type: Boolean,
        require: true,
        default: true
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
booking.plugin(mongoosePaginate);
module.exports = mongoose.model("booking", booking);
