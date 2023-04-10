const { mongoConect } = require("../../config/db");
const drink = require('../../models/Bebidas');

const getDrinks = async (event) => {
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
        let filteredDrinks;
        filteredDrinks = await drink.paginate({}, options);
        return {
            statusCode: 200,
            body: JSON.stringify(filteredDrinks)
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({"error" : error.message})
        };
    }
};

module.exports = { getDrinks };
