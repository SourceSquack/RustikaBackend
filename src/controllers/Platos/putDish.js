const { mongoConect } = require("../../config/db");
const { uploadFile } = require('../../services/uploadImage');
const dish = require('../../models/Platos');
const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");
const multiparDataParser = require("@middy/http-multipart-body-parser");

const updateDish = async (event) => {
    const { id } = event.pathParameters;
    if (!event.body) return {
        statusCode: 400,
        body: JSON.stringify({ "error": "Debes pasar los campos que deseas actualizar del plato" })
    };
    const { name, units, value, description, category, discount } = event.body;
    try {
        // conexion con la db
        mongoConect(process.env.MONGO_URI);
        // variables
        let updatedDish;
        let update = {
            name,
            units,
            value,
            description,
            category,
            discount
        };
        // subida de imagen en caso de querer cambiarla en el doc
        if (event.body.img) {
            const image = event.body.img;
            // validar el formato de imagen
            if (image.mimetype !== 'image/jpeg' && image.mimetype !== 'image/png') {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ "error": "El formato de imagen es inválido, debe ser jpg, jpeg o png" })
                };
            };
            // En caso de cambiar imagen y nombre, para que ambos queden con el mismo valor
            if (event.body.name) {
                const s3Img = await uploadFile(`platos${update.name}`, image.content, image.mimetype);
                updatedDish = await dish.updateOne(
                    { _id: id },
                    {
                        ...update,
                        img: s3Img.Location
                    }
                );
                if (updatedDish.modifiedCount === 1) {
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ "message": "El plato se actualizó correctamente" })
                    }
                } else {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ "message": "Ocurrió un error actualizando el plato" })
                    }
                }
                // Caso donde no se actualiza nombre, se busca el doc para asignar el nombre a la img
            } else {
                const doc = await dish.findById(id).exec();
                const s3Img = await uploadFile(`platos${doc.name}`, image.content, image.mimetype);
                updatedDish = await dish.updateOne(
                    { _id: id },
                    {
                        ...update,
                        img: s3Img.Location
                    }
                );
                if (updatedDish.modifiedCount === 1) {
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ "message": "El plato se actualizó correctamente" })
                    }
                } else {
                    return {
                        statusCode: 400,
                        body: JSON.stringify({ "message": "Ocurrió un error actualizando el plato" })
                    }
                }
            };
        }
        // actualizacion de datos sin imagen
        updatedDish = await dish.updateOne(
            { _id: id },
            {
                ...update
            }
        );
        if (updatedDish.modifiedCount === 1) {
            return {
                statusCode: 200,
                body: JSON.stringify({ "message": "El plato se actualizó correctamente" })
            }
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ "message": "Ocurrió un error actualizando el plato" })
            }
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ "error": error.message })
        };
    }
};

module.exports = {
    updateDish: middy(updateDish)
        .use(jsonBodyParser())
        .use(multiparDataParser())
}