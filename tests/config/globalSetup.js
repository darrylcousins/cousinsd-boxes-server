const { setUp } = require('./initdb');
const server = require('./server/app');

module.exports = async () => {
  global.httpServer = server;
  await global.httpServer.listen();
  await setUp();
};
