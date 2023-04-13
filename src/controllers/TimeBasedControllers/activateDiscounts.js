const { mongoConect } = require("../../config/db");
const discounts = require("../../models/Descuentos");
const platos = require("../../models/Platos");
const bebidas = require("../../models/Bebidas");
mongoConect(process.env.MONGO_URI);

const activate = async (event) => {
  const toDay = new Date();
  try {
    const validDiscounts = await discounts.find({
      initialDate: { $lte: toDay },
    });
    let updatedItems = 0;
    if (validDiscounts.length !== 0) {
      for await (const discount of validDiscounts) {
        if (discount.specific) {
          const plato = await platos.findOne({ name: discount.specific });
          const bebida = await bebidas.findOne({ name: discount.specific });
          if (plato) {
            plato.discount = true;
            plato.percentage = discount.percentage;
            plato.newValue = plato.value * ((100 - discount.percentage) / 100);
            await plato.save();
            updatedItems += 1;
          } else if (bebida) {
            bebida.discount = true;
            bebida.percentage = discount.percentage;
            if (bebida.valueUnit)
            bebida.newValueUnit =
              bebida.valueUnit * ((100 - discount.percentage) / 100);

          if (bebida.valueJug)
            bebida.newValueJug =
              bebida.valueJug * ((100 - discount.percentage) / 100);
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
              plato.discount = true;
              plato.percentage = discount.percentage;
              plato.newValue =
                plato.value * ((100 - discount.percentage) / 100);
              await plato.save();
              updatedItems += 1;
            }
          }
          if (bebidasToModify.length > 0) {
            for await (const bebida of bebidasToModify) {
              bebida.discount = true;
              bebida.percentage = discount.percentage;
              if (bebida.valueUnit)
                bebida.newValueUnit =
                  bebida.valueUnit * ((100 - discount.percentage) / 100);

              if (bebida.valueJug)
                bebida.newValueJug =
                  bebida.valueJug * ((100 - discount.percentage) / 100);

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
  activate,
};
