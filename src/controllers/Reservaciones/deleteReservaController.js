const booking = require("../../models/Reservas");
const { mongoConect } = require("../../config/db");
const middy = require("@middy/core");
const jsonBodyParser = require("@middy/http-json-body-parser");

const deleteReservation = async (event, context) => {
  mongoConect(process.env.MONGO_URI);
  const { id } = event.body;
  if (!id)
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: "No se recibio ningun ID" }),
    };
  try {
    await booking.deleteOne({ _id: id });
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
  deleteReservation: middy(deleteReservation)
    .use(jsonBodyParser())
};
