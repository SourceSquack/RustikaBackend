const Offers = require("../../models/Ofertas");
const { mongoConect } = require("../../config/db");
const middy = require("@middy/core");
const urlencodeParser = require("@middy/http-urlencode-body-parser");
const jsonBodyParser = require("@middy/http-json-body-parser");
const multiparDataParser = require("@middy/http-multipart-body-parser");

const putOfertas = async (event, context) => {
  mongoConect(process.env.MONGO_URI);
  if (!event.body || event.body === null || event.body === "")
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: "no body" }),
    };
  const { id, updateProperty, updatedValue } = event.body;
  if (!id || !updateProperty || !updatedValue)
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: event.body }),
    };
  try {
    await Offers.updateOne(
      { _id: id },
      {
        [updateProperty]: updatedValue,
      }
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Actualizado" }),
    };
  } catch (error) {
    if (error.name === "CastError") return {
      statusCode: 400,
      body: JSON.stringify({ Error: "Id invalido" }),
    };

    return {
      statusCode: 400,
      body: JSON.stringify({ Error: error }),
    };
  }
};
module.exports = {
  putOfertas: middy(putOfertas)
    .use(jsonBodyParser())
    .use(urlencodeParser())
    .use(multiparDataParser()),
};
