const { mongoConect } = require("../../config/db");
const dish = require('../../models/Platos');

const getDishes = async (event) => {
    let options = {
        page: 1,
        limit: 5
    };
    if (event.queryStringParameters) {
        const { page , limit } = event.queryStringParameters;
        options = {
            page,
            limit
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
