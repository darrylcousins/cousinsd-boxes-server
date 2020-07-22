const path = require('path');
const { Op } = require("sequelize");
const sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'test';

const db = require('../../src/db/models');
const { 
  Box,
  Product,
  BoxProduct,
  Order,
  Subscriber,
  Subscription,
  SubscriptionType,
  ShopifyBox,
} = require('../../src/db/models');

test('node env is test', () => expect(process.env.NODE_ENV).toBe('test'));

test('get product', async () => {
  const product = await Product.findOne(
    {
      include: {
        model: Box,
      },
    }
  );
  //console.log(JSON.stringify(product, null, 2));
  expect(product.Boxes[0].shopify_title).toBe('Small Box');
  const box = await Box.findOne({ include: {
    model: Product,
    attributes: ['shopify_title'],
    through: {
      attributes: ['isAddOn'],
    }
  }});
  //console.log(JSON.stringify(box, null, 2));
  expect(box.shopify_title).toBe('Small Box');
});

test('get order', async () => {
  const order = await Order.findOne({
    attributes: ['shopify_title', 'shopify_order_id', 'shopify_line_item_id'],
    include: [
      {
        model: ShopifyBox,
        attributes: ['shopify_product_id'],
      },
      {
        model: Box,
        attributes: ['shopify_title', 'delivered'],
        include: {
          model: ShopifyBox,
          attributes: ['shopify_product_id'],
        },
        include: {
          model: Product,
          attributes: ['shopify_title'],
          through: {
            attributes: ['isAddOn'],
          }
        },
      },
      {
        model: Subscriber,
        attributes: ['uid', 'shopify_customer_id'],
        include: [
          {
            model: Subscription,
            attributes: ['uid'],
            include: {
              model: SubscriptionType,
              attributes: ['ShopifyBoxId'],
              include: {
                model: ShopifyBox,
                attributes: ['shopify_product_id'],
              },
            },
          },
          {
            model: Order,
            attributes: ['shopify_title'],
            include: {
              model: ShopifyBox,
              attributes: ['shopify_product_id'],
            },
          }
        ]
      },
      {
        model: Subscription,
        attributes: ['uid'],
        include: [
          {
            model: Subscriber,
            attributes: ['uid'],
          },
          {
            model: Order,
            attributes: ['shopify_title', 'shopify_order_id'],
          },
          {
            model: SubscriptionType,
            attributes: ['duration', 'frequency'],
            include: {
              model: ShopifyBox,
              attributes: ['shopify_product_id'],
            },
          },
        ]
      },
    ]
  });
  //console.log(JSON.stringify(order, null, 2));
  //console.log(JSON.stringify(await Order.count(), null, 2));
  expect(order.Box.shopify_title).toBe('Small Box');
  expect(order.Box.Products.length).toBe(2);
  expect(order.Subscriber.shopify_customer_id).toBe(4502212345999);
  expect(order.Subscriber.Orders.length).toBe(1);
  expect(order.Subscriber.Subscriptions.length).toBe(1);
  expect(order.Subscription.Orders.length).toBe(1);
  expect(order.Subscription.SubscriptionType.ShopifyBox.shopify_product_id).toBe(31792460398333);
});

test('get order by delivery and count', async () => {
  const dates = await Order.findOne({
    attributes: ['shopify_title', [sequelize.fn('count', sequelize.col('order.id')), 'count']],
    include: [
      {
        model: Box,
        attributes: ['delivered'],
        group: ['delivered'],
        order: [['delivered', 'ASC']],
        where: { 'delivered': { [Op.eq]: new Date() } },
      },
    ]
  });
});

test('get products by addon', async () => {
  const box = await Box.findOne({
    include: {
      model: Product,
      attributes: ['shopify_title'],
      through: {
        attributes: ['isAddOn'],
      }
    },
  });
  expect(box.Products.length).toBe(2);
  expect(box.Products.filter(product => product.BoxProduct.isAddOn).length).toBe(1);
  expect(box.Products.filter(product => !product.BoxProduct.isAddOn).length).toBe(1);

  const products = await Product.findAll({
    include: [
      {
        model: Box,
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
