const {writeFileSync} = require('fs');
const Sequelize = require('sequelize');
const sequelizeErd = require('sequelize-erd');
const path = require("path")
const fs = require("fs")

const dbFolder = path.resolve(__dirname, '../db');
console.log(path.join(dbFolder, '/config/config.js'));
const config = require(path.resolve(__dirname, '../db/config/config.js'))['development'];
let includes = [];

(async function(){
  const db = new Sequelize(config.database, config.username, config.password, config);
  // Import DB models here
  fs
    .readdirSync(path.join(dbFolder, '/models'))
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      const model = require(path.join(dbFolder, '/models/', file))(db, Sequelize);
      console.log(model.name);
      includes.push(model.name);
    });

  console.log(includes);
  const svg = await sequelizeErd({
    source: db,
    arrowShapes: {  // Any of the below 4 options formatted ['startShape', 'endShape']. If excluded, the default is used.
      BelongsToMany: ['crow', 'crow'],  // Default: ['none', 'crow']
      BelongsTo: ['inv', 'crow'], // Default: ['crow', 'none']
      HasMany: ['crow', 'inv'], // Default: ['none', 'crow']
      HasOne: ['dot', 'dot'], // Default: ['none', 'none']
    },
    arrowSize: 1.2, // Default: 0.6
    lineWidth: 1, // Default: 0.75
    /* following fails
    include: includes,
    associations: includes,
    */
  }); // sequelizeErd() returns a Promise
  writeFileSync(path.join(__dirname, '/erd.svg'), svg);
})();
