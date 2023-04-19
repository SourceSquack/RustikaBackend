const { mongoConect } = require("../../config/db");
const drink = require('../../models/Bebidas');
const middy = require("@middy/core");
const cors = require('@middy/http-cors');

const getDrinks = async (event) => {
    // paginado
    let options = {
        page: 1,
        limit: 5
    };
    // filtros
    let params = {
        name: undefined,
        category: undefined,
        subCategory: undefined,
        discount: undefined
    };
    let auxParams = {};
    // validaciones de params
    if (event.queryStringParameters) {
        let paramsEvent = event.queryStringParameters;
        // opciones del paginado
        for (key in options) {
            if (paramsEvent[key]) {
                options = {
                    ...options,
                    [key]: parseInt(paramsEvent[key])
                }
            }
        }
        // busqueda de filtros pasados por query
        for (key in params) {
            if (paramsEvent[key]) {
                if (key === "name") {
                    params = {
                        ...params,
                        name: paramsEvent[key]
                    }
                } else {
                    auxParams = {
                        ...auxParams,
                        [key]: paramsEvent[key]
                    }
                }
            }
        };
    };
    try {
        // conexion con la db
        mongoConect(process.env.MONGO_URI);

        let filteredDrinks;
        // filtrado por nombre
        if (params.name) {
            const name = event.queryStringParameters.name;
            const regex = new RegExp(name, "i");
            filteredDrinks = await drink.paginate({ name: { $regex: regex }, ...auxParams }, options);
        } else {
            // todos los docs o filtrados combinados entre categoria y subcategoria
            filteredDrinks = await drink.paginate({ ...auxParams }, options);
        }
        // validacion en caso de que no existan docs
        if (filteredDrinks.docs.length === 0) {
            // en caso de una busqueda por filtro que no hay asignadas o no existen
            if (event.queryStringParameters) {
                const errorParams = Object.entries(event.queryStringParameters);
                const errorString = errorParams.map(pair => pair.join('=')).join(', ');
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        "message": `No existen bebidas con la propiedad o las propiedades: < ${errorString} >`
                    })
                }
            } else {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        "message": "No hay bebidas en la base de datos :(. ¡intenta creando una!"
                    })
                }
            }
        }
        // todos los docs o filtros
        return {
            statusCode: 200,
            body: JSON.stringify(filteredDrinks)
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ "error": error.message })
        };
    }
};

module.exports = {
    getDrinks: middy(getDrinks)
        .use(cors({ origins: ["https://rustika-front.vercel.app", "http://localhost:3000"], methods: "GET" }))
};
