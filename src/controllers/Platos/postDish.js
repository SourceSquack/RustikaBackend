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
    const { name, units, value, description, category, discount } = event.body;
    const image = event.body.img;
    // validacion del formato de imagen
    if(image.mimetype !== 'image/jpeg' &&
       image.mimetype !== 'image/png' &&
       image.mimetype !== "image/webp"
       ) {
        return {
            statusCode: 400,
            body: JSON.stringify({"error" : "El formato de imagen es inválido, debe ser jpg, jpeg,png o webp. El formato de la imagen enviada es: " + image.mimetype})
        };
    };
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
            discount
        };
        for (const key in validate) {
            const element = validate[key];
            if (!element && key !== "units" && key !== "discount" && key !== "description") {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        "message": `el campo <<${key}>> no puede estar vacio`
                    })
                }
            };
        };
        // Subir la imagen al S3 Bucket
        let s3Img = await uploadFile(`platos${validate.name}`, image.content, image.mimetype);
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
        return {
            statusCode: 400,
            body: JSON.stringify({"error" : error.message})
        };
    }
};

module.exports = {
    createDish: middy(createDish)
        .use(jsonBodyParser())
        .use(multiparDataParser())
};
