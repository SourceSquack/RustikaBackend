const Offers = require("../../models/Ofertas");
const {mongoConect} = require("../../config/db");

const getOfertas = async(event, context)=>{
  mongoConect(process.env.MONGO_URI)
  const temp = await Offers.find({})
    return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: temp,
          },
        ),
      };
}
module.exports = {
    getOfertas
}