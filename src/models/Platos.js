import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

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
        value: {
            type: String,
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
        subcategory: {
            type: String,
            required: true
        }
    }, {
    versionKey: false,
    timestamps: true,
}
);

dishSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('dish', dishSchema);