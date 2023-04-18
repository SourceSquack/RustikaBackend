const Offers = require("../../models/Ofertas");
const { mongoConect } = require("../../config/db");
const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");
const urlencodeParser = require("@middy/http-urlencode-body-parser");
const multiparDataParser = require("@middy/http-multipart-body-parser");
const { uploadFile } = require("../../services/uploadImage");

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
  const { image, initialDate, finalDate, name } = event.body;
  if (!image || !initialDate || !finalDate || !name)
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: "Faltan datos" }),
    };
  if (
    image.mimetype !== "image/png" &&
    image.mimetype !== "image/jpg" &&
    image.mimetype !== "image/webp"
  )
    return {
      statusCode: 400,
      body: JSON.stringify({
        Error: "Formato de archivo no sorportado: Formato enviado:" + image.mimetype,
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
    const extencion = image.mimetype.split("/")[1]
    const uploadedImage = await uploadFile(
      `oferta${name}.${extencion}`,
      image.content,
      image.mimetype
    );
    //validacion de error
    const newOffer = await Offers.create({
      name,
      image: uploadedImage.Location,
      initialDate: dateObjectInitialDate,
      finalDate: dateObjectFinalDate,
    });
    return {
      statusCode: 200,
      body: JSON.stringify(newOffer),
    };
  } catch (error) {
    console.log("ERROR:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: "error en el catch" }),
    };
  }
};
module.exports = {
  postOfertas: middy(postOfertas)
    .use(jsonBodyParser())
    .use(urlencodeParser())
    .use(multiparDataParser()),
};
