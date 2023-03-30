const { mongoConect } = require("../../config/db");
const dish = require('../../models/Platos');
const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");

const updateDish = async (event) => {
    const {id} = event.pathParameters;
    if(!event.body) return {
        statusCode: 400,
        body: JSON.stringify({"Error": "Debes pasar los campos que deseas actualizar del plato/bebida"})
    };
    const { name, img, value, description, category, subcategory  } = event.body;
    try {
        mongoConect(process.env.MONGO_URI);
        let updatedDish = await dish.updateOne(
            {_id: id},
            {
                name: name,
                img: img,
                value: value,
                description: description,
                category: category,
                subcategory: subcategory
            }
        );
        if(updatedDish.modifiedCount === 1) {
            return {
                statusCode: 200,
                body: JSON.stringify({"message": "El plato/bebida se actualizó correctamente"})
            }
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({"message": "Ocurrió un error actualizando el plato/bebida"})
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
    updateDish: middy(updateDish)
    .use(jsonBodyParser())
}