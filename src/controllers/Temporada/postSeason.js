const highSeason = require('../../models/Temporada');
const { mongoConect } = require("../../config/db");
const middy = require("@middy/core");
const cors = require('@middy/http-cors');
const jsonBodyParser = require("@middy/http-json-body-parser");

Date.prototype.isValid = function () {
    return this.getTime() === this.getTime();
};

const postHighSeason = async (event) => {

    if (!event.body) return {
        statusCode: 400,
        body: JSON.stringify({ "error": "Debes pasar los campos necesarios para crear la temporada alta" })
    };

    const { name, initialDateTime, finalDateTime } = event.body;
    let validate = {
        name,
        initialDateTime,
        finalDateTime
    };
    // validacion de todos los campos necesarios
    for (const key in validate) {
        const element = validate[key];
        if (!element) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    "error": `el campo <<${key}>> no puede estar vacio`
                })
            }
        };
    };
    // creacion de fechas con los datos pasados por body
    const dateObjectInitialDate = new Date(validate.initialDateTime);
    const dateObjectFinalDate = new Date(validate.finalDateTime);
    // validaciones 
    if (!dateObjectInitialDate.isValid() || !dateObjectFinalDate.isValid()) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                "error": "Formato de fecha invalido, debe ser(yyyy-mm-dd)"
            })
        };
    }
    if(dateObjectInitialDate > dateObjectFinalDate) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                "error": "La fecha inicial no puede ser mayor que la fecha final"
            })
        }
    };
    validate = {
        ...validate,
        initialDateTime: dateObjectInitialDate,
        finalDateTime: dateObjectFinalDate
    };
    try {
        // conexion a la db
        mongoConect(process.env.MONGO_URI);
        // creacion de la instancia 
        const newSeason = new highSeason(validate);
        await newSeason.save();

        return {
            statusCode: 200,
            body: JSON.stringify({
                "message": "La temporada alta se creó correctamente"
            }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ "error": error.message }),
        };
    };
};

module.exports = {
    postHighSeason: middy(postHighSeason)
        .use(jsonBodyParser())
        .use(cors({origins: ["https://rustika-front.vercel.app", "http://localhost:3000"], methods: "POST"}))
};
