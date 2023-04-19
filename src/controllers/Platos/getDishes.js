const { mongoConect } = require("../../config/db");
const dish = require('../../models/Platos');
const middy = require("@middy/core");
const cors = require('@middy/http-cors');

const getDishes = async (event) => {
    // paginado
    let options = {
        page: 1,
        limit: 5
    };
    // filtros
    let params = {
        name: undefined,
        category: undefined,
        value: undefined,
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
        // conexion a la db
        mongoConect(process.env.MONGO_URI);

        let filteredDishes;
        // Filtrados con nombre
        if (params.name) {
            const name = event.queryStringParameters.name;
            const regex = new RegExp(name, "i");
            filteredDishes = await dish.paginate({ name: { $regex: regex }, ...auxParams }, options);
        } else {
            // todos los docs o filtrados combinados entre categoria y subcategoria
            filteredDishes = await dish.paginate({ ...auxParams }, options);
        };
        // validacion en caso de que no existan docs
        if (filteredDishes.docs.length === 0) {
            // en caso de una busqueda por filtro que no hay asignadas o no existen
            if(event.queryStringParameters) {
                const errorParams = Object.entries(event.queryStringParameters);
                const errorString = errorParams.map(pair => pair.join('=')).join(', ');
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        "message": `No existen platos con la propiedad o las propiedades: < ${errorString} >`
                    })
                }
            } else {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        "message": "No hay platos en la base de datos :(. ¡intenta creando uno!"
                    })
                }
            }
        }
        // todos los docs o filtros
        return {
            statusCode: 200,
            body: JSON.stringify(filteredDishes)
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ "error": error.message })
        };
    }
};

module.exports = {
    getDishes: middy(getDishes)
        .use(cors({ origins: ["https://rustika-front.vercel.app", "http://localhost:3000"], methods: "GET" }))
};
