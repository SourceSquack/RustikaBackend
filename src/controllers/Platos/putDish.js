const { mongoConect } = require("../../config/db");
const dish = require('../../models/Platos');
const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");

const updateDish = async (event) => {
    const {id} = event.pathParameters;
    if(!event.body) return {
        statusCode: 400,
        body: JSON.stringify({"error": "Debes pasar los campos que deseas actualizar del plato"})
    };
    const { name, img, units, value, description, category  } = event.body;
    try {
        mongoConect(process.env.MONGO_URI);
        let updatedDish = await dish.updateOne(
            {_id: id},
            {
                name: name,
                img: img,
                units: units,
                value: value,
                description: description,
                category: category,
            }
        );
        if(updatedDish.modifiedCount === 1) {
            return {
                statusCode: 200,
                body: JSON.stringify({"message": "El plato se actualizó correctamente"})
            }
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({"message": "Ocurrió un error actualizando el plato"})
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