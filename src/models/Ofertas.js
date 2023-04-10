const mongoose = require('mongoose');

const offers = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true
        },
        name: {
           type: String,
           require: true
        },
        initialDate: {
            type: Date,
            required: true
        },
       finalDate: {
            type: Date,
            required: true
        }
    }, {
    versionKey: false,
    timestamps: true,
}
);

module.exports = mongoose.model('offers', offers);