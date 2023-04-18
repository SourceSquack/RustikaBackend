const { mongoConect } = require("../../config/db");
const { uploadFile } = require('../../services/uploadImage');
const drink = require('../../models/Bebidas');
const middy = require("@middy/core");
const cors = require('@middy/http-cors');
const jsonBodyParser = require("@middy/http-json-body-parser");
const multiparDataParser = require("@middy/http-multipart-body-parser");

const updateDrink = async (event) => {
    const { id } = event.pathParameters;
    if(!event.body) return {
        statusCode: 400,
        body: JSON.stringify({"error": "Debes pasar los campos que deseas actualizar de la bebida"})
    };
    const { name, valueUnit, valueJug, description, category, subCategory, discount } = event.body;
    try {
        // conexion con la db
        mongoConect(process.env.MONGO_URI);
        // variables
        let updatedDrink;
        let update = {
            name,
            valueUnit,
            valueJug,
            description,
            category,
            subCategory,
            discount
        }
        // Subida de la imagen en caso de querer cambiarla en el doc
        if(event.body.img) {
            const image = event.body.img;
            // validar el formato de imagen
            if(image.mimetype !== 'image/jpeg' && image.mimetype !== 'image/png') {
                return {
                    statusCode: 400,
                    body: JSON.stringify({"error" : "El formato de imagen es inválido, debe ser jpg, jpeg o png"})
                };
            };
            // En caso de cambiar imagen y nombre, para que ambos queden con el mismo valor
            if(event.body.name) {
                const s3Img = await uploadFile(`bebidas${update.name}`, image.content, image.mimetype);
                updatedDrink = await drink.updateOne(
                    {_id: id},
                    {   
                        ...update,
                        img: s3Img.Location
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
            // Caso donde no se actualiza nombre, se busca el doc para asignar el nombre a la img
            } else {
                const doc = await drink.findById(id).exec();
                const s3Img = await uploadFile(`bebidas${doc.name}`, image.content, image.mimetype);
                updatedDrink = await drink.updateOne(
                    {_id: id},
                    {   
                        ...update,
                        img: s3Img.Location
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
            };
        };
        // caso donde se actualizan datos sin imagen
        updatedDrink = await drink.updateOne(
            {_id: id},
            {
                ...update
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
    .use(cors({origins: ["https://rustika-front.vercel.app", "http://localhost:3000"], methods: "PUT"}))
}
