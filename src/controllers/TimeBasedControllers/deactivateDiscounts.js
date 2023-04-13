const { mongoConect } = require("../../config/db");
const discounts = require("../../models/Descuentos");
const platos = require("../../models/Platos");
const bebidas = require("../../models/Bebidas");
mongoConect(process.env.MONGO_URI);

const deactivate = async (event) => {
  const toDay = new Date();
  try {
    const expiredDiscounts = await discounts.find({
      finalDate: { $gt: toDay },
    });
    let updatedItems = 0;
    if (expiredDiscounts.length !== 0) {
      for await (const discount of expiredDiscounts) {
        if (discount.specific) {
          const plato = await platos.findOne({ name: discount.specific });
          const bebida = await bebidas.findOne({ name: discount.specific });
          if (plato) {
            plato.discount = false;
            delete plato.percentage;
            delete plato.newValue;
            await plato.save();
            updatedItems += 1;
          } else if (bebida) {
            bebida.discount = false;
            delete bebida.percentage;
            delete bebida.newValue;
            await bebida.save();
            updatedItems += 1;
          }
        } else {
          const platosToModify = await platos.find({
            category: discount.category,
          });
          const bebidasToModify = await bebidas.find({
            subCategory: discount.category,
          });
          if (platosToModify.length > 0) {
            for await (const plato of platosToModify) {
              plato.discount = false;
              delete plato.percentage;
              delete plato.newValue;
              await plato.save();
              updatedItems += 1;
            }
          }
          if (bebidasToModify.length > 0) {
            for await (const bebida of bebidasToModify) {
              bebida.discount = false;
              delete bebida.percentage;
              if (bebida.newValueUnit) delete bebida.newValueUnit;
              if (bebida.newValueJug) delete bebida.newValueJug;
              await bebida.save();
              updatedItems += 1;
            }
          }
        }
      }
    }
    console.log("updated items: ", updatedItems);
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  deactivate,
};
