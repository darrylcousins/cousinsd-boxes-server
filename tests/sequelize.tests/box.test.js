const { Op } = require("sequelize");
const sequelize = require('sequelize');
const { UTCDateOnly } = require('../../src/lib');
const models = require('../../src/db/models');
const { createBox } = require('./../config/initdb');

afterAll(() => {
  return models.sequelize.drop();
});

beforeAll(() => {
  return models.sequelize.sync()
    .then(() => createBox());
});

test('sequelize: get box', () => {
  return models.Box.findOne({ 
    include: [
      {
        model: models.Product,
        attributes: ['shopify_title'],
        through: {
          attributes: ['isAddOn'],
        },
      },
      {
        model: models.ShopifyBox,
        attributes: ['shopify_product_id'],
      }
    ]
  })
    .then(box => {
      expect(box.shopify_title).toBe('Small Box');
      expect(box.ShopifyBox.shopify_product_id.length).toBe(14);
      expect(box.Products.length).toBe(2);
    });
});

test('sequelize: get boxes as delivery date and count', () => {
  return models.Box.findAll({
    attributes: ['delivered', [sequelize.fn('count', sequelize.col('Box.id')), 'count']],
    group: ['Box.delivered']
  })
    .then(boxes => {
      const data = boxes[0]; // get first row

      // XXX note that return date is UTC because it is stored that way!!!
      expect(new Date(data.delivered).toString()).toBe(UTCDateOnly().toString());

      // XXX note that count cannot be accessed with data.count!!!
      expect(parseInt(data.get('count'))).toBe(1);
    })

});

test('sequelize: find boxes by shopify box and count', () => {
  return models.Box.findAndCountAll({
    limit: 10,
    offset: 0,
    include: {
      model: models.ShopifyBox,
      where: {
        shopify_product_id: 31792460398333,
      },
      required: true,
    }
  })
    .then((data) => {
      expect(data.count).toBe(1);
      expect(data.rows.length).toBe(1);
    });
});

test('sequelize: find boxes by find and count all', () => {
  return models.Box.findAndCountAll({
    attributes: ['delivered', 'shopify_title'],
  })
    .then((data) => {
      expect(data.count).toBe(1);
      expect(data.rows.length).toBe(1);
      expect(data.rows[0].shopify_title).toBe('Small Box');
    });
});

test('sequelize: create box and check products', () => {
  const input = {
    shopify_title: "Large Box",
    shopify_handle: "large-box",
    shopify_variant_id: 31792460398555,
    shopify_price: 3500,
    delivered: new Date(),
    ShopifyBoxId: 1,
  };
  // XXX return instance from create does not include associations
  // Box.create(input, { include: ... }) does nothing to help
  // instance.reload({ include: ... }) also does not help at all
  return models.Box.create(input)
});
