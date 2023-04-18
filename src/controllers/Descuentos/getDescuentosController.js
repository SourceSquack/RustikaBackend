const discounts = require("../../models/Descuentos");
const { mongoConect } = require("../../config/db");
const middy = require("@middy/core");
const cors = require('@middy/http-cors');

const getDescuentos = async (event, context) => {
  mongoConect(process.env.MONGO_URI);
  try {
    const allDiscounts = await discounts.find({});
    return {
      statusCode: 200,
      body: JSON.stringify(allDiscounts),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: error }),
    };
  }
};
module.exports = {
  getDescuentos: middy(getDescuentos)
    .use(cors({origins: ["https://rustika-front.vercel.app", "http://localhost:3000"], methods: "GET"}))
};
