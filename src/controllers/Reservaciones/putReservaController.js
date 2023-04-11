const booking = require("../../models/Reservas");
const { mongoConect } = require("../../config/db");
const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");

Date.prototype.isValid = function () {
  return this.getTime() === this.getTime();
};
const putReservation = async (event, context) => {
  mongoConect(process.env.MONGO_URI);
  if (!event.body || event.body === null || event.body === "")
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: "no body" }),
    };
  const { id, initialDateTime, finalDateTime, reason, decoration, amount } =
    event.body;
  if (
    !id ||
    !initialDateTime ||
    !finalDateTime ||
    !reason ||
    decoration === undefined ||
    !amount
  )
    return {
      statusCode: 400,
      body: JSON.stringify({
        Error: "No se proporciono un id o informacion para actualizar",
      }),
    };
  try {
    const reservationToUpdate = await booking.findById(id).exec();
    if (reservationToUpdate == null)
      return {
        statusCode: 400,
        body: JSON.stringify({
          Error: "No se encontro una reserva con ese ID",
        }),
      };
    const tomorrow = new Date();
    const day = tomorrow.getDate();
    tomorrow.setDate(day + 1);
    if (initialDateTime && finalDateTime) {
      const dateObjectInitialDate = new Date(initialDateTime);
      const dateObjectFinalDate = new Date(finalDateTime);
      if (dateObjectInitialDate < tomorrow)
        return {
          statusCode: 400,
          body: JSON.stringify({
            Error:
              "La reservacion se debe hacer con minimo de 24 horas de anticipacion",
          }),
        };
      const horaDeCierre = 20;
      if (dateObjectFinalDate.getHours() > horaDeCierre)
        return {
          statusCode: 400,
          body: JSON.stringify({
            Error: "La reservacion no puede exceder la hora de cierre",
          }),
        };
      if (!dateObjectFinalDate.isValid() || !dateObjectInitialDate.isValid())
        return {
          statusCode: 400,
          body: JSON.stringify({
            Error:
              "Formato de fecha inicial o final invalido Debe ser(yyyy-mm-ddT05:00:00.000Z)",
          }),
        };
      if (initialDateTime > finalDateTime)
        return {
          statusCode: 400,
          body: JSON.stringify({
            Error: "La fecha hora no puede ser despues de la final",
          }),
        };
      reservationToUpdate.initialDateTime = initialDateTime;
      reservationToUpdate.finalDateTime = finalDateTime;
    } else {
      if (initialDateTime) {
        const dateObjectInitialDate = new Date(initialDateTime);
        if (dateObjectInitialDate < tomorrow)
        return {
          statusCode: 400,
          body: JSON.stringify({
            Error:
              "La reservacion se debe hacer con minimo de 24 horas de anticipacion",
          }),
        };

        if (reservationToUpdate.finalDateTime < dateObjectInitialDate)
          return {
            statusCode: 400,
            body: JSON.stringify({
              Error: "La hora inicial no puede ser despues de la final",
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

        reservationToUpdate.initialDateTime = initialDateTime;
      }
      if (finalDateTime) {
        const dateObjectFinalDate = new Date(finalDateTime);

        const horaDeCierre = 20;
        if (dateObjectFinalDate.getHours() > horaDeCierre)
          return {
            statusCode: 400,
            body: JSON.stringify({
              Error: "La reservacion no puede exceder la hora de cierre",
            }),
          };

        if (reservationToUpdate.initialDateTime > dateObjectFinalDate)
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

        reservationToUpdate.finalDateTime = finalDateTime;
      }
    }
    await reservationToUpdate.save();
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
  putReservation: middy(putReservation).use(jsonBodyParser()),
};
