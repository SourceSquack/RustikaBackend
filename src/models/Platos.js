const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const dishSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        img: {
            type: String,
            required: true
        },
        units: {
            type: Number
        },
        value: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
    }, {
    versionKey: false,
    timestamps: true,
}
);

dishSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('dish', dishSchema);