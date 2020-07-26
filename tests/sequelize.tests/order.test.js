const { Op } = require("sequelize");
const sequelize = require('sequelize');
const models = require('../../src/db/models');

test('sequelize: get order', async () => {
  const order = await models.Order.findOne({
    attributes: ['shopify_title', 'shopify_order_id', 'shopify_line_item_id'],
    include: [
      {
        model: models.ShopifyBox,
        attributes: ['shopify_product_id'],
      },
      {
        model: models.Box,
        attributes: ['shopify_title', 'delivered'],
        include: {
          model: models.ShopifyBox,
          attributes: ['shopify_product_id'],
        },
        include: {
          model: models.Product,
          attributes: ['shopify_title'],
          through: {
            attributes: ['isAddOn'],
          }
        },
      },
      {
        model: models.Subscriber,
        attributes: ['uid', 'shopify_customer_id'],
        include: [
          {
            model: models.Subscription,
            attributes: ['uid'],
            include: {
              model: models.SubscriptionType,
              attributes: ['ShopifyBoxId'],
              include: {
                model: models.ShopifyBox,
                attributes: ['shopify_product_id'],
              },
            },
          },
          {
            model: models.Order,
            attributes: ['shopify_title'],
            include: {
              model: models.ShopifyBox,
              attributes: ['shopify_product_id'],
            },
          }
        ]
      },
      {
        model: models.Subscription,
        attributes: ['uid'],
        include: [
          {
            model: models.Subscriber,
            attributes: ['uid'],
          },
          {
            model: models.Order,
            attributes: ['shopify_title', 'shopify_order_id'],
          },
          {
            model: models.SubscriptionType,
            attributes: ['duration', 'frequency'],
            include: {
              model: models.ShopifyBox,
              attributes: ['shopify_product_id'],
            },
          },
        ]
      },
    ]
  });
  //console.log(JSON.stringify(order, null, 2));
  //console.log(JSON.stringify(await models.Order.count(), null, 2));
  expect(order.Box.shopify_title).toBe('Small Box');
  expect(order.Box.Products.length).toBe(2);
  expect(parseInt(order.Subscriber.shopify_customer_id)).toBe(4502212345999);
  expect(order.Subscriber.Orders.length).toBe(1);
  expect(order.Subscriber.Subscriptions.length).toBe(1);
  expect(order.Subscription.Orders.length).toBe(1);
  expect(parseInt(order.Subscription.SubscriptionType.ShopifyBox.shopify_product_id)).toBe(31792460398333);
});

test('sequelize: get order by delivery and count', async () => {
  const dates = await models.Order.findOne({
    attributes: ['Order.shopify_title', [sequelize.fn('count', sequelize.col('Order.id')), 'count']],
    group: ['Order.shopify_title', 'Box.id'],
    include: [
      {
        model: models.Box,
        attributes: ['delivered'],
        group: ['delivered'],
        order: [['delivered', 'ASC']],
        where: { 'delivered': { [Op.eq]: new Date() } },
        duplicating: false,
      },
    ]
  });
});


