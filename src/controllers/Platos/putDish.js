const { mongoConect } = require("../../config/db");
const { uploadFile } = require('../../services/uploadImage');
const dish = require('../../models/Platos');
const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");
const multiparDataParser = require("@middy/http-multipart-body-parser");

const updateDish = async (event) => {
    const { id } = event.pathParameters;
    if(!event.body) return {
        statusCode: 400,
        body: JSON.stringify({"error": "Debes pasar los campos que deseas actualizar del plato"})
    };
    const { name, units, value, description, category  } = event.body;
    try {
        // conexion con la db
        mongoConect(process.env.MONGO_URI);

        let updatedDish;
        // subida de imagen en caso de querer cambiarla en el doc
        if (event.body.img) {
            const image = event.body.img;
            const s3Img = await uploadFile(image.filename, image.content, "image/jpeg");
            updatedDish = await dish.updateOne(
                {_id: id},
                {
                    img: s3Img.Location
                }
            );
        }
        // actualizacion de datos en caso de no subir imagen nueva
        updatedDish = await dish.updateOne(
            {_id: id},
            {
                name: name,
                units: units,
                value: value,
                description: description,
                category: category,
            }
        );
        // Confirmación de la actualizacion
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
            body: JSON.stringify(error)
        }
    }
};

module.exports = {
    updateDish: middy(updateDish)
    .use(jsonBodyParser())
    .use(multiparDataParser())
}