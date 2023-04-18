const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const drinkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    valueUnit: {
      type: Number,
      required: true,
    },
    valueJug: {
      type: Number,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    discount: {
      type: Boolean,
      default: false,
    },
    percentage: {
      type: Number,
      required: false,
    },
    newValueUnit: {
      type: Number,
      required: false,
    },
    newValueJug: {
      type: Number,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

drinkSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("drink", drinkSchema);
