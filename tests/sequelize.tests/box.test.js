const { Op } = require("sequelize");
const sequelize = require('sequelize');
const { UTCDateOnly } = require('../../src/lib');
const models = require('../../src/db/models');

test('sequelize: get box', async () => {
  const box = await models.Box.findOne({ include: {
    model: models.Product,
    attributes: ['shopify_title'],
    through: {
      attributes: ['isAddOn'],
    }
  }});
  //console.log(JSON.stringify(box, null, 2));
  expect(box.shopify_title).toBe('Small Box');
});

test('sequelize: get boxes as delivery date and count', async () => {
  const result = await models.Box.findAll({
    attributes: ['delivered', [sequelize.fn('count', sequelize.col('box.id')), 'count']],
  });

  const data = result[0]; // get first row

  // XXX note that return date is UTC because it is stored that way!!!
  expect(new Date(data.delivered).toString()).toBe(UTCDateOnly().toString());

  // XXX note that count cannot be accessed with data.count!!!
  expect(data.get('count')).toBe(1);

  const dates = []
  result.map((row) => {
      dates.push(row.toJSON())
  })
  // XXX but now count can be accessed with data.count
  expect(dates[0].count).toBe(1);
});

test('sequelize: find boxes by shopify box and count', async () => {
  const offset = 0;
  const limit = 10;

  const data = await models.Box.findAndCountAll({
    limit,
    offset,
    include: {
      model: models.ShopifyBox,
      where: {
        shopify_product_id: 31792460398333,
      },
      required: true,
    }
  });
  expect(data.count).toBe(1);
  expect(data.rows.length).toBe(1);
});

test('sequelize: find boxes by find and count all', async () => {
  const data = await models.Box.findAndCountAll({
    attributes: ['delivered', 'shopify_title'],
  });
  expect(data.count).toBe(1);
  expect(data.rows.length).toBe(1);
  expect(data.rows[0].shopify_title).toBe('Small Box');

});

test('sequelize: create box and add products', async () => {
  const shopify_product_id = 31792460398555;
  const [shopifyBox, created] = await models.ShopifyBox.findOrCreate({ where: { shopify_product_id } });
  const input = {
    shopify_title: "Large Box",
    shopify_handle: "large-box",
    shopify_variant_id: 31792460398555,
    shopify_price: 3500,
    delivered: new Date(),
    ShopifyBoxId: shopifyBox.id,
  };
  // XXX return instance from create does not include associations
  // Box.create(input, { include: ... }) does nothing to help
  // instance.reload({ include: ... }) also does not help at all
  await models.Box.create(input);
  const box = await models.Box.findOne(
    {
      where: { shopify_handle: input.shopify_handle },
      include: [models.Product, models.ShopifyBox]
    }
  );
  expect(box.ShopifyBox.shopify_product_id).toBe(shopifyBox.shopify_product_id);

  await box.destroy();
});

