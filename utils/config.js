require("dotenv").config();

const env = process.env.NODE_ENV;

const getConnString = () => {
  if (env === "test") {
    return process.env.PG_CONNECTIONSTRING_TEST;
  } else if (env === "production") {
    return process.env.PG_CONNECTIONSTRING_PROD;
  } else {
    return process.env.PG_CONNECTIONSTRING_DEVL;
  }
};

module.exports = {
  PG_CONNECTION_STRING: getConnString(),
  JWT_SECRET: process.env.JWT_SECRET,
  ENV: env,
};