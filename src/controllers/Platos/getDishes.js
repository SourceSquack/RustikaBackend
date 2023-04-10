const { mongoConect } = require("../../config/db");
const dish = require('../../models/Platos');

const getDishes = async (event) => {
    // variables de paginado y filtro, respectivamente
    let options = {
        page: 1,
        limit: 5
    };

    let params = {
        name: undefined,
        category: undefined
    };
    // validaciones de params
    if (event.queryStringParameters) {
        let paramsEvent = event.queryStringParameters;
        // opciones del paginado
        for(key in options) {
            if(paramsEvent[key]) {
                options = {
                    ...options,
                    [key]: parseInt(paramsEvent[key]) 
                }
            }
        }
        // busqueda de filtros pasados por query
        for(key in params) {
            if(paramsEvent[key]) {
                params = {
                    ...params,
                    [key]: paramsEvent[key]
                }
            }
        };
    };

    try {
        // conexion a la db
        mongoConect(process.env.MONGO_URI);

        let filteredDishes;
        // Busqueda de docs por filtros
        // Filtro por nombre y categoria
        if(params.name && params.category) {
            const name = event.queryStringParameters.name;
            const regex = new RegExp(name, "i");
            filteredDishes = await dish.paginate({ name: { $regex: regex}, category: params.category}, options);
            return {
                statusCode: 200,
                body: JSON.stringify(filteredDishes)
            }
        };
        // Filtro por nombre
        if(params.name) {
            const name = event.queryStringParameters.name;
            const regex = new RegExp(name, "i");
            filteredDishes = await dish.paginate({ name: { $regex: regex}}, options);
            return {
                statusCode: 200,
                body: JSON.stringify(filteredDishes)
            }
        };
        // Filtro por categoria
        if (params.category) {
            filteredDishes = await dish.paginate({category: params.category},options);
            return {
                statusCode: 200,
                body: JSON.stringify(filteredDishes)
            }
        };
        // Todos los docs por defecto
        filteredDishes = await dish.paginate({}, options);
        return {
            statusCode: 200,
            body: JSON.stringify(filteredDishes)
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({"error" : error.message})
        };
    }
};

module.exports = { getDishes };
