const highSeason = require('../../models/Temporada');
const { mongoConect } = require("../../config/db");
const middy = require("@middy/core");
const cors = require('@middy/http-cors');
const jsonBodyParser = require("@middy/http-json-body-parser");

Date.prototype.isValid = function () {
    return this.getTime() === this.getTime();
};

const updateSeason = async (event) => {
    const { id } = event.pathParameters;
    if (!event.body) return {
        statusCode: 400,
        body: JSON.stringify({ "error": "Debes pasar los campos que deseas actualizar de la temporada" })
    };
    const { name, initialDateTime, finalDateTime } = event.body;
    // validaciones
    let validate = {
        initialDateTime,
        finalDateTime
    };
    for (key in validate) {
        const element = validate[key];
        if (element) {
            let dateObject = new Date(element);
            if (!dateObject.isValid()) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        "error": "Formato de fecha invalido, debe ser(yyyy-mm-dd)"
                    }),
                };
            }
        };
    };
    try {
        // conexion a la db
        mongoConect(process.env.MONGO_URI);

        let seasonToUpdate;
        // cambio de ambas fechas
        if (validate.initialDateTime && validate.finalDateTime) {
            const dateObjectInitialDate = new Date(validate.initialDateTime);
            const dateObjectFinalDate = new Date(validate.finalDateTime);
            if (dateObjectInitialDate > dateObjectFinalDate) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        "error": "La fecha inicial no puede ser mayor que la fecha final"
                    })
                }
            };
            validate = {
                initialDateTime: dateObjectInitialDate,
                finalDateTime: dateObjectFinalDate
            };
        };
        // busqueda del doc para validaciones
        const doc = await highSeason.findById(id).exec();
        // input de fecha inicial
        if (validate.initialDateTime && !validate.finalDateTime) {
            const dateObjectInitialDate = new Date(validate.initialDateTime);
            if(dateObjectInitialDate > doc.finalDateTime) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        "error": "La fecha inicial no puede ser mayor que la fecha final del doc"
                    })
                }
            }
            validate = {
                initialDateTime: dateObjectInitialDate,
            };
        };
        // input fecha final
        if(!validate.initialDateTime && validate.finalDateTime) {
            const dateObjectFinalDate = new Date(validate.finalDateTime);
            if(doc.initialDateTime > dateObjectFinalDate) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        "error": "La fecha inicial del doc es mayor que la fecha final dada"
                    })
                }
            }
            validate = {
                finalDateTime: dateObjectFinalDate
            };
        }
        validate = {
            ...validate,
            name
        }
        // solo actualizacion de nombre
        seasonToUpdate = await highSeason.updateOne(
            { _id: id },
            { ...validate }
        )
        if (seasonToUpdate.modifiedCount === 1) {
            return {
                statusCode: 200,
                body: JSON.stringify({ "message": "La temporada se actualizó correctamente" })
            }
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ "message": "Ocurrió un error actualizando la temporada" })
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
    updateSeason: middy(updateSeason)
        .use(jsonBodyParser())
        .use(cors({origins: ["https://rustika-front.vercel.app", "http://localhost:3000"], methods: "PUT"}))
};