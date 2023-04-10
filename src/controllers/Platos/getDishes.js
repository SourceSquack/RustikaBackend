const { mongoConect } = require("../../config/db");
const dish = require('../../models/Platos');

const getDishes = async (event) => {
    let options = {
        page: 1,
        limit: 5
    };
    if (event.queryStringParameters) {
        let { page , limit } = event.queryStringParameters;

        if(page && limit) {
            page = parseInt(page)
            limit = parseInt(limit)
            options = {
                ...options,
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
        mongoConect(process.env.MONGO_URI);
        let filteredDishes;
        filteredDishes = await dish.paginate({}, options);
        // filteredDishes = filteredDishes.docs
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
