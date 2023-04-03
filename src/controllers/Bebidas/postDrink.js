const { mongoConect } = require("../../config/db");
const drink = require('../../models/Bebidas');
const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");

const createDrink = async (event) => {
    if(!event.body) return {
        statusCode: 400,
        body: JSON.stringify({"error": "Debes pasar los campos necesarios para crear la bebida"})
    };
    const { name, img, valueUnit, valueJug, description, category, subCategory } = event.body;
    try {
        mongoConect(process.env.MONGO_URI);

        const validate = {
            name,
            img,
            valueUnit,
            valueJug,
            description,
            category,
            subCategory
        };
        for(const key in validate) {
            const element = validate[key];
            if(!element && key !== "valueJug") {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        "message": `el campo ${key} no puede estar vacio`
                    })
                }
            };
        };
        const drinkNueva = new drink(validate);
        await drinkNueva.save();

        return {
            statusCode: 200,
            body: JSON.stringify({
                "message": "La bebida se ha creado correctamente"
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({"error": error})
        };
    }
};

module.exports = {
    createDrink: middy(createDrink)
    .use(jsonBodyParser())
};
