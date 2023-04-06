const { mongoConect } = require("../../config/db");
const { uploadFile } = require('../../services/uploadImage');
const drink = require('../../models/Bebidas');
const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");
const multiparDataParser = require("@middy/http-multipart-body-parser");

const createDrink = async (event) => {
    if (!event.body) return {
        statusCode: 400,
        body: JSON.stringify({ "error": "Debes pasar los campos necesarios para crear la bebida" })
    };
    // validacion de imagen a subir
    if (!event.body.img) return {
        statusCode: 400,
        body: JSON.stringify({ "error": "Debes subir la imagen para crear la bebida" })
    }
    const { name, valueUnit, valueJug, description, category, subCategory } = event.body;
    const image = event.body.img;
    try {
        // conexion a la db
        mongoConect(process.env.MONGO_URI);
        // validacion de campos obligatorios
        let validate = {
            name,
            valueUnit,
            valueJug,
            description,
            category,
            subCategory
        };
        for (const key in validate) {
            const element = validate[key];
            if (!element && key !== "valueJug") {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        "message": `el campo ${key} no puede estar vacio`
                    })
                }
            };
        };
        // Subir la imagen al S3 bucket
        let s3Img = await uploadFile(image.filename, image.content, "image/jpeg");
        validate = {
            ...validate,
            img: s3Img.Location
        };
        const drinkNueva = new drink(validate);
        await drinkNueva.save();

        return {
            statusCode: 200,
            body: JSON.stringify({
                "message": "La bebida se creó correctamente"
            })
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({"error" : error.message})
        };
    }
};

module.exports = {
    createDrink: middy(createDrink)
        .use(jsonBodyParser())
        .use(multiparDataParser())
};
