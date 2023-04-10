const { mongoConect } = require("../../config/db");
const dish = require('../../models/Platos');

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
        value: undefined
    };
    let auxParams = {};
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
                if(key === "name") {
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
        if(params.name) {
            const name = event.queryStringParameters.name;
            const regex = new RegExp(name, "i");
            filteredDishes = await dish.paginate({ name: { $regex: regex}, ...auxParams}, options);
            return {
                statusCode: 200,
                body: JSON.stringify(filteredDishes)
            }
        };
        // Todos los docs o filtrados por categoria y/o valor
        filteredDishes = await dish.paginate({ ...auxParams }, options);
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
