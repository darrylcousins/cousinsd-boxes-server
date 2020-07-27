'use strict';
const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

const getNext = (recent) => {
  // keep product ids unique in the set
  const myNext = () => getRandomInt(50);
  var next = myNext();
  while (next in recent) {
    next = myNext();
  };
  return next;
};

const build = new Array(3).fill(undefined).map((value, idx) => {

  const all = [];
  for (const num of [[3.8, false], [2.5, true]]) {
    var recent = [];
    var next = getNext(recent);
    for(var i=0; i<Math.floor(((idx+1.2))*num[0]-(idx*2)); i++) {
      recent.push(next);
      all.push({
        BoxId: idx + 1,
        ProductId: next,
        isAddOn: num[1],
        createdAt: "2020-07-04T00:00:00.000Z",
        updatedAt: "2020-07-17T00:00:00.000Z",
      });
      next = getNext(recent);
    };
  };
  return all;
});

const boxproducts = build.reduce((current, next) => {
  return current.concat(next);
}, []);

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('BoxProducts', boxproducts, {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('BoxProducts', null, {});
  }
};
  

