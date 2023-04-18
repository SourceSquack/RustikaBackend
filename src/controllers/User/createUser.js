const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const middy = require("@middy/core");
const cors = require('@middy/http-cors');
const jsonBodyParser = require("@middy/http-json-body-parser");
const { mongoConect } = require("../../config/db");
mongoConect(process.env.MONGO_URI);

const createUser = async (event, context) => {
  const { user, password, masterPassword } = event.body;
  console.log(user, password, masterPassword);
  if (!user || !password || !masterPassword)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Debe proporcionar usuario, contraseña y contraseña maestra",
      }),
    };
  try {
    if (masterPassword === "temp") {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ user, password: hashedPassword });
      return {
        statusCode: 201,
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
  createUser: middy(createUser)
    .use(jsonBodyParser())
    .use(cors({origins: ["https://rustika-front.vercel.app", "http://localhost:3000"], methods: "POST"}))
};
