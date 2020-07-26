const models = require('../../src/db/models');
const { createBox } = require('./../config/initdb');

afterAll(() => {
  return models.sequelize.sync({ force: true });
});

beforeAll(() => {
  return createBox();
});
/*
test('sequelize: get product', async () => {
  const product = await models.Product.findOne(
    {
      include: {
        model: models.Box,
      },
    }
  );
  //console.log(JSON.stringify(product, null, 2));
  expect(product.Boxes[0].shopify_title).toBe('Small Box');
});

test('sequelize: get products by addon', async () => {
  const box = await models.Box.findOne({
    include: {
      model: models.Product,
      attributes: ['shopify_title'],
      through: {
        attributes: ['isAddOn'],
      }
    },
  });
  expect(box.Products.length).toBe(2);
  expect(box.Products.filter(product => product.BoxProduct.isAddOn).length).toBe(1);
  expect(box.Products.filter(product => !product.BoxProduct.isAddOn).length).toBe(1);

  const products = await models.Product.findAll({
    include: [
      {
        model: models.Box,
        attributes: ['shopify_title'],
        through: {
          attributes: ['isAddOn'],
        }
      },
    ]
  });
  //console.log(JSON.stringify(products, null, 2));
  expect(products.length).toBe(2)
});
*/
