const discounts = require("../../models/Descuentos");
const { mongoConect } = require("../../config/db");
const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");

Date.prototype.isValid = function () {
  return this.getTime() === this.getTime();
};
const putDescuentos = async (event, context) => {
  mongoConect(process.env.MONGO_URI);
  if (!event.body || event.body === null || event.body === "")
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: "no body" }),
    };
  const { id, category, specific, finalDate, initialDate, percentage } = event.body;
  if (!id || (!category && !specific && !finalDate && !initialDate))
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: "faltan datos" }),
    };
  try {
    const discountToUpdate = await discounts.findById(id).exec();
    if (discountToUpdate == null)return {
      statusCode: 400,
      body: JSON.stringify({ Error: "No se encontro un descuento con ese ID" }),
    };
    if (percentage){
      discountToUpdate.percentage = percentage
    }
    if (category) {
      if (discountToUpdate.specific) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            Error: "No puedes cambiar el tipo de descuento",
          }),
        };
      }
      discountToUpdate.category = category;
    }
    if (specific) {
      if (discountToUpdate.category) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            Error: "No puedes cambiar el tipo de descuento",
          }),
        };
      }
      discountToUpdate.specific = specific;
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
      discountToUpdate.initialDate = initialDate;
      discountToUpdate.finalDate = finalDate;
    } else {
      if (initialDate) {
        const dateObjectInitialDate = new Date(initialDate);

        if (discountToUpdate.finalDate < dateObjectInitialDate)
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

        discountToUpdate.initialDate = initialDate;
      }
      if (finalDate) {
        const dateObjectFinalDate = new Date(finalDate);

        if (discountToUpdate.initialDate > dateObjectFinalDate)
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

        discountToUpdate.finalDate = finalDate;
      }
    }
    await discountToUpdate.save();
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
      body: JSON.stringify({ Error: error.message }),
    };
  }
};
module.exports = {
  putDescuentos: middy(putDescuentos).use(jsonBodyParser()),
};
