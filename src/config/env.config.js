require('dotenv').config();

const ENV = {
  SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET_KEY: process.env.SHOPIFY_API_SECRET_KEY,

  HOST: process.env.HOST,
  API_VERSION: process.env.API_VERSION,
  PORT: process.env.PORT,

  SHOP_NAME: process.env.SHOP_NAME,

  DB_HOSTNAME: process.env.DB_HOSTNAME,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DIALECT: process.env.DB_DIALECT,

  NODE_ENV: process.env.NODE_ENV,
};

module.exports = { ENV };
