const Offers = require("../../models/Ofertas");
const { mongoConect } = require("../../config/db");
const middy = require("@middy/core");
const urlencodeParser = require("@middy/http-urlencode-body-parser");
const jsonBodyParser = require("@middy/http-json-body-parser");
const multiparDataParser = require("@middy/http-multipart-body-parser");
const { uploadFile } = require("../../services/uploadImage");

Date.prototype.isValid = function () {
  return this.getTime() === this.getTime();
};
const putOfertas = async (event, context) => {
  mongoConect(process.env.MONGO_URI);
  if (!event.body || event.body === null || event.body === "")
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: "no body" }),
    };
  const { id, image, finalDate, initialDate } = event.body;
  if (!id || (!image && !finalDate && !initialDate))
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: event.body }),
    };
  try {
    const offerToUpdate = await Offers.findById(id).exec();
    if (offerToUpdate == null)
      return {
        statusCode: 400,
        body: JSON.stringify({ Error: "No se encontro una oferta con ese ID" }),
      };
    if (image) {
      if (
        image.mimetype !== "image/png" &&
        image.mimetype !== "image/jpeg" &&
        image.mimetype !== "image/webp"
      )
        return {
          statusCode: 400,
          body: JSON.stringify({
            Error:
              "Formato de archivo no sorportado: Formato enviado: " +
              image.mimetype,
          }),
        };
      const uploadedImage = await uploadFile(
        image.filename,
        image.content,
        "image/jpeg"
      );
      offerToUpdate.image = uploadedImage.Location;
    }
    if (initialDate && finalDate) {
      const dateObjectInitialDate = new Date(initialDate);
      const dateObjectFinalDate = new Date(finalDate);
      if (!dateObjectFinalDate.isValid() || !dateObjectInitialDate.isValid())
        return {
          statusCode: 400,
          body: JSON.stringify({
            Error:
              "Formato de fecha inicial o final invalido Debe ser(yyyy-mm-ddT05:00:00.000Z)",
          }),
        };
      if (initialDate > finalDate)
        return {
          statusCode: 400,
          body: JSON.stringify({
            Error: "La fecha inicial no puede ser despues de la final",
          }),
        };
      offerToUpdate.initialDate = initialDate;
      offerToUpdate.finalDate = finalDate;
    } else {
      if (initialDate) {
        const dateObjectInitialDate = new Date(initialDate);

        if (offerToUpdate.finalDate < dateObjectInitialDate)
          return {
            statusCode: 400,
            body: JSON.stringify({
              Error: "La fecha inicial no puede ser despues de la final",
            }),
          };

        if (!dateObjectInitialDate.isValid())
          return {
            statusCode: 400,
            body: JSON.stringify({
              Error:
                "Formato de fecha inicial invalido Debe ser(yyyy-mm-ddT05:00:00.000Z)",
            }),
          };

        offerToUpdate.initialDate = initialDate;
      }
      if (finalDate) {
        const dateObjectFinalDate = new Date(finalDate);

        if (offerToUpdate.initialDate > dateObjectFinalDate)
          return {
            statusCode: 400,
            body: JSON.stringify({
              Error: "La fecha final no puede ser despues de la inicial",
            }),
          };

        if (!dateObjectFinalDate.isValid())
          return {
            statusCode: 400,
            body: JSON.stringify({
              Error:
                "Formato de fecha final invalido Debe ser(yyyy-mm-ddT05:00:00.000Z)",
            }),
          };

        offerToUpdate.finalDate = finalDate;
      }
    }
    await offerToUpdate.save();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Actualizado" }),
    };
  } catch (error) {
    if (error.name === "CastError")
      return {
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
