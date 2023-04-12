const highSeason = require('../../models/Temporada');
const { mongoConect } = require("../../config/db");
const middy = require("@middy/core");
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
    try {
        
    } catch (error) {

    };
};