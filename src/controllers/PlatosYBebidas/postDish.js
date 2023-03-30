const {mongoConect} = require("../../config/db");
const dish = require('../../models/Platos');
const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");

const createDish = async (event) => {
    if(!event.body) return {
        statusCode: 400,
        body: JSON.stringify({"Error": "Debes pasar los campos necesarios para crear el plato/bebida"})
    };
    const { name, img, value, description, category, subcategory  } = event.body;
    try {
        //conexion con la db
        mongoConect(process.env.MONGO_URI);
        
        // validacion de campos obligarios
        const validate = {
            name,
            img,
            value,
            description,
            category,
            subcategory
        };
        for(const key in validate) {
            const element = validate[key];
            if (!element) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        "message": `el campo ${key} no puede estar vacio`
                    })
                }
            };
        };
        // creacion de la nueva instancia en la db
        const dishNuevo = new dish(validate);
        await dishNuevo.save();
    
        return {
            statusCode: 200,
            body: JSON.stringify({
                "message": "El plato/bebida se ha creado correctamente"
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({"Error": error})
        };
    }
};

module.exports = { 
    createDish: middy(createDish)
        .use(jsonBodyParser())
};
