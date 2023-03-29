const Offers = require("../../models/Ofertas");
const { mongoConect } = require("../../config/db");
const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");

const postOfertas = async (event, context) => {
  mongoConect(process.env.MONGO_URI);
  if (!event.body || event.body === null || event.body === "")
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: "no body" }),
    };
  const { image, initialDate, finalDate } = event.body;
  if (!image || !initialDate || !finalDate)
    return {
      statusCode: 400,
      body: JSON.stringify({ image, initialDate, finalDate }),
    };
  try {
    const newOffer = await Offers.create({
      image,
      initialDate,
      finalDate,
    });
    return {
      statusCode: 200,
      body: JSON.stringify(newOffer),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: error }),
    }
  }
};
module.exports = {
  postOfertas: middy(postOfertas)
    .use(jsonBodyParser())
};
