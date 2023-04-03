const { mongoConect } = require("../../config/db");
const drink = require('../../models/Bebidas');
const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");

const updateDrink = async (event) => {
    const {id} = event.pathParameters;
    if(!event.body) return {
        statusCode: 400,
        body: JSON.stringify({"error": "Debes pasar los campos que deseas actualizar del plato"})
    };
    const { name, img, valueUnit, valueJug, description, category, subCategory } = event.body;
    try {
        mongoConect(process.env.MONGO_URI);
        let updatedDrink = await drink.updateOne(
            {_id: id},
            {
                name,
                img,
                valueUnit,
                valueJug,
                description,
                category,
                subCategory
            }
        );
        if(updatedDrink.modifiedCount === 1) {
            return {
                statusCode: 200,
                body: JSON.stringify({"message": "La bebida se actualizó correctamente"})
            }
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({"message": "Ocurrió un error actualizando la bebida"})
            }
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({"error": error})
        }
    }
};

module.exports = {
    updateDrink: middy(updateDrink)
    .use(jsonBodyParser())
}