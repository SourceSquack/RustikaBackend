const discounts = require("../../models/Descuentos");
const { mongoConect } = require("../../config/db");

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
  getDescuentos,
};
