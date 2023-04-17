const jwt = require("jsonwebtoken");
const authorizer = async (event, context, callback) => {
  const route = event.routeArn;
  console.log(event, "1");
  if (!event.headers.authorization) {
    return {
      principalId: "anonymous",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: route,
          },
        ],
      },
    };
  }
  try {
    const response = jwt.verify(
      event.headers.authorization.split(" ")[1],
      process.env.ACCESS_TOKEN_SECRET
    );

    if (response && response.user) {
      return {
        principalId: "anonymous",
        policyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: "execute-api:Invoke",
              Effect: "Allow",
              Resource: route,
            },
          ],
        },
      };
    }
  } catch (error) {
    return {
      principalId: "anonymous",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: route,
          },
        ],
      },
    };
  }
};
module.exports = {
  authorizer,
};
