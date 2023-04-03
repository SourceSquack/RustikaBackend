const { mongoConect } = require("../../config/db");
const drink = require('../../models/Bebidas');

const getDrink = async (event) => {
    const {id} = event.pathParameters;

    try {
        mongoConect(process.env.MONGO_URI);
        let oneDrink = await drink.findById(id).exec();
        return {
            statusCode: 200,
            body: JSON.stringify(oneDrink)
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ "error": error })
        };
    }
};

module.exports = {getDrink};