const highSeason = require('../../models/Temporada');
const { mongoConect } = require("../../config/db");

const getHighSeasons = async () => {
    try {
        // conexion a la db
        mongoConect(process.env.MONGO_URI);
        // busqueda de docs
        const seasons = await highSeason.find({});
        return {
            statusCode: 200,
            body: JSON.stringify(seasons)
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ "error": error.message })
        };
    }
};

module.exports = { getHighSeasons };
