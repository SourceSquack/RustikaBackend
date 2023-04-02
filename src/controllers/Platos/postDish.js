const {mongoConect} = require("../../config/db");
const dish = require('../../models/Platos');
const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");

const createDish = async (event) => {
    if(!event.body) return {
        statusCode: 400,
        body: JSON.stringify({"error": "Debes pasar los campos necesarios para crear el plato"})
    };
    const { name, img, units, value, description, category  } = event.body;
    try {
        //conexion con la db
        mongoConect(process.env.MONGO_URI);
        
        // validacion de campos obligarios
        const validate = {
            name,
            img,
            units,
            value,
            description,
            category
        };
        for(const key in validate) {
            const element = validate[key];
            if (!element && element !== units) {
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
                "message": "El plato se ha creado correctamente"
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
    createDish: middy(createDish)
        .use(jsonBodyParser())
};
