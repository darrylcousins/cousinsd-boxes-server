const path = require('path');

const env = process.env.NODE_ENV || 'test';

( async () => {
  const db = require('./src/db/models');
  await db.sequelize.sync();
})();

