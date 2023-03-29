const {mongoConect} = require("../../config/db");
const dish = require('../../models/Platos');

const createDish = async (event) => {
    // if(!event.body) return {
    //     statusCode: 400,
    //     body: JSON.stringify({"Error": "Debes pasar los campos necesarios para crear el plato/bebida"})
    // };
    // const { dish } = event.body;
    mongoConect(process.env.MONGO_URI);

    const newDish = {
        name: "test",
        img: "awdawda",
        value: "500",
        description: "hola soy un test",
        category: "test",
        subcategory: "testS"
    }

    const dishNuevo = new dish(newDish);

    await dishNuevo.save();

    return {
        statusCode: 200,
        body: JSON.stringify({
            "message": dishNuevo
        })
    }
};

module.exports = { createDish }