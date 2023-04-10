const { mongoConect } = require("../../config/db");
const dish = require('../../models/Platos');

const getDishes = async (event) => {
    let options = {
        page: 1,
        limit: 5
    };
    // validaciones de params
    if (event.queryStringParameters) {
        let { page , limit } = event.queryStringParameters;

        if(page && limit) {
            page = parseInt(page)
            limit = parseInt(limit)
            options = {
                page,
                limit
            }
        }

        if(page) {
            page = parseInt(page)
            options = {
                ...options,
                page
            }
        }

        if(limit) {
            limit = parseInt(limit)
            options = {
                ...options,
                limit
            }
        }
    };

    try {
        // conexion a la db
        mongoConect(process.env.MONGO_URI);

        let filteredDishes;
        // Filtro por nombre
        if(event.queryStringParameters.name) {
            const name = event.queryStringParameters.name;
            const regex = new RegExp(name, "i"),
            filteredDishes = await dish.paginate({ name: { $regex: regex}}, options);
            return {
                statusCode: 200,
                body: JSON.stringify(filteredDishes)
            }
        }
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
