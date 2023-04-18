const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middy = require("@middy/core");
const cors = require('@middy/http-cors');
const jsonBodyParser = require("@middy/http-json-body-parser");

const { mongoConect } = require("../../config/db");
mongoConect(process.env.MONGO_URI);

const login = async (event, context) => {
  const { user, password } = event.body;

  if (!user || !password)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Debe proporcionar usuario y contraseña" }),
    };

  try {
    const foundUser = await User.findOne({ user });
    if (foundUser == null)
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "usuario no encontrado" }),
      };
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7D",
      });
      return {
        statusCode: 200,
        body: JSON.stringify({ accessToken }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Usuario o contraseña incorrecta" }),
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
  login: middy(login)
    .use(jsonBodyParser())
    .use(cors({origins: ["https://rustika-front.vercel.app", "http://localhost:3000"], methods: "POST"}))
};
