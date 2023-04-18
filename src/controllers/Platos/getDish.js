const { mongoConect } = require("../../config/db");
const dish = require('../../models/Platos');
const middy = require("@middy/core");
const cors = require('@middy/http-cors');

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
            statusCode: 400,
            body: JSON.stringify({"error" : error.message})
        };
    }
};

module.exports = {
    getDish: middy(getDish)
        .use(cors({origin: "https://rustika-front.vercel.app", methods: "GET"}))
};
