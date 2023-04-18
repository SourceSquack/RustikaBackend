const Offers = require("../../models/Ofertas");
const { mongoConect } = require("../../config/db");
const middy = require("@middy/core");
const urlencodeParser = require("@middy/http-urlencode-body-parser");
const jsonBodyParser = require("@middy/http-json-body-parser");
const multiparDataParser = require("@middy/http-multipart-body-parser");
const cors = require('@middy/http-cors');

const deleteOfertas = async (event, context) => {
  mongoConect(process.env.MONGO_URI);
  const { id } = event.body;
  if (!id)
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: "No se recibio ningun ID" }),
    };
  try {
    await Offers.deleteOne({ _id: id });
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "deleted",
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        Error: error,
      }),
    };
  }
};
module.exports = {
  deleteOfertas: middy(deleteOfertas)
    .use(jsonBodyParser())
    .use(urlencodeParser())
    .use(multiparDataParser())
    .use(cors({origins: ["https://rustika-front.vercel.app", "http://localhost:3000"], methods: "DELETE"}))
};
