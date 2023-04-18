const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

module.exports = mongoose.model("user", user);
