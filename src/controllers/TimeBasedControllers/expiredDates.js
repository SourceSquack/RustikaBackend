const { mongoConect } = require("../../config/db");
const Offers = require("../../models/Ofertas");
const discounts = require("../../models/Descuentos");
const booking = require("../../models/Reservas");
mongoConect(process.env.MONGO_URI);

const filterExpiredDates = async (event) => {
  const toDay = new Date();
  try {
    console.log("Filter dates execution");
    await Offers.deleteMany({ finalDate: { $lt: toDay } });
    //await discounts.deleteMany({ finalDate: { $lt: toDay } });
    await booking.updateMany(
      { finalDateTime: { $lt: toDay } },
      { active: false }
    );
    console.log("Filter dates completion");
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  filterExpiredDates,
};
