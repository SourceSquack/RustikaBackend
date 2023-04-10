const booking = require("../../models/Reservas");
const { mongoConect } = require("../../config/db");
const jsonBodyParser = require("@middy/http-json-body-parser");
const middy = require("@middy/core")

const getReservation = async (event, context) => {
  mongoConect(process.env.MONGO_URI);
  try {
    if (event.body && event.body.history === true) {
      const allReservations = await booking.find({  });
      return {
        statusCode: 200,
        body: JSON.stringify(allReservations),
      };
    }else{
      const allActiveReservations = await booking.find({active: true});
      return {
        statusCode: 200,
        body: JSON.stringify(allActiveReservations),
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ Error: error }),
    };
  }
};
module.exports = {
  getReservation: middy(getReservation).use(jsonBodyParser()),
};
