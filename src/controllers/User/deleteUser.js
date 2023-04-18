const User = require("../../models/User");
const { mongoConect } = require("../../config/db");
const middy = require("@middy/core");
const cors = require('@middy/http-cors');
const jsonBodyParser = require("@middy/http-json-body-parser");
mongoConect(process.env.MONGO_URI);

const deleteUser = async (event, context) => {
  const { user, masterPassword } = event.body;

  if (!user || !masterPassword)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Debe proporcionar usuario y contraseña maestra",
      }),
    };
  try {
    if (masterPassword === "temp") {
      await User.findOneAndDelete({ user });
      return {
        statusCode: 200,
      };
    } else {
      return {
        statusCode: 401,
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error }),
    };
  }
};
module.exports = {
  deleteUser: middy(deleteUser)
    .use(jsonBodyParser())
    .use(cors({origins: ["https://rustika-front.vercel.app", "http://localhost:3000"], methods: "DELETE"}))
};
