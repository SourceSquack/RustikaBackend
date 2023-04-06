const { mongoConect } = require("../../config/db");
const { uploadFile } = require('../../services/uploadImage');
const dish = require('../../models/Platos');
const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");
const multiparDataParser = require("@middy/http-multipart-body-parser");

const createDish = async (event) => {
    if (!event.body) return {
        statusCode: 400,
        body: JSON.stringify({ "error": "Debes pasar los campos necesarios para crear el plato" })
    };
    // validacion de imagen a subir
    if (!event.body.img) return {
        statusCode: 400,
        body: JSON.stringify({ "error": "Debes subir la imagen para crear el plato" })
    }
    const { name, units, value, description, category } = event.body;
    const image = event.body.img;
    try {
        // conexion con la db
        mongoConect(process.env.MONGO_URI);
        // validacion de campos obligarios
        let validate = {
            name,
            units,
            value,
            description,
            category,
        };
        for (const key in validate) {
            const element = validate[key];
            if (!element && key !== "units") {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        "message": `el campo ${key} no puede estar vacio`
                    })
                }
            };
        };
        // Subir la imagen al S3 Bucket
        let s3Img = await uploadFile(image.filename, image.content, "image/jpeg");
        validate = {
            ...validate,
            img: s3Img.Location
        };
        // creacion de la nueva instancia en la db
        const dishNuevo = new dish(validate);
        await dishNuevo.save();

        return {
            statusCode: 200,
            body: JSON.stringify({ "message": "El plato se creó correctamente" })
        };
    } catch (error) {
        console.log(error)
    }
};

module.exports = {
    createDish: middy(createDish)
        .use(jsonBodyParser())
        .use(multiparDataParser())
};
