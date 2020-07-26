const { dateOnly } = require('../../src/lib');
const db = require('../../src/db/models');

const tearDown = () => {
  return db.sequelize.drop()
    .then(() => db.sequelize.close());
};

const setUp = () => {
  //await db.sequelize.drop();
  return db.sequelize.sync({ alter: true, force: true })
    .then(() => db.sequelize.authenticate());
};

  // TODO need a better way to insert test data

const createBoxWithProducts = async () => {
  const shopifyBox = await db.ShopifyBox.findOrCreate({
    where: { id: 1 },
    defaults: { shopify_product_id: 31792460398333 }
  });

  const box = await db.Box.create({
    shopify_title: "Small Box",
    shopify_handle: "small-box",
    shopify_variant_id: 31792460398333,
    shopify_price: 2500,
    delivered: new Date(),
    ShopifyBoxId: 1
  });

  //box.setShopifyBox(shopifyBox);

  const productOne = await db.Product.create({
    shopify_title: "Green Beans",
    shopify_id: 4502212345444,
    shopify_handle: "green-beans",
    shopify_variant_id: 31792460398444,
    shopify_price: 450,
    available: true,
  });

  const productTwo = await db.Product.create({
    shopify_title: "Agria Potato",
    shopify_id: 4502212345914,
    shopify_handle: "agria-potato",
    shopify_variant_id: 31792460398650,
    shopify_price: 450,
    available: true,
  });
  await productTwo.addBox(box, { through: { isAddOn: false } });
  await productOne.addBox(box, { through: { isAddOn: true } });
};

const createSubscription = async () => {
  const shopifyBox = await db.ShopifyBox.findOne({ where: { id: 1 }});

  const subscriptionType = db.SubscriptionType.build({
    duration: 0,
    frequency: 7,
  });
  await subscriptionType.save();
  shopifyBox.addSubscriptionType(subscriptionType);
  await shopifyBox.save();

  const subscriber = db.Subscriber.build({
    shopify_customer_id: "4502212345999",
  });
  await subscriber.save();

  const subscription = db.Subscription.build({
    shopify_product_id: 31792460398333,
    current_cart: {},
    last_cart: {},
  });
  await subscription.save();
  subscription.setSubscriptionType(subscriptionType);
  await subscription.save();
  subscription.setSubscriber(subscriber);
  await subscription.save();

};

const createOrder = async () => {
  const order = db.Order.create({
    shopify_title: "Small Box",
    shopify_order_id: 4502212345333,
    shopify_line_item_id: 31792460398333,
  });
  /* note the save everytime! otherwise we make a new order every time!!! */
  await order.save();

  /*
  order.setBox(box)
  await order.save();
  order.setSubscription(subscription)
  await order.save();
  order.setSubscriber(subscriber)
  await order.save();
  shopifyBox.addOrder(order);
  await order.save();
  */
};

module.exports = {
  setUp,
  tearDown,
  createBoxWithProducts,
  createSubscription,
  createOrder
};
