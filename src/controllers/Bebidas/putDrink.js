const { mongoConect } = require("../../config/db");
const { uploadFile } = require('../../services/uploadImage');
const drink = require('../../models/Bebidas');
const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");
const multiparDataParser = require("@middy/http-multipart-body-parser");

const updateDrink = async (event) => {
    const { id } = event.pathParameters;
    if(!event.body) return {
        statusCode: 400,
        body: JSON.stringify({"error": "Debes pasar los campos que deseas actualizar de la bebida"})
    };
    const { name, valueUnit, valueJug, description, category, subCategory } = event.body;
    try {
        // conexion con la db
        mongoConect(process.env.MONGO_URI);

        let updatedDrink;
        // Subida de la imagen en caso de querer cambiarla en el doc
        if(event.body.img) {
            const image = event.body.img;
            const s3Img = await uploadFile(image.filename, image.content, "image/jpeg");
            updatedDrink = await drink.updateOne(
                {_id: id},
                {
                    img: s3Img.Location
                }
            );
        };
        updatedDrink = await drink.updateOne(
            {_id: id},
            {
                name,
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
            body: JSON.stringify({"error" : error.message})
        };
    }
};

module.exports = {
    updateDrink: middy(updateDrink)
    .use(jsonBodyParser())
    .use(multiparDataParser())
}
