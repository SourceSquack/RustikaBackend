const { mongoConect } = require("../../config/db");
const dish = require('../../models/Platos');

const getDish = async (event) => {
    const {id} = event.pathParameters;

    try {
        mongoConect(process.env.MONGO_URI);
        let oneDish = await dish.findById(id).exec();
        return {
            statusCode: 200,
            body: JSON.stringify(oneDish)
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ "error": error })
        };
    }
};

module.exports = {getDish};
