const path = require('path');
const uuid = require('uuid');
const { Op } = require("sequelize");
const sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'test';

const db = require('../src/db/models');
const Product = db['Product'];
const Box = db['Box'];
const BoxProduct = db['BoxProduct'];
const Order = db['Order'];
const Subscriber = db['Subscriber'];
const Subscription = db['Subscription'];
const SubscriptionType = db['SubscriptionType'];
const ShopifyBox = db['ShopifyBox'];

beforeAll(async () => {
  await db.sequelize.sync({ alter: true });
  await db.sequelize.authenticate();

  const shopifyBox = ShopifyBox.build({
    shopify_product_id: 31792460398333,
  });
  await shopifyBox.save();

  const box = await Box.create({
    shopify_title: "Small Box",
    shopify_gid: "gid://shopify/Product/4502212345333",
    shopify_handle: "small-box",
    shopify_variant_id: 31792460398333,
    shopify_price: 2500,
    delivered: new Date(),
  });

  shopifyBox.addBox(box);


  const subscriptionType = SubscriptionType.build({
    duration: 0,
    frequency: 7,
  });
  await subscriptionType.save();
  shopifyBox.addSubscriptionType(subscriptionType);
  await shopifyBox.save();

  const subscriber = Subscriber.build({
    shopify_customer_id: "4502212345999",
  });
  await subscriber.save();

  const subscription = Subscription.build({
    shopify_product_id: 31792460398333,
    current_cart: {},
    last_cart: {},
  });
  await subscription.save();
  subscription.setSubscriptionType(subscriptionType);
  await subscription.save();
  subscription.setSubscriber(subscriber);
  await subscription.save();

  const order = Order.build({
    shopify_title: "Small Box",
    shopify_order_id: 4502212345333,
    shopify_line_item_id: 31792460398333,
  });
  /* note the save everytime! otherwise we make a new order every time!!! */
  await order.save();
  order.setBox(box)
  await order.save();
  order.setSubscription(subscription)
  await order.save();
  order.setSubscriber(subscriber)
  await order.save();
  shopifyBox.addOrder(order);
  await order.save();

});

test('node env is test', () => expect(process.env.NODE_ENV).toBe('test'));

test('get product', async () => {
  const product = await Product.findOne({ include: Box });
  console.log(JSON.stringify(product, null, 2));
  const box = await Box.findOne({ include: {
    model: Product,
    attributes: ['shopify_title'],
    through: {
      attributes: ['isAddOn'],
    }
  }});
  console.log(JSON.stringify(box, null, 2));
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
  console.log(JSON.stringify(order, null, 2));
  //console.log(JSON.stringify(await Order.count(), null, 2));
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
  console.log(JSON.stringify(dates, null, 2));
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
  console.log(JSON.stringify(box, null, 2));
  const productOne = await Product.create({
    shopify_title: "Green Beans",
    shopify_id: 4502212345444,
    shopify_gid: "gid://shopify/Product/4502212345444",
    shopify_handle: "green-beans",
    shopify_variant_id: 31792460398444,
    shopify_price: 450,
    available: true,
  });

  const productTwo = await Product.create({
    shopify_title: "Agria Potato",
    shopify_id: 4502212345914,
    shopify_gid: "gid://shopify/Product/4502212345914",
    shopify_handle: "agria-potato",
    shopify_variant_id: 31792460398650,
    shopify_price: 450,
    available: true,
  });
  await productTwo.addBox(box, { through: { isAddOn: false } });
  await productOne.addBox(box, { through: { isAddOn: true } });
  /*
  console.log(productTwo.id, productTwo.id);
  await BoxProduct.create({
    BoxId: box.id,
    ProductId: productTwo.id,
    isAddOn: false,
  });
  await BoxProduct.create({
    BoxId: box.id,
    ProductId: productOne.id,
    isAddOn: true,
  });
  */
  const product = await Product.findAll({
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
  console.log(JSON.stringify(product, null, 2));
});

afterAll(async () => {
  await db.sequelize.drop();
  await db.sequelize.close();
});

