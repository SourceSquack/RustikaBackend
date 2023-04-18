const { mongoConect } = require("../../config/db");
const drink = require('../../models/Bebidas');
const middy = require("@middy/core");
const cors = require('@middy/http-cors');

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
            statusCode: 400,
            body: JSON.stringify({"error" : error.message})
        };
    }
};

module.exports = { 
    getDrink: middy(getDrink)
    .use(cors({origins: ["https://rustika-front.vercel.app", "http://localhost:3000"], methods: "GET"}))
};