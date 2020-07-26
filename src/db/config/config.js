require('dotenv').config();
// sequelize uses this file

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOSTNAME,
    "dialect": process.env.DB_DIALECT,
    "operatorsAliases": '0',
    //"logging": (...msg) => console.log(msg)
  },
  "local": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOSTNAME,
    "dialect": process.env.DB_DIALECT,
    "operatorsAliases": '0',
  },
  /*
  "test": {
    "storage": "database.sqlite",
    "dialect": "sqlite",
    //"logging": (...msg) => console.log(msg),
    "logging": false,
  },
  */
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_TEST_NAME,
    "host": process.env.DB_HOSTNAME,
    "dialect": process.env.DB_DIALECT,
    "operatorsAliases": '0',
    //"logging": (...msg) => console.log(msg)
    "logging": false,
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOSTNAME,
    "dialect": "postgres",
    "use_env_variable": 'DATABASE_URL',
    "logging": false,
  }
}
