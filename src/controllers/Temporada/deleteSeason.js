const highSeason = require('../../models/Temporada');
const { mongoConect } = require("../../config/db");
const middy = require("@middy/core");
const cors = require('@middy/http-cors');

const deleteSeason = async (event) => {
    const {id} = event.pathParameters
    try {
        // conexion a la db
        mongoConect(process.env.MONGO_URI);
        // eliminando el doc por id
        let seasonDelete = await highSeason.deleteOne({_id: id});
        if (seasonDelete.deletedCount === 1) {
            return {
                statusCode: 200,
                body: JSON.stringify({"message": "La temporada se eliminó correctamente"})
            }
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({"error": "Ocurrió un error eliminando la temporada"})
            }
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({"error" : error.message})
        };
    }
};

module.exports = { 
    deleteSeason : middy(deleteSeason)
    .use(cors({origins: ["https://rustika-front.vercel.app", "http://localhost:3000"], methods: "DELETE"})) 
}