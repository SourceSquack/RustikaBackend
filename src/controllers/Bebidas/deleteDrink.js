const { mongoConect } = require("../../config/db");
const drink = require('../../models/Bebidas');
const middy = require("@middy/core");
const cors = require('@middy/http-cors');

const deleteDrink = async (event) => {
    const {id} = event.pathParameters
    try {
        mongoConect(process.env.MONGO_URI);
        let drinkDelete = await drink.deleteOne({_id: id});
        if (drinkDelete.deletedCount === 1) {
            return {
                statusCode: 200,
                body: JSON.stringify({"message": "La bebida se eliminó correctamente"})
            }
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({"error": "Ocurrió un error eliminando la bebida"})
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
    deleteDrink : middy(deleteDrink)
        .use(cors({origins: ["https://rustika-front.vercel.app", "http://localhost:3000"], methods: "DELETE"}))
}