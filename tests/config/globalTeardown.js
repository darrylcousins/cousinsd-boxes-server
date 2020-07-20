const { tearDown } = require('./initdb');

module.exports = async () => {
  await global.httpServer.stop();
  await tearDown();
};
