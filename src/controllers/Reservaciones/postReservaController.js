const booking = require("../../models/Reservas");
const { mongoConect } = require("../../config/db");
const middy = require("@middy/core");
const cors = require('@middy/http-cors');
const jsonBodyParser = require("@middy/http-json-body-parser");
const { mailSender } = require("../../services/sendEmail");

Date.prototype.isValid = function () {
  return this.getTime() === this.getTime();
};
const postReservation = async (event, context) => {
  mongoConect(process.env.MONGO_URI);
  if (!event.body || event.body === null || event.body === "")
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: "no body" }),
    };
  const { initialDateTime, duration, reason, decoration, amount, email } =
    event.body;
  if (
    !initialDateTime ||
    !duration ||
    !reason ||
    decoration === undefined ||
    !amount ||
    !email
  )
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: "Faltan datos" }),
    };
  const tomorrow = new Date();
  const day = tomorrow.getDate();
  tomorrow.setDate(day + 1);

  const dateObjectFinalDate = new Date(initialDateTime);
  dateObjectFinalDate.setHours(dateObjectFinalDate.getHours() + duration[0]);
  const dateObjectInitialDate = new Date(initialDateTime);

  if (dateObjectInitialDate < tomorrow)
    return {
      statusCode: 400,
      body: JSON.stringify({
        Error:
          "La reservacion se debe hacer con minimo de 24 horas de anticipacion",
      }),
    };
  const horaDeCierre = 20;
  const horaDeApertura = 10;
  if (dateObjectFinalDate.getHours() > horaDeCierre)
    return {
      statusCode: 400,
      body: JSON.stringify({
        Error: "La reservacion no puede exceder la hora de cierre",
      }),
    };
  if (dateObjectInitialDate.getHours() < horaDeApertura)
    return {
      statusCode: 400,
      body: JSON.stringify({
        Error: "La reservacion no puede ser antes de la hora de apertura",
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
    let payed = true;
    if (decoration === true) payed = false;

    const newReservation = await booking.create({
      initialDateTime: dateObjectInitialDate,
      duration,
      reason,
      decoration,
      amount,
      active: true,
      payed,
      email,
    });
    await mailSender(
      email,
      "booking",
      `You made a reservation in rustika restaurant from ${dateObjectInitialDate.toLocaleString()} to ${dateObjectFinalDate.toLocaleString()}`
    );
    return {
      statusCode: 200,
      body: JSON.stringify(newReservation),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: error }),
    };
  }
};
module.exports = {
  postReservation: middy(postReservation)
    .use(jsonBodyParser())
    .use(cors({origins: ["https://rustika-front.vercel.app", "http://localhost:3000"], methods: "POST"}))
};
