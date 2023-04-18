const discounts = require("../../models/Descuentos");
const { mongoConect } = require("../../config/db");
const middy = require("@middy/core");
const cors = require('@middy/http-cors');
const jsonBodyParser = require("@middy/http-json-body-parser");

Date.prototype.isValid = function () {
  return this.getTime() === this.getTime();
};
const postDescuentos = async (event, context) => {
  mongoConect(process.env.MONGO_URI);
  if (!event.body || event.body === null || event.body === "")
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: "no body" }),
    };
  const { percentage, category, specific, initialDate, finalDate } = event.body;
  if ((!category && !specific) || !initialDate || !finalDate || !percentage)
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: "Faltan datos" }),
    };
  if (category && specific)
    return {
      statusCode: 400,
      body: JSON.stringify({
        Error: "Un descuento no puede ser especifico y por categoria al tiempo",
      }),
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
    let newOffer;
    if (specific) {
      newOffer = await discounts.create({
        initialDate: dateObjectInitialDate,
        finalDate: dateObjectFinalDate,
        percentage: percentage,
        specific,
      });
    }
    if (category) {
      newOffer = await discounts.create({
        initialDate: dateObjectInitialDate,
        finalDate: dateObjectFinalDate,
        percentage : percentage,
        category,
      });
    }
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
  postDescuentos: middy(postDescuentos)
    .use(jsonBodyParser())
    .use(cors({origins: ["https://rustika-front.vercel.app", "http://localhost:3000"], methods: "POST"}))
};
