const Offers = require("../../models/Ofertas");
const { mongoConect } = require("../../config/db");
const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");
const AWS = require("aws-sdk")
const s3 = new AWS.S3()
const fileType = require("file-type")

Date.prototype.isValid = function () {
  return this.getTime() === this.getTime();
};
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
      body: JSON.stringify({ Error: "Faltan datos" }),
    };
  const dateObjectInitialDate = new Date(initialDate);
  if (!dateObjectInitialDate.isValid())
    return {
      statusCode: 400,
      body: JSON.stringify({
        Error:
          "Formato de fecha inicial invalido Debe ser(yyyy-mm-ddT05:00:00.000Z)",
      }),
    };
  const dateObjectFinalDate = new Date(finalDate);
  if (!dateObjectFinalDate.isValid())
    return {
      statusCode: 400,
      body: JSON.stringify({
        Error:
          "Formato de fecha inicial invalido Debe ser(yyyy-mm-ddT05:00:00.000Z)",
      }),
    };
  if (dateObjectInitialDate > dateObjectFinalDate)
    return {
      statusCode: 400,
      body: JSON.stringify({
        Error: "La fecha inicial no puede superar a la fecha final",
      }),
    };
  try {
    const newOffer = await Offers.create({
      image,
      initialDate: dateObjectInitialDate,
      finalDate: dateObjectFinalDate,
    });
    return {
      statusCode: 200,
      body: JSON.stringify(newOffer),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: error }),
    };
  }
};
module.exports = {
  postOfertas: middy(postOfertas).use(jsonBodyParser()),
};
