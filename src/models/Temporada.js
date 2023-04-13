const mongoose = require('mongoose');

const highSeasonSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        initialDateTime: {
            type: Date,
            required: true
        },
        finalDateTime: {
            type: Date,
            required: true
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model('highSeason', highSeasonSchema);
