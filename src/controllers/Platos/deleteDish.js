const { mongoConect } = require("../../config/db");
const dish = require('../../models/Platos');
const middy = require("@middy/core");
const cors = require('@middy/http-cors');

const deleteDish = async (event) => {
    const {id} = event.pathParameters
    try {
        mongoConect(process.env.MONGO_URI);
        let dishdelete = await dish.deleteOne({_id: id});
        if (dishdelete.deletedCount === 1) {
            return {
                statusCode: 200,
                body: JSON.stringify({"message": "El plato se eliminó correctamente"})
            }
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({"error": "Ocurrió un error eliminando el plato"})
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
    deleteDish : middy(deleteDish)
    .use(cors({origins: ["https://rustika-front.vercel.app", "http://localhost:3000"], methods: "DELETE"}))
}
