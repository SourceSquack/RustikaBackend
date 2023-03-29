const Offers = require("../../models/Ofertas")
const {mongoConect} = require("../../config/db")

const getOfertas = async(event, context)=>{
  mongoConect(process.env.MONGO_URI)
  try {
    const allOfers = await Offers.find({})
      return {
          statusCode: 200,
          body: JSON.stringify(allOfers),
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