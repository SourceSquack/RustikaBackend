const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const offers = new mongoose.Schema(
    {
        image: {
            type: String,
            required: true
        },
        initialDate: {
            type: String,
            required: true
        },
       finalDate: {
            type: String,
            required: true
        }
    }, {
    versionKey: false,
    timestamps: true,
}
);
 offers.plugin(mongoosePaginate);

module.exports = mongoose.model('offers', offers);