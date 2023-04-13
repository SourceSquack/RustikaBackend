const Offers = require("../../models/Ofertas");
const {mongoConect} = require("../../config/db");

const getOfertas = async(event, context)=>{
  mongoConect(process.env.MONGO_URI)
  const toDay = new Date();
  try {
    const activeOffers = await Offers.find({initialDate: { $gte: toDay }})
      return {
          statusCode: 200,
          body: JSON.stringify(activeOffers),
        };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: error}),
    };
  }
}
module.exports = {
    getOfertas
}